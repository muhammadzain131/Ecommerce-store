import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://psxjsxrqhhuesmhirtop.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeGpzeHJxaGh1ZXNtaGlydG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Mzk1OTMsImV4cCI6MjA3NjMxNTU5M30.DSA1xUcwF-xjFtfhCoTiaqb3CohWJsHpKTWUQH4gTOE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
