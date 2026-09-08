export default {
  async fetch(request, env) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/getMe`
      );

      const result = await response.text();

      return new Response(result, {
        status: response.status,
        headers: {
          "Content-Type": "application/json"
        }
      });

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
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
