export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/ai" && request.method === "POST") {
      try {
        const body = await request.json();
        const task = body.task || "";

        const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            {
              role: "system",
              content: "You are a helpful everyday life assistant for people living in the United States. Give clear, practical, step-by-step advice. Keep answers concise and well organized with short sections or bullet points."
            },
            {
              role: "user",
              content: task
            }
          ]
        });

        return new Response(JSON.stringify({
          answer: aiResponse.response || "Sorry, I couldn't generate a response."
        }), {
          headers: { "Content-Type": "application/json" }
        });

      } catch (err) {
        return new Response(JSON.stringify({
          answer: "Something went wrong generating your plan. Please try again."
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
