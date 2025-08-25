// Small helper to get auth state
"use server"
import { supabase } from "./supabase-client";
export async function getAuth() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error.message);
    return null;
  }
  return data.session; // null if not logged in
}