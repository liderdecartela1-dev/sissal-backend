const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🏠 ROTA PRINCIPAL (resolve Cannot GET /)
app.get("/", (req, res) => {
  res.json({
    sistema: "SisSal BI",
    status: "online 🚀",
    mensagem: "API rodando com sucesso",
    rotas: ["/health", "/dados"]
  });
});

// ❤️ HEALTH
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "SisSal BI rodando normalmente 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 📊 DADOS
app.get("/dados", (req, res) => {
  res.json({
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
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SisSal BI rodando na porta ${PORT}`);
});