export default {
  async fetch(request, env) {
    try {
      const getMeResponse = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/getMe`
      );

      const getMeResult = await getMeResponse.json();

      const sendMessageResponse = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: env.OWNER_CHAT_ID,
            text: "🧪 تست اتصال Worker به Telegram"
          })
        }
      );

      const sendMessageResult = await sendMessageResponse.json();

      return new Response(
        JSON.stringify({
          getMe: getMeResult,
          sendMessage: sendMessageResult
        }, null, 2),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }, null, 2),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
