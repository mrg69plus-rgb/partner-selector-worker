const corsHeaders = {
  "Access-Control-Allow-Origin":
    "https://mrg69plus-rgb.github.io",

  "Access-Control-Allow-Methods":
    "POST, OPTIONS",

  "Access-Control-Allow-Headers":
    "Content-Type"
};


export default {

  async fetch(request, env) {

    // -----------------------------
    // CORS
    // -----------------------------

    if (request.method === "OPTIONS") {

      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });

    }


    // -----------------------------
    // فقط POST
    // -----------------------------

    if (request.method !== "POST") {

      return new Response(
        "Method Not Allowed",
        {
          status: 405,
          headers: corsHeaders
        }
      );

    }


    try {

      // -----------------------------
      // دریافت اطلاعات
      // -----------------------------

      const data =
        await request.json();


      const selected =
        Array.isArray(data.selected)
          ? data.selected
          : [];


      const custom =
        Array.isArray(data.custom)
          ? data.custom
          : [];


      const date =
        typeof data.date === "string"
          ? data.date
          : "";


      const time =
        typeof data.time === "string"
          ? data.time
          : "";


      const duration =
        typeof data.duration === "string"
          ? data.duration
          : "";


      // -----------------------------
      // ساخت پیام تلگرام
      // -----------------------------

      let message =
        "📋 انتخاب‌های جدید\n\n";


      // زمان

      if (date && time) {

        message +=
          `🗓 زمان:\n` +
          `${date} - ساعت ${time}\n`;

      }


      // مدت

      if (duration) {

        message +=
          `⏱ مدت:\n` +
          `${duration}\n`;

      }


      // جداکننده

      if (date || time || duration) {

        message += "\n";

      }


      // -----------------------------
      // گزینه‌های انتخاب‌شده
      // -----------------------------

      if (selected.length > 0) {

        message +=
          "🔹 گزینه‌های انتخاب‌شده:\n";


        selected.forEach(
          (item, index) => {

            message +=
              `${index + 1}. ${item}\n`;

          }
        );

      }


      // -----------------------------
      // گزینه‌های سفارشی
      // -----------------------------

      if (custom.length > 0) {

        message +=
          "\n✏️ گزینه‌های سفارشی:\n";


        custom.forEach(
          (item, index) => {

            message +=
              `${index + 1}. ${item}\n`;

          }
        );

      }


      // -----------------------------
      // هیچ گزینه‌ای انتخاب نشده
      // -----------------------------

      if (
        selected.length === 0 &&
        custom.length === 0
      ) {

        message +=
          "هیچ گزینه‌ای انتخاب نشده.";

      }


      // -----------------------------
      // ارسال به Telegram
      // -----------------------------

      const telegramResponse =
        await fetch(
          `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              chat_id:
                env.OWNER_CHAT_ID,

              text:
                message

            })

          }
        );


      const telegramResult =
        await telegramResponse.json();


      // -----------------------------
      // بررسی نتیجه Telegram
      // -----------------------------

      if (
        !telegramResponse.ok ||
        !telegramResult.ok
      ) {

        console.log(
          "Telegram error:",
          telegramResult
        );


        return new Response(

          JSON.stringify({
            success: false
          }),

          {
            status: 500,

            headers: {
              "Content-Type":
                "application/json",

              ...corsHeaders
            }

          }

        );

      }


      // -----------------------------
      // موفق
      // -----------------------------

      return new Response(

        JSON.stringify({
          success: true
        }),

        {
          status: 200,

          headers: {
            "Content-Type":
              "application/json",

            ...corsHeaders
          }

        }

      );


    } catch (error) {

      // -----------------------------
      // خطای عمومی
      // -----------------------------

      console.log(
        "Worker error:",
        error.message
      );


      return new Response(

        JSON.stringify({
          success: false
        }),

        {
          status: 500,

          headers: {
            "Content-Type":
              "application/json",

            ...corsHeaders
          }

        }

      );

    }

  }

};
