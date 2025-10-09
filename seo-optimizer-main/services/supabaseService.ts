import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pieyplqyszyarodkfibp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZXlwbHF5c3p5YXJvZGtmaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzU2OTcsImV4cCI6MjA3NDgxMTY5N30.hiMEOit-lCLgOlhhkzyWiP3WrhXnPM1QI_WWoZDcqPE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Logs the initial URL analysis request to the database.
 * Ignores errors for duplicate URLs.
 */
export const logUrlAnalysis = async (url: string): Promise<void> => {
    const { error } = await supabase
        .from('urls')
        .insert([{ url: url, email: null }]);
    
    // Ignore primary key violations (URL already exists), but throw other errors.
    if (error && error.code !== '23505') {
        throw error;
    }
};

/**
 * Saves the user's email for a specific analyzed URL.
 * It will update the existing record or insert a new one as a fallback.
 */
export const saveEmailForUrl = async (url: string, email: string): Promise<void> => {
    const { error: updateError } = await supabase
        .from('urls')
        .update({ email: email })
        .eq('url', url);

    if (updateError) {
         // If the row to update wasn't found, insert it as a fallback.
         if (updateError.code === 'PGRST116') {
             const { error: insertError } = await supabase
                .from('urls')
                .insert([{ url: url, email: email }]);
             if (insertError) throw insertError;
         } else {
            throw updateError;
         }
    }
};

/**
 * Fetches the total number of analyzed URLs from the database.
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