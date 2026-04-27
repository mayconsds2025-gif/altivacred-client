import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

let cachedToken = null;
let tokenExpiration = null;

export async function authenticateV8() {
  const now = Date.now();

  // ♻️ Reutiliza token se ainda estiver válido
  if (cachedToken && tokenExpiration && now < tokenExpiration) {
    return cachedToken;
  }

  try {
    console.log("🔐 Iniciando autenticação na V8...");

    const response = await axios.post(
      "https://auth.v8sistema.com/oauth/token", // ✅ endpoint correto
      new URLSearchParams({
        grant_type: "password",
        username: process.env.V8_EMAIL,
        password: process.env.V8_PASSWORD,
        audience: "https://bff.v8sistema.com", // ✅ audiência fornecida pela V8
        scope: "offline_access",
        client_id: "DHWogdaYmEI8n5bwwxPDzulMlSK7dwIn", // ✅ client_id fornecido
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    // 💾 Cacheia o token para evitar reautenticação desnecessária
    cachedToken = response.data.access_token;
    tokenExpiration = now + (response.data.expires_in - 60) * 1000;

    console.log("✅ Token da V8 gerado com sucesso!");
    return cachedToken;
  } catch (error) {
    console.error("❌ Erro ao autenticar na API da V8:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Mensagem:", error.message);
    }

    throw new Error("Falha na autenticação com a API da V8.");
  }
}
