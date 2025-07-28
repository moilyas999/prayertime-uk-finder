import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily prayer reminder process...');

    // Get all users with email notifications enabled
    const { data: notificationSettings, error: settingsError } = await supabase
      .from('user_notification_settings')
      .select(`
        user_id,
        enable_email,
        notification_time,
        user_accounts!inner(email, postcode)
      `)
      .eq('enable_email', true);

    if (settingsError) {
      throw new Error(`Error fetching notification settings: ${settingsError.message}`);
    }

    if (!notificationSettings || notificationSettings.length === 0) {
      console.log('No users with email notifications enabled');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No users to notify',
        sent: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${notificationSettings.length} users with email notifications enabled`);

    let emailsSent = 0;
    const errors: string[] = [];

    // Process each user
    for (const setting of notificationSettings) {
      try {
        const userAccount = setting.user_accounts as any;
        
        if (!userAccount?.email || !userAccount?.postcode) {
          console.log(`Skipping user ${setting.user_id}: missing email or postcode`);
          continue;
        }

        // Get coordinates for postcode
        const coordsResponse = await fetch(`https://api.postcodes.io/postcodes/${userAccount.postcode}`);
        const coordsData = await coordsResponse.json();
        
        if (coordsData.status !== 200) {
          console.log(`Invalid postcode for user ${setting.user_id}: ${userAccount.postcode}`);
          continue;
        }

        const { latitude, longitude } = coordsData.result;

        // Get prayer times
        const prayerResponse = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        
        if (!prayerResponse.ok) {
          throw new Error('Failed to fetch prayer times');
        }

        const prayerData = await prayerResponse.json();
        const timings: PrayerTimes = prayerData.data.timings;

        // Send email
        const emailHtml = generateEmailHtml(userAccount.postcode, timings);
        
        const emailResponse = await resend.emails.send({
          from: "SalahClock <prayer-times@salahclock.uk>",
          to: [userAccount.email],
          subject: `Today's Prayer Times - ${userAccount.postcode}`,
          html: emailHtml,
        });

        if (emailResponse.error) {
          throw emailResponse.error;
        }

        console.log(`Email sent successfully to ${userAccount.email}`);
        emailsSent++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        console.error(`Error processing user ${setting.user_id}:`, error.message);
        errors.push(`User ${setting.user_id}: ${error.message}`);
      }
    }

    console.log(`Daily reminder process completed. Emails sent: ${emailsSent}`);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: emailsSent,
      totalUsers: notificationSettings.length,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-daily-reminders function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

function generateEmailHtml(postcode: string, times: PrayerTimes): string {
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Today's Prayer Times</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #186b7a; margin-bottom: 10px;">🕌 SalahClock</h1>
        <h2 style="color: #666; font-weight: normal; margin: 0;">Today's Prayer Times</h2>
        <p style="color: #999; margin: 5px 0;">${postcode} • ${today}</p>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px 0; font-weight: bold;">Fajr</td>
            <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 16px;">${times.Fajr}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px 0; font-weight: bold;">Sunrise</td>
            <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 16px; color: #f59e0b;">${times.Sunrise}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px 0; font-weight: bold;">Dhuhr</td>
            <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 16px;">${times.Dhuhr}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px 0; font-weight: bold;">Asr</td>
            <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 16px;">${times.Asr}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px 0; font-weight: bold;">Maghrib</td>
            <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 16px;">${times.Maghrib}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: bold;">Isha</td>
            <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 16px;">${times.Isha}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; padding: 20px; background: #186b7a; color: white; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 18px;">🕌 May Allah accept your prayers</p>
      </div>

      <div style="text-align: center; color: #666; font-size: 14px;">
        <p>Prayer times calculated using the Muslim World League method</p>
        <p style="margin: 10px 0;">
          <a href="https://salahclock.uk" style="color: #186b7a; text-decoration: none;">Visit SalahClock.uk</a> | 
          <a href="https://salahclock.uk/notifications" style="color: #186b7a; text-decoration: none;">Manage Notifications</a>
        </p>
        <p style="font-size: 12px; color: #999;">
          You're receiving this because you subscribed to daily prayer time reminders.
        </p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);