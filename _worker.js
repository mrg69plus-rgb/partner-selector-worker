export default {
  async fetch(request, env) {
    const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;

    return new Response(
      JSON.stringify({
        tokenExists: !!env.BOT_TOKEN,
        tokenLength: env.BOT_TOKEN ? env.BOT_TOKEN.length : 0,
        ownerChatId: env.OWNER_CHAT_ID,
        apiUrlEndsWith: url.slice(-30)
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
