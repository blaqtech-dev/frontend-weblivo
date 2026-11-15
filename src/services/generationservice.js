
import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateWebsite(projectId) {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  if (!session?.access_token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const response = await axios.post(
    `${API_URL}/api/generation/${projectId}/generate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  return response.data;
}



export async function publishWebsite(projectId) {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  if (!session?.access_token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const response = await axios.post(
    `${API_URL}/api/publish/${projectId}/publish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  return response.data;
}
