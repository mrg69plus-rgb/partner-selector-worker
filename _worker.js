export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://mrg69plus-rgb.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return new Response("OK", {
        status: 200,
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

      const user = data.telegramUser;

      let text = "❤️ انتخاب‌های جدید\n\n";

      if (user) {
        text += `👤 ${user.first_name || ""}`;

        if (user.username) {
          text += ` (@${user.username})`;
        }

        text += "\n\n";
      }

      text += "انتخاب‌ها:\n";

      if (selected.length === 0) {
        text += "هیچ موردی انتخاب نشده.\n";
      } else {
        selected.forEach((item, index) => {
          text += `${index + 1}. ${item}\n`;
        });
      }

      if (custom.length > 0) {
        text += "\n➕ موارد اضافه‌شده:\n";

        custom.forEach(item => {
          text += `• ${item}\n`;
        });
      }

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: env.OWNER_CHAT_ID,
            text: text
          })
        }
      );

      const telegramResult = await telegramResponse.text();

      console.log("Telegram status:", telegramResponse.status);
      console.log("Telegram response:", telegramResult);

      if (!telegramResponse.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            telegramStatus: telegramResponse.status
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
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
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {

      console.error("Worker error:", error);

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
