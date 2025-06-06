async function queryDeepSeekAPI (query) {
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  const apiKey = import.meta.env.SECRET_DEEPSEEK_KEY_TOKEN
  try {
    const respuesta = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",  // Modelo gratuito
        messages: [
          { role: "user", content: query }
        ],
        temperature: 0.7,  // Opcional: controla la creatividad (0 a 1)
      }),
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    console.log("Respuesta de DeepSeek:", datos.choices[0].message.content);
    return datos.choices[0].message.content;

  } catch (error) {
    console.error("Error al llamar a la API:", error.message);
  }
}
export { queryDeepSeekAPI }