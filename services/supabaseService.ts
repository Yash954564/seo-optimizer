import { createClient } from '@supabase/supabase-js';
import { SeoReport, ContactDetails } from '../types';

const supabaseUrl = 'https://pieyplqyszyarodkfibp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZXlwbHF5c3p5YXJvZGtmaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzU2OTcsImV4cCI6MjA3NDgxMTY5N30.hiMEOit-lCLgOlhhkzyWiP3WrhXnPM1QI_WWoZDcqPE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetches the user's public IP address.
 * @returns The user's IP address or null if an error occurs.
 */
export const getIpAddress = async (): Promise<string | null> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            console.error('Failed to fetch IP address, status:', response.status);
            return null;
        }
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to fetch IP address:', error);
        return null;
    }
};

/**
 * Logs the start of an analysis by creating a placeholder record in the database.
 * @param url The URL being analyzed.
 * @param ip The user's IP address.
 * @returns The unique, shareable URL ID (urlid) for the analysis record.
 */
export const logAnalysisStart = async (url: string, ip: string): Promise<string> => {
    const urlid = crypto.randomUUID();
    const { data, error } = await supabase
        .from('urls')
        .insert([{
            url: url,
            ip: ip,
            urlid: urlid,
            process: false
        }])
        .select('urlid')
        .single();
    
    if (error) {
        console.error('Error logging analysis start:', error);
        throw error;
    }

    if (!data || !data.urlid) {
        throw new Error('Failed to log analysis start: No urlid returned.');
    }

    return data.urlid;
};


/**
 * Saves the full SEO report results and user email to an existing analysis record.
 * @param report The full SeoReport object, which must contain a urlid.
 * @param email The user's email address.
 * @returns The unique, shareable URL ID (urlid) of the updated report.
 */
export const saveAnalysisResults = async (report: SeoReport, email: string): Promise<string> => {
    if (!report.urlid) {
        throw new Error("Cannot save report without a urlid.");
    }

    const { data, error } = await supabase
        .from('urls')
        .update({
            report: report,
            email: email,
            process: true,
        })
        .eq('urlid', report.urlid)
        .select('urlid')
        .single();
    
    if (error) {
        console.error('Error saving analysis results:', error);
        throw error;
    }

    if (!data || !data.urlid) {
        throw new Error('Failed to save analysis results: No urlid returned after update.');
    }
    
    return data.urlid;
};


/**
 * Retrieves a specific SEO report by its unique shareable ID.
 * @param urlid The shareable ID of the report to fetch.
 * @returns The SeoReport object or null if not found.
 */
export const getReportByUrlId = async (urlid: string): Promise<SeoReport | null> => {
    const { data, error } = await supabase
        .from('urls')
        .select('report, contact')
        .eq('urlid', urlid) // Query by the new 'urlid' column
        .single();

    if (error) {
        console.error('Error fetching report by urlid:', error.message);
        return null;
    }
    
    if (!data) {
      return null;
    }

    const reportObject = data.report as SeoReport;

    if (typeof reportObject !== 'object' || reportObject === null || !reportObject.scores || !reportObject.url) {
        console.warn("Fetched report object is malformed or missing essential data.", reportObject);
        return null;
    }

    if (data.contact) {
        reportObject.contact = data.contact;
    }

    return reportObject as SeoReport;
};


/**
 * Retrieves the most recent completed report for a given URL.
 * @param url The URL to check for an existing report.
 * @returns A SeoReport object with its urlid, or null if not found.
 */
export const getReportByUrl = async (url: string): Promise<(SeoReport & { urlid: string }) | null> => {
    const { data, error } = await supabase
        .from('urls')
        .select('report, contact, urlid')
        .eq('url', url)
        .eq('process', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) {
        if (error && error.code !== 'PGRST116') { // Ignore 'single row not found' error
             console.error('Error fetching report by url:', error.message);
        }
        return null;
    }
    
    const reportObject = data.report as SeoReport;
     if (typeof reportObject !== 'object' || reportObject === null || !reportObject.scores) {
        console.warn("Fetched report object is malformed or missing essential data.", reportObject);
        return null;
    }

    if (data.contact) {
        reportObject.contact = data.contact;
    }

    return { ...reportObject, urlid: data.urlid };
};

/**
 * Gets the number of completed analyses for a given IP address.
 * @param ip The user's IP address.
 * @returns The number of reports created by that IP.
 */
export const getAnalysisCountForIp = async (ip: string): Promise<number> => {
    const { count, error } = await supabase
        .from('urls')
        .select('*', { count: 'exact', head: true })
        .eq('ip', ip)
        .eq('process', true);

    if (error) {
        console.error('Error fetching analysis count for IP:', error);
        // Don't block the user if the check fails, just let them proceed.
        return 0;
    }

    return count || 0;
};


/**
 * Fetches the total number of saved, completed reports from the database.
 */
export const getTotalAnalyses = async (): Promise<number> => {
    const { count, error } = await supabase
        .from('urls')
        .select('*', { count: 'exact', head: true })
        .eq('process', true);

    if (error) {
        console.error('Error fetching total analyses count:', error);
        throw error;
    }

    return count || 0;
};

/**
 * Saves contact details to an existing report entry.
 * @param urlid The unique ID of the report.
 * @param contactDetails The contact details to save.
 */
export const updateReportWithContact = async (urlid: string, contactDetails: ContactDetails): Promise<void> => {
    const { error } = await supabase
        .from('urls')
        .update({ contact: contactDetails })
        .eq('urlid', urlid);

    if (error) {
        console.error('Error updating report with contact details:', error);
        throw error;
    }
};