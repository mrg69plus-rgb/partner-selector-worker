const corsHeaders = {
  "Access-Control-Allow-Origin": "https://mrg69plus-rgb.github.io",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env) {

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // فقط POST
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const data = await request.json();

      const selected = Array.isArray(data.selected)
        ? data.selected
        : [];

      const custom = Array.isArray(data.custom)
        ? data.custom
        : [];

      // ساخت متن پیام
      let message = "📋 انتخاب‌های جدید\n\n";

      if (selected.length > 0) {
        message += "🔹 گزینه‌های انتخاب‌شده:\n";

        selected.forEach((item, index) => {
          message += `${index + 1}. ${item}\n`;
        });
      }

      if (custom.length > 0) {
        message += "\n✏️ گزینه‌های سفارشی:\n";

        custom.forEach((item, index) => {
          message += `${index + 1}. ${item}\n`;
        });
      }

      if (selected.length === 0 && custom.length === 0) {
        message += "هیچ گزینه‌ای انتخاب نشده.";
      }

      // ارسال به تلگرام
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: env.OWNER_CHAT_ID,
            text: message
          })
        }
      );

      const telegramResult = await telegramResponse.json();

      console.log("Telegram status:", telegramResponse.status);
      console.log("Telegram response:", telegramResult);

      if (!telegramResponse.ok || !telegramResult.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            telegram: telegramResult
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );

    } catch (error) {

      console.log("Worker error:", error.message);

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
  }
};
