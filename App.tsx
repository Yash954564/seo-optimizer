import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { ReportDashboard } from './components/ReportDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SeoReport } from './types';
import { analyzeWebsite } from './services/geminiService';
import { getReportByUrlId } from './services/supabaseService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { EmailModal } from './components/EmailModal';
import { UnlockButton } from './components/UnlockButton';
import { Chatbot } from './components/Chatbot';


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

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const handleAnalysis = useCallback(async (mainUrl: string, subPages: string[]) => {
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setReportUrlId(null);
    setIsReportLocked(true);
    setShowEmailModal(false);

    try {
      const result = await analyzeWebsite(mainUrl, subPages);
      setReport(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate SEO report. The AI model may be overloaded or returned an invalid response. Please try again in a moment.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

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

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
        setNotification(null);
    }, 3000);
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
                {showEmailModal && (
                    <EmailModal 
                        report={report}
                        onClose={() => setShowEmailModal(false)}
                        onSaveSuccess={handleSaveSuccess}
                    />
                )}
                {!isReportLocked && (
                  <Chatbot report={report} />
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
    </div>
  );
};

export default App;