import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to parse JSONB fields from Supabase
export function parseJsonField(field: any) {
  if (!field) return null;
  
  // If field is already an object, return it
  if (typeof field === 'object' && !Array.isArray(field)) {
    return field;
  }
  
  // If field is a string, try to parse it as JSON
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (error) {
      console.error('Error parsing JSON field:', error);
      return null;
    }
  }
  
  return null;
}
