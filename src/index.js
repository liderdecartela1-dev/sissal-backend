const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🟢 HEALTH (teste de vida do servidor)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "SisSal rodando 🚀"
  });
});

// 📊 DADOS DO DASHBOARD (BI)
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

// 🚀 PORTA DO RENDER / LOCAL
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 SisSal BI rodando na porta " + PORT);
});