import React, { useState, FormEvent } from 'react';
import { XMarkIcon, CheckCircleIcon, UserCircleIcon, PhoneIcon, MailIcon, PencilSquareIcon } from './icons';
import { updateReportWithContact } from '../services/supabaseService';
import { ContactDetails } from '../types';

interface ContactModalProps {
    onClose: () => void;
    onSubmitSuccess: (details: ContactDetails) => void;
    reportUrlId: string;
}

const auditBenefits = [
    "In-depth Technical SEO Foundation Audit",
    "Public Profile & Job Listing Optimization",
    "Answer & Generative Engine Optimization (AEO/GEO)",
    "Content Strategy & On-Page SEO Overhaul",
    "KPIs like 25-40% organic traffic increase in 3 months",
    "Establish authority in your niche across the country"
];

export const ContactModal: React.FC<ContactModalProps> = ({ onClose, onSubmitSuccess, reportUrlId }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateReportWithContact(reportUrlId, formData);
            onSubmitSuccess(formData);
        } catch (err) {
            console.error("Failed to submit contact details:", err);
            setError("Submission failed. Please try again in a moment.");
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl mx-4 animate-slide-in-up max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex justify-end">
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 p-4 pt-0 md:p-8 md:pt-0">
                    {/* Left Side: Information */}
                    <div className="text-left">
                        <h2 id="contact-modal-title" className="text-3xl font-bold text-text-primary">
                            Unlock Your Full Potential with a <span className="text-brand-primary">Comprehensive SEO Audit</span>
                        </h2>
                        <p className="text-text-secondary mt-4">
                            This AI report is just the beginning. Our experts can provide a full, manual audit tailored to your business goals, implementing strategies that drive real growth.
                        </p>
                        <ul className="space-y-3 mt-6">
                            {auditBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-text-primary">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-sm text-text-secondary p-4 bg-slate-50 border border-slate-200 rounded-lg">
                            Fill out the form to get a <span className="font-bold text-text-primary">free, no-obligation consultation</span> with an SEO specialist.
                        </p>
                    </div>

                    {/* Right Side: Form */}
                    <div>
                        <div className="bg-slate-50/80 p-6 rounded-xl border border-slate-200">
                            <h3 className="text-xl font-bold text-center text-text-primary mb-4">Request Your Free Consultation</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-md py-3 pl-10 pr-4 text-text-primary focus:ring-2 focus:ring-brand-primary transition" />
                                </div>
                                 <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-md py-3 pl-10 pr-4 text-text-primary focus:ring-2 focus:ring-brand-primary transition" />
                                </div>
                                <div className="relative">
                                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="email" name="email" placeholder="Email Address*" required value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-slate-300 rounded-md py-3 pl-10 pr-4 text-text-primary focus:ring-2 focus:ring-brand-primary transition" />
                                </div>
                                <div className="relative">
                                    <PencilSquareIcon className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                    <textarea name="description" placeholder="Your Expectations / Description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-white border border-slate-300 rounded-md py-3 pl-10 pr-4 text-text-primary focus:ring-2 focus:ring-brand-primary transition"></textarea>
                                </div>
                                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105">
                                    {isSubmitting ? "Submitting..." : "Get My Free Consultation"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};