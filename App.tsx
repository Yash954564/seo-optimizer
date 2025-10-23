import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { ReportDashboard } from './components/ReportDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SeoReport, ContactDetails } from './types';
import { analyzeWebsite } from './services/geminiService';
import { getReportByUrlId, getIpAddress, getAnalysisCountForIp, getReportByUrl, logAnalysisStart } from './services/supabaseService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { EmailModal } from './components/EmailModal';
import { UnlockButton } from './components/UnlockButton';
import { Chatbot } from './components/Chatbot';
import { CopyProtectionModal } from './components/CopyProtectionModal';
import { ChatAccessModal } from './components/ChatAccessModal';
import { ContactModal } from './components/ContactModal';


const App: React.FC = () => {
  const [report, setReport] = useState<SeoReport | null>(null);
  const [reportUrlId, setReportUrlId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isLoadingShared, setIsLoadingShared] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isReportLocked, setIsReportLocked] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showChatAccessModal, setShowChatAccessModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactModalTrigger, setContactModalTrigger] = useState<'copy' | 'chat' | null>(null);
  const [userIp, setUserIp] = useState<string | null>(null);


  const reportRef = useRef<HTMLDivElement>(null);
  
  // Feature access is now derived directly from whether contact info exists on the report
  const isCopyAllowed = !!report?.contact;
  const isChatAllowed = !!report?.contact;

  useEffect(() => {
    const fetchIp = async () => {
        const ip = await getIpAddress();
        setUserIp(ip);
    };
    fetchIp();

    // Check for a shared report ID in the URL on initial load
    const loadSharedReport = async () => {
        const params = new URLSearchParams(window.location.search);
        const sharedUrlId = params.get('urlid');
        if (sharedUrlId) {
            try {
                setIsAnalyzing(true); // Show loader while fetching
                const fetchedReport = await getReportByUrlId(sharedUrlId);
                if (fetchedReport) {
                    setReport(fetchedReport);
                    setReportUrlId(sharedUrlId);
                    setIsReportLocked(false); // Shared reports are always unlocked
                } else {
                    setError(`Could not find a report with ID: ${sharedUrlId}. Please check the link.`);
                }
            } catch (err) {
                console.error("Error loading shared report:", err);
                setError("Failed to load the shared report. The link may be invalid or expired.");
            } finally {
                setIsAnalyzing(false);
            }
        }
        setIsLoadingShared(false);
    };
    loadSharedReport();
  }, []);

  useEffect(() => {
    const handleCopy = (event: ClipboardEvent) => {
        // Only apply copy protection if a report is being viewed and features aren't unlocked
        if (report && !isCopyAllowed) {
            event.preventDefault();
            setShowCopyModal(true);
        }
    };

    document.addEventListener('copy', handleCopy);

    return () => {
        document.removeEventListener('copy', handleCopy);
    };
  }, [report, isCopyAllowed]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
        setNotification(null);
    }, 3000);
  };

  const handleAnalysis = useCallback(async (mainUrl: string, subPages: string[]) => {
    setError(null);
    setReport(null);
    setReportUrlId(null);
    setIsReportLocked(true);
    setShowEmailModal(false);
    setIsAnalyzing(true);

    // 0. Log the analysis request immediately to get a persistent ID
    let newUrlId: string | null = null;
    if (userIp) {
        try {
            newUrlId = await logAnalysisStart(mainUrl, userIp);
            setReportUrlId(newUrlId);
        } catch (err) {
            console.error("Failed to log analysis request:", err);
            setError("Failed to initiate analysis session. Please try again.");
            setIsAnalyzing(false);
            return;
        }
    } else {
        console.warn("Could not get user IP. Cannot log analysis request.");
        // We can proceed, but saving the report will fail later.
        // The UI should ideally handle this, but for now we warn.
    }

    // 1. Rate Limiting Check
    if (userIp) {
        const analysisCount = await getAnalysisCountForIp(userIp);
        if (analysisCount >= 3) {
            showNotification("Limit reached — maximum of 3 analyses allowed.");
            setIsAnalyzing(false);
            return;
        }
    } else {
        console.warn("Could not get user IP. Rate limiting is disabled for this session.");
    }

    // 2. Caching Check
    try {
        const existingReport = await getReportByUrl(mainUrl);
        if (existingReport) {
            showNotification("Loading existing report for this URL.");
            setReport(existingReport);
            setReportUrlId(existingReport.urlid);
            setIsReportLocked(false); // Cached reports are already unlocked
            setIsAnalyzing(false);
            return;
        }
    } catch (err) {
        console.error("Error checking for existing report:", err);
        // If the check fails, proceed with a new analysis.
    }

    // 3. New Analysis
    try {
      const result = await analyzeWebsite(mainUrl, subPages);
      // Attach the persistent urlid generated earlier to the report object
      const finalReport = { ...result, urlid: newUrlId ?? undefined };
      setReport(finalReport);
    } catch (err) {
      console.error(err);
      setError('Failed to generate SEO report. The AI model may be overloaded or returned an invalid response. Please try again in a moment.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [userIp]);

  const handleDownloadPdf = useCallback(() => {
    if (reportRef.current) {
      setIsGeneratingPdf(true);
      html2canvas(reportRef.current, {
        backgroundColor: '#F8F9FA',
        scale: 2,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`seo-report-${report?.url.replace(/https?:\/\//, '').split('/')[0]}.pdf`);
        setIsGeneratingPdf(false);
      }).catch(err => {
        setError('Failed to generate PDF.');
        setIsGeneratingPdf(false);
      });
    }
  }, [report]);
  
  const handleSaveSuccess = (newReportUrlId: string) => {
    setReportUrlId(newReportUrlId);
    setIsReportLocked(false);
    setShowEmailModal(false);
  };

  const handleAllowCopy = () => {
      setShowCopyModal(false);
      setContactModalTrigger('copy');
      setShowContactModal(true);
  };

  const handleCloseCopyModal = () => {
    setShowCopyModal(false);
  };

  const handleAllowChat = () => {
      setShowChatAccessModal(false);
      setContactModalTrigger('chat');
      setShowContactModal(true);
  };

  const handleCloseChatAccessModal = () => {
    setShowChatAccessModal(false);
  };

  const handleContactSubmitSuccess = (contactDetails: ContactDetails) => {
      setShowContactModal(false);
      setReport(prevReport => {
          if (!prevReport) return null;
          return { ...prevReport, contact: contactDetails };
      });
      showNotification('Thank you! An expert will be in touch and features are unlocked.');
      setContactModalTrigger(null);
  };

  const handleContactModalClose = () => {
      setShowContactModal(false);
      setContactModalTrigger(null);
  };

  const renderContent = () => {
    if (isLoadingShared) return null; // Wait until URL check is complete
    if (isAnalyzing) return <LoadingSpinner message={new URLSearchParams(window.location.search).get('urlid') ? 'Loading shared report...' : undefined} />;

    if (error) {
        return (
            <div className="mt-8 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-fade-in" role="alert">
              <p className="font-bold">An Error Occurred</p>
              <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (report) {
        return (
            <>
                <div ref={reportRef} className="bg-transparent">
                    <ReportDashboard 
                      report={report} 
                      onDownloadPdf={handleDownloadPdf} 
                      isPdfMode={isGeneratingPdf} 
                      isReportLocked={isReportLocked}
                      reportUrlId={reportUrlId}
                      showNotification={showNotification}
                    />
                </div>
                {isReportLocked && !isGeneratingPdf && (
                    <UnlockButton onClick={() => setShowEmailModal(true)} />
                )}
                {showEmailModal && report && (
                    <EmailModal 
                        report={report}
                        onClose={() => setShowEmailModal(false)}
                        onSaveSuccess={handleSaveSuccess}
                    />
                )}
                {!isReportLocked && (
                  <Chatbot 
                    report={report} 
                    isChatAllowed={isChatAllowed}
                    onRequestAccess={() => setShowChatAccessModal(true)}
                  />
                )}
            </>
        );
    }

    return <WelcomeScreen />;
  }

  return (
    <div className="min-h-screen text-text-primary font-sans">
        <Header />
        <main className="container mx-auto px-4 py-8">
            <UrlInputForm onAnalyze={handleAnalysis} isLoading={isAnalyzing} />
            {renderContent()}
        </main>
        {notification && (
            <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-down-fade-in">
                {notification}
            </div>
        )}
        {showCopyModal && (
            <CopyProtectionModal
                onAllow={handleAllowCopy}
                onCheck={handleCloseCopyModal}
                onCancel={handleCloseCopyModal}
            />
        )}
        {showChatAccessModal && (
            <ChatAccessModal
                onAllow={handleAllowChat}
                onCheck={handleCloseChatAccessModal}
                onCancel={handleCloseChatAccessModal}
            />
        )}
        {showContactModal && reportUrlId && (
            <ContactModal
                onClose={handleContactModalClose}
                onSubmitSuccess={handleContactSubmitSuccess}
                reportUrlId={reportUrlId}
            />
        )}
    </div>
  );
};

export default App;