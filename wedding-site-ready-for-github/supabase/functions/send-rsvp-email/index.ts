// Supabase Edge Function: send-rsvp-email
//
// Called from the front end right after a guest's RSVP is saved to the
// `wedding_rsvps` table. It emails the details to the couple automatically.
//
// SETUP (one-time):
//   1. Create a free account at https://resend.com
//   2. Get an API key from the Resend dashboard.
//   3. Set it as a secret on this Supabase project:
//        supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
//      (In Lovable Cloud: Project Settings -> Secrets -> add RESEND_API_KEY.)
//   4. Deploy this function:
//        supabase functions deploy send-rsvp-email
//   5. To send from your own address instead of the shared Resend test
//      sender, verify your domain in Resend and change RECIPIENT/FROM below.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RECIPIENT_EMAIL = "kaxapapuashvili08@gmail.com";
const FROM_ADDRESS = "Wedding RSVP <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type RsvpPayload = {
  guest_name?: string;
  attending?: boolean;
  guest_count?: number;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guest_name = "", attending = false, guest_count = 0 } =
      (await req.json()) as RsvpPayload;

    const safeName = escapeHtml(String(guest_name).trim() || "უსახელო სტუმარი");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY secret is not set — see setup notes at the top of this file.");
      return new Response(
        JSON.stringify({ error: "Email service is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const subject = attending
      ? `✅ ახალი დასწრება: ${guest_name} (${guest_count} სტუმარი)`
      : `❌ ვერ ესწრება: ${guest_name}`;

    const html = `
      <div style="font-family: Georgia, 'Noto Serif Georgian', serif; font-size: 16px; color:#2d3319; line-height:1.6; max-width:480px;">
        <h2 style="margin:0 0 16px; color:#3f4d24;">ახალი პასუხი ქორწილის მოსაწვევზე</h2>
        <p style="margin:0 0 8px;"><strong>სახელი და გვარი:</strong> ${safeName}</p>
        <p style="margin:0 0 8px;"><strong>დაესწრება:</strong> ${attending ? "დიახ, მოდის" : "ვერ ესწრება"}</p>
        ${attending ? `<p style="margin:0 0 8px;"><strong>სტუმრების რაოდენობა:</strong> ${guest_count}</p>` : ""}
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [RECIPIENT_EMAIL],
        subject,
        html,
      }),
    });

    if (!emailResponse.ok) {
      const errText = await emailResponse.text();
      console.error("Resend API error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to send email." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-rsvp-email error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
