const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* 🏠 ROTA PRINCIPAL */
app.get("/", (req, res) => {
  res.json({
    sistema: "SisSal BI",
    status: "online 🚀",
    mensagem: "API rodando com sucesso",
    rotas: ["/health", "/dados"]
  });
});

/* ❤️ HEALTH CHECK */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "SisSal BI rodando normalmente 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* 📊 DADOS (NOVO MODELO DE CONCILIAÇÃO) */
app.get("/dados", (req, res) => {
  
  const protocolos = [
    {
      competencia: "JANEIRO",
      convenio: "AMIL",
      cnpj: "29.309.127/0001-79",
      local: "Suzano",
      banco: "Itau",
      tipoAtendimento: "Aba",
      protocolo: "5587354562",
      valorBruto: 14100,
      valorPago: 14100,
      previsaoPagamento: "2026-02-10",
      dataPagamento: "2026-02-10"
    },
    {
      competencia: "JANEIRO",
      convenio: "PORTO SEGURO",
      cnpj: "29.309.127/0001-99",
      local: "Suzano",
      banco: "Itau",
      tipoAtendimento: "Aba",
      protocolo: "5587354562",
      valorBruto: 14100,
      valorPago: 0,
      previsaoPagamento: "2026-03-15",
      dataPagamento: null
    }
  ];

  let totalPago = 0;
  let totalAberto = 0;
  let totalAtrasado = 0;

  const hoje = new Date();

  const processados = protocolos.map(p => {
    const previsao = new Date(p.previsaoPagamento);

    let status = "EM_ABERTO";

    if (p.valorPago === p.valorBruto) {
      status = "PAGO";
      totalPago += p.valorBruto;
    } 
    else if (p.valorPago > 0 && p.valorPago < p.valorBruto) {
      status = "PARCIAL";
      totalPago += p.valorPago;
      totalAberto += (p.valorBruto - p.valorPago);
    } 
    else if (hoje > previsao && p.valorPago === 0) {
      status = "ATRASADO";
      totalAtrasado += p.valorBruto;
    } 
    else {
      status = "EM_ABERTO";
      totalAberto += p.valorBruto;
    }

    return {
      ...p,
      status
    };
  });

  res.json({
    resumo: {
      totalPago,
      totalAberto,
      totalAtrasado
    },
    protocolos: processados
  });
});

/* 🚀 START SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SisSal BI rodando na porta ${PORT}`);
});