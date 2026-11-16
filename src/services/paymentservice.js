
import axios from "axios";
import { createClient } from "@/lib/supabase/client";

export const initializePayment = async (plan) => {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("Please log in before subscribing.");
  }

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payments/initialize`,
    { plan },
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (
    !response.data?.success ||
    !response.data?.authorizationUrl
  ) {
    throw new Error(
      response.data?.message || "Unable to start payment."
    );
  }

  return response.data;
};
