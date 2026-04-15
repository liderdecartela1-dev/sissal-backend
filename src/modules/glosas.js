const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../dados.json");

function carregarDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function salvarDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// 🧠 status automático
function calcularStatus(recebido, faturado) {
  if (recebido === faturado) return "total";
  if (recebido === 0) return "nao_pago";
  return "parcial";
}

// 🧾 confirmar protocolo + gerar glosa automática
function confirmarProtocolo(payload) {
  const db = carregarDB();

  const status = calcularStatus(payload.valor_recebido, payload.valor_faturado);
  const glosa = payload.valor_faturado - payload.valor_recebido;

  const protocolo = {
    id_protocolo: payload.id_protocolo,
    lote: payload.lote,
    competencia: payload.competencia,
    convenio: payload.convenio,

    valor_faturado: payload.valor_faturado,
    valor_recebido: payload.valor_recebido,
    valor_glosado: glosa > 0 ? glosa : 0,

    status_recebimento: status,

    status_glosa: glosa > 0 ? "em_recurso" : "ok",

    data_confirmacao: new Date().toISOString()
  };

  db.protocolos.push(protocolo);

  // 🔴 cria glosa automaticamente
  if (glosa > 0) {
    db.glosas.push({
      id_glosa: "GL-" + Date.now(),
      protocolo: payload.id_protocolo,
      convenio: payload.convenio,

      valor_glosado: glosa,

      status: "pendente_recurso",
      valor_recuperado: 0,

      data_abertura: new Date().toISOString()
    });
  }

  salvarDB(db);

  return protocolo;
}

// 📊 listar glosas
function listarGlosas() {
  const db = carregarDB();
  return db.glosas;
}

module.exports = {
  confirmarProtocolo,
  listarGlosas
};