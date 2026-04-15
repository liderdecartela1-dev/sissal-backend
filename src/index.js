const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// =========================
// 📦 CAMINHOS
// =========================

const dbPath = path.join(__dirname, "..", "dados.json");
const publicPath = path.join(__dirname, "public");

// =========================
// 🔁 BASE
// =========================

function carregarDB() {
  try {
    if (!fs.existsSync(dbPath)) return [];
    const data = fs.readFileSync(dbPath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Erro DB:", err);
    return [];
  }
}

function salvarDB(dados) {
  fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2));
}

// =========================
// 📥 PROTOCOLO (NOVO FLUXO)
// =========================

app.post("/api/protocolo", (req, res) => {
  let dados = carregarDB();

  const novo = {
    id: Date.now(),
    data: new Date().toISOString().split("T")[0],
    convenio: req.body.convenio,
    tipo_atendimento: req.body.tipo_atendimento,
    protocolo: req.body.protocolo,
    valor: Number(req.body.valor),
    recebido: Number(req.body.recebido),
    glosa: Number(req.body.glosa),
    recursado: 0,
    status: req.body.status
  };

  dados.push(novo);
  salvarDB(dados);

  res.json({ ok: true });
});

// =========================
// 📊 DASHBOARD
// =========================

app.get("/api/dashboard", (req, res) => {
  const { inicio, fim, operadora } = req.query;

  const dados = carregarDB();

  let recebido = 0;
  let aberto = 0;
  let glosa = 0;
  let perda = 0;

  let operadoras = {};

  dados.forEach(item => {

    if (inicio && item.data && item.data < inicio) return;
    if (fim && item.data && item.data > fim) return;
    if (operadora && item.convenio !== operadora) return;

    if (!operadoras[item.convenio]) operadoras[item.convenio] = 0;
    operadoras[item.convenio] += Number(item.valor);

    recebido += Number(item.recebido || 0);
    glosa += Number(item.glosa || 0);

    if (item.status === "em_aberto") {
      aberto += Number(item.valor);
    }

    if (item.glosa > 0 && item.recursado < item.glosa) {
      perda += (item.glosa - (item.recursado || 0));
    }
  });

  res.json({ recebido, aberto, glosa, perda, operadoras });
});

// =========================
// 💰 BAIXA (AJUSTE)
// =========================

app.post("/api/baixa", (req, res) => {

  let dados = carregarDB();

  dados = dados.map(item => {

    if (item.id == req.body.id) {

      const bruto = Number(item.valor);
      const pago = Number(req.body.valorPago);

      if (pago >= bruto) {
        item.recebido = bruto;
        item.glosa = 0;
        item.status = "recebido_total";
      } else {
        item.recebido = pago;
        item.glosa = bruto - pago;
        item.status = "recebido_parcial";
      }
    }

    return item;
  });

  salvarDB(dados);
  res.json({ ok: true });
});

// =========================
// ❌ GLOSAS
// =========================

app.get("/api/glosas", (req, res) => {

  const dados = carregarDB();

  const glosas = dados
    .filter(i => i.glosa > 0)
    .map(i => ({
      id: i.id,
      convenio: i.convenio,
      protocolo: i.protocolo,
      valor: i.glosa,
      recursado: i.recursado || 0
    }));

  res.json(glosas);
});

// =========================
// 🔄 RECURSO
// =========================

app.post("/api/recursar", (req, res) => {

  let dados = carregarDB();

  dados = dados.map(item => {

    if (item.id == req.body.id) {

      item.recursado = (item.recursado || 0) + Number(req.body.valor);

      if (item.recursado >= item.glosa) {
        item.recebido += item.glosa;
        item.glosa = 0;
        item.status = "recebido_total";
      }
    }

    return item;
  });

  salvarDB(dados);
  res.json({ ok: true });
});

// =========================
// 🌐 FRONT
// =========================

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "dashboard.html"));
});

// =========================
// 🚀 START
// =========================

app.listen(3000, () => {
  console.log("🚀 SisSal BI rodando na porta 3000");
});