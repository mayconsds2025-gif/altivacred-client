import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({
  checkServerIdentity: () => undefined,
});

export async function criarTermo(token, payload) {
  try {
    console.log("[PRESENÇA][TERMO] Enviando payload:", payload);

    const resp = await axios.post(
      "https://presenca-bank-api.azurewebsites.net/v2/consultas/termo-autorizacao",
      {
        cpf: payload.cpf,
        nome: payload.nome,
        telefone: payload.telefone,
        cpfRepresentante: "",
        nomeRepresentante: "",
        produtoId: 2,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        httpsAgent,
      }
    );

    console.log("[PRESENÇA][TERMO] Resposta:", resp.data);

    return {
      sucesso: true,
      link: resp.data?.link || null,
      id: resp.data?.id || null,
    };
  } catch (err) {
    console.log("[PRESENÇA][TERMO] ERRO:", err.response?.data || err.message);

    return {
      sucesso: false,
      erro: err.response?.data || err.message,
    };
  }
}
