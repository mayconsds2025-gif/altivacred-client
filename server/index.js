import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import axios from "axios";

import { authenticateV8 } from "./services/v8Auth.js";
import { loginC6 } from "./services/c6Login.js";
import { iniciarSessaoPresenca } from "./services/presencaLogin.js";
import { criarTermo } from "./services/presencaTermo.js";

dotenv.config();

const app = express();

// 🔥 CORS liberado para funcionar com o Render
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// 🔗 Conexão MySQL
const pool = mysql.createPool({
  host: "db_nitzdigital.mysql.dbaas.com.br",
  user: "db_nitzdigital",
  password: "H!p0tenusa",
  database: "db_nitzdigital",
});

// 🧱 Criação automática das tabelas (AGORA COM EMAIL COMO PRIMARY KEY)
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      email VARCHAR(120) PRIMARY KEY,
      cpf VARCHAR(14) NULL,
      nome VARCHAR(100) NOT NULL,
      senha VARCHAR(200),
      telefone VARCHAR(20),
      data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      hora_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS simulacoes (
      id_simulacao INT AUTO_INCREMENT PRIMARY KEY,
      produto VARCHAR(50) DEFAULT 'Consignado CLT',
      valor DECIMAL(12,2) NOT NULL,
      parcelas VARCHAR(10),
      tempo_empresa VARCHAR(10),
      data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      cpf_usuario VARCHAR(14),
      FOREIGN KEY (cpf_usuario) REFERENCES usuarios(cpf) ON DELETE SET NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS consentimentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      consult_id VARCHAR(100) NOT NULL,
      cpf_cliente VARCHAR(14) NULL,
      status VARCHAR(50) DEFAULT 'WAITING_CONSENT',
      data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Tabelas validadas com sucesso (MySQL)!");
})();

// 🧍 Cadastro normal
app.post("/cadastro", async (req, res) => {
  try {
    const { cpf, nome, email, senha, telefone } = req.body;

    if (!nome || !email)
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });

    const [existenteEmail] = await pool.query(
      "SELECT email FROM usuarios WHERE email = ?", [email]
    );

    if (existenteEmail.length > 0)
      return res.status(200).json({
        message: "E-mail já cadastrado.",
        email,
      });

    const hashed = senha ? await bcrypt.hash(senha, 10) : null;

    await pool.query(
      "INSERT INTO usuarios (email, cpf, nome, senha, telefone) VALUES (?,?,?,?,?)",
      [email, cpf, nome, hashed, telefone]
    );

    res.json({ success: true, email });

  } catch (error) {
    console.error("❌ Erro no cadastro:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

// 🔥 LOGIN SOCIAL NOVO — ESTA É A ROTA USADA PELO FRONT
app.post("/auth/social", async (req, res) => {
  try {
    console.log("[AUTH SOCIAL] Body recebido:", req.body);

    const { cpf, nome, email, telefone } = req.body;

    if (!email) {
      console.log("[AUTH SOCIAL] ERRO: Email ausente");
      return res.status(400).json({ sucesso: false, erro: "Email é obrigatório" });
    }

    // 🔎 Busca usuário pelo email (PRIMARY KEY)
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    let usuario = rows[0];

    // Se não existir → cria
    if (!usuario) {
      console.log("[AUTH SOCIAL] Criando novo usuário...");

      await pool.query(
        "INSERT INTO usuarios (email, cpf, nome, telefone) VALUES (?, ?, ?, ?)",
        [email, cpf, nome, telefone]
      );

      const [novoUser] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
        [email]
      );

      usuario = novoUser[0];
    } else {
      console.log("[AUTH SOCIAL] Usuário já encontrado:", usuario.email);
    }

    return res.json({
      sucesso: true,
      usuario,
    });

  } catch (err) {
    console.error("[AUTH SOCIAL] ERRO:", err);
    return res.status(500).json({ sucesso: false, erro: err.message });
  }
});

// 🧾 Criar termo PRESENÇA
app.post("/presenca/termo", async (req, res) => {
  console.log("[API][PRESENÇA] POST /presenca/termo");

  const usuario = process.env.PRESENCA_LOGIN;
  const senha = process.env.PRESENCA_PASSWORD;

  const login = await iniciarSessaoPresenca(usuario, senha);

  if (!login.sucesso) {
    return res.json({ sucesso: false, erro: login.erro });
  }

  const result = await criarTermo(login.token, req.body);
  return res.json(result);
});

// 🔐 Testar autenticação V8
app.get("/token-v8", async (req, res) => {
  try {
    const token = await authenticateV8();
    res.json({ access_token: token });
  } catch (error) {
    console.error("❌ Erro na autenticação V8:", error);
    res.status(500).json({ error: "Falha ao autenticar com a V8." });
  }
});

// 🔐 Login no C6
app.post("/c6/login", async (req, res) => {
  try {
    const usuario = process.env.C6_LOGIN;
    const senha = process.env.C6_PASSWORD;

    if (!usuario || !senha)
      return res.status(500).json({ erro: "Credenciais do C6 não configuradas." });

    const result = await loginC6(usuario, senha);
    res.json(result);

  } catch (error) {
    console.error("❌ Erro no login C6:", error);
    res.status(500).json({ erro: "Falha ao realizar login no C6." });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);
