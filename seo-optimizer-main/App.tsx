import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { ReportDashboard } from './components/ReportDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SeoReport } from './types';
import { analyzeWebsite } from './services/geminiService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { EmailModal } from './components/EmailModal';
import { UnlockButton } from './components/UnlockButton';
import { Chatbot } from './components/Chatbot';


const App: React.FC = () => {
  const [report, setReport] = useState<SeoReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isReportLocked, setIsReportLocked] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [analyzedUrl, setAnalyzedUrl] = useState<string>('');

  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalysis = useCallback(async (mainUrl: string, subPages: string[]) => {
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setIsReportLocked(true);
    setShowEmailModal(false);
    setAnalyzedUrl(mainUrl);

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
        backgroundColor: '#F8F9FA', // Corresponds to light theme bg
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
  
  const handleUnlockSuccess = () => {
    setIsReportLocked(false);
    setShowEmailModal(false);
  };

  return (
    <div className="min-h-screen text-text-primary font-sans">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <UrlInputForm onAnalyze={handleAnalysis} isLoading={isAnalyzing} />
          {isAnalyzing && <LoadingSpinner />}
          {error && (
            <div className="mt-8 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-fade-in" role="alert">
              <p className="font-bold">An Error Occurred</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isAnalyzing && !report && !error && <WelcomeScreen />}
          {report && (
            <div ref={reportRef} className="bg-transparent">
                <ReportDashboard 
                  report={report} 
                  onDownloadPdf={handleDownloadPdf} 
                  isPdfMode={isGeneratingPdf} 
                  isReportLocked={isReportLocked}
                />
            </div>
          )}
          {report && isReportLocked && !isGeneratingPdf && (
              <UnlockButton onClick={() => setShowEmailModal(true)} />
          )}
          {showEmailModal && (
              <EmailModal 
                  onClose={() => setShowEmailModal(false)}
                  onSubmit={handleUnlockSuccess}
                  url={analyzedUrl}
              />
          )}

          {report && !isReportLocked && (
            <Chatbot report={report} />
          )}
        </main>
    </div>
  );
};

export default App;
