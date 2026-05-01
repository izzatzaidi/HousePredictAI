import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL     || "https://dbhvnszmlclsfwqyquhn.supabase.co";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiaHZuc3ptbGNsc2Z3cXlxdWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTEzMjYsImV4cCI6MjA5MzEyNzMyNn0.3sHHWztXrgbcoS7AX4QoaXMCUJ7CHGrqWGWDKOndBtE";

export const supabase = createClient(url, key);
