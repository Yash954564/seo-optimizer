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
import { UnlockButton } from './components/UnlockButton';
import { EmailModal } from './components/EmailModal';


const App: React.FC = () => {
  const [report, setReport] = useState<SeoReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isReportLocked, setIsReportLocked] = useState<boolean>(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalysis = useCallback(async (mainUrl: string) => {
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setIsReportLocked(true); // Reset lock state on new analysis
    try {
      const result = await analyzeWebsite(mainUrl);
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
        backgroundColor: '#0f172a', // Corresponds to bg-slate-900
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

  const handleUnlockReport = () => {
    setIsReportLocked(false);
    setIsEmailModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UrlInputForm onAnalyze={handleAnalysis} isLoading={isAnalyzing} />
        {isAnalyzing && <LoadingSpinner message="AI is analyzing your website..." />}
        {error && (
          <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg animate-fade-in" role="alert">
            <p className="font-bold">An Error Occurred</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isAnalyzing && !report && !error && <WelcomeScreen />}
        {report && (
           <div ref={reportRef} className="bg-slate-900">
              <ReportDashboard 
                report={report} 
                onDownloadPdf={handleDownloadPdf} 
                isPdfMode={isGeneratingPdf} 
                isReportLocked={isReportLocked}
              />
           </div>
        )}
         {report && isReportLocked && !isGeneratingPdf && (
            <UnlockButton onClick={() => setIsEmailModalOpen(true)} />
        )}
        {isEmailModalOpen && report && (
            <EmailModal 
                onClose={() => setIsEmailModalOpen(false)} 
                onSubmit={handleUnlockReport}
                url={report.url}
            />
        )}
      </main>
    </div>
  );
};

export default App;