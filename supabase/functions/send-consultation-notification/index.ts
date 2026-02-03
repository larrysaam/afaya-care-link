import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ConsultationNotificationRequest {
  patientEmail: string;
  patientName: string;
  specialistName: string;
  specialty: string;
  scheduledDate: string;
  meetingLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      patientEmail, 
      patientName, 
      specialistName, 
      specialty, 
      scheduledDate,
      meetingLink 
    }: ConsultationNotificationRequest = await req.json();

    console.log("Sending consultation notification to:", patientEmail);

    // Validate required fields
    if (!patientEmail || !scheduledDate || !meetingLink) {
      throw new Error("Missing required fields: patientEmail, scheduledDate, or meetingLink");
    }

    const formattedDate = new Date(scheduledDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = new Date(scheduledDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const emailResponse = await resend.emails.send({
      from: "Afaya Care Link <onboarding@resend.dev>",
      to: [patientEmail],
      subject: "Your Medical Consultation Has Been Scheduled",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Your Consultation is Scheduled!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px;">Dear ${patientName || 'Patient'},</p>
            
            <p>Great news! Your medical consultation has been scheduled. Here are the details:</p>
            
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #6b7280;">Specialist:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
                    ${specialistName || 'Your Specialist'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #6b7280;">Specialty:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
                    ${specialty || 'Medical Consultation'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                    <strong style="color: #6b7280;">Date:</strong>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
                    ${formattedDate}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #6b7280;">Time:</strong>
                  </td>
                  <td style="padding: 10px 0; text-align: right;">
                    ${formattedTime}
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetingLink}" 
                 style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                Join Video Consultation
              </a>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⏰ Important:</strong> The meeting link will become active 15 minutes before your scheduled time. Please ensure you have a stable internet connection and a quiet environment for your consultation.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you need to reschedule or have any questions, please contact our support team.
            </p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The Afaya Care Link Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2025 Afaya Care Link. All rights reserved.</p>
            <p>This email was sent regarding your scheduled medical consultation.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Consultation notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-consultation-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
