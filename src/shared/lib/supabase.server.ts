// Server-only Supabase client.
// Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE in .env.local
import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE!; // NEVER expose to client

export function getServiceClient() {
  if (!url || !serviceKey) {
    throw new Error("Supabase URL/Service key missing in server env.");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}