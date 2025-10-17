import { createClient } from '@supabase/supabase-js';
import { SeoReport, ContactDetails } from '../types';

const supabaseUrl = 'https://pieyplqyszyarodkfibp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZXlwbHF5c3p5YXJvZGtmaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzU2OTcsImV4cCI6MjA3NDgxMTY5N30.hiMEOit-lCLgOlhhkzyWiP3WrhXnPM1QI_WWoZDcqPE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Saves a complete SEO report to the database and generates a unique shareable ID.
 * @param report The full SeoReport object.
 * @param email The user's email address.
 * @returns The unique, shareable URL ID (urlid) of the newly saved report.
 */
export const saveReport = async (report: SeoReport, email: string): Promise<string> => {
    // 1. Generate a unique, long string for sharing.
    const urlid = crypto.randomUUID();

    // 2. Insert the report along with the generated urlid.
    const { data, error } = await supabase
        .from('urls')
        .insert([{ 
            url: report.url, 
            email: email,
            report: report,
            urlid: urlid
        }])
        .select('urlid')
        .single();

    if (error) {
        console.error('Error saving report:', error);
        throw error;
    }

    if (!data || !data.urlid) {
        throw new Error('Failed to save report: No urlid was returned.');
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
 * Fetches the total number of saved reports from the database.
 */
export const getTotalAnalyses = async (): Promise<number> => {
    const { count, error } = await supabase
        .from('urls')
        .select('*', { count: 'exact', head: true });

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