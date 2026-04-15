const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// ======================
// 📊 DADOS FIXOS
// ======================
const dados = {
  totalAtendido: 795108.32,
  totalFaturado: 920450.1,
  perda: 125341.78,
  convenios: [
    { nome: "AMIL SAÚDE", valor: 210000 },
    { nome: "BRADESCO", valor: 180000 },
    { nome: "SULAMÉRICA", valor: 305108.32 }
  ],
  especialidades: [
    { nome: "Psicologia", valor: 320000 },
    { nome: "Fonoaudiologia", valor: 210000 },
    { nome: "Terapia Ocupacional", valor: 265108.32 }
  ]
};

// ======================
// 🟢 ROOT (Render check)
// ======================
app.get("/", (req, res) => {
  res.send("SisSal BI backend online 🚀");
});

// ======================
// ❤️ HEALTH CHECK
// ======================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "SisSal BI rodando normalmente 🚀"
  });
});

// ======================
// 📦 DADOS
// ======================
app.get("/dados", (req, res) => {
  res.json(dados);
});

// ======================
// 🚀 START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`🚀 SisSal BI rodando na porta ${PORT}`);
});