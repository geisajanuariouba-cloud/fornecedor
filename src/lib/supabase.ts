import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Cliente público (browser)
export const supabase = createClient(url, anonKey);

// Cliente servidor — usa service role key, nunca exposto no browser
export const supabaseAdmin = createClient(url, serviceKey);
