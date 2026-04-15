const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "dados.json");

function carregar() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function salvar(dados) {
  fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));
}

// 🔥 BAIXA
function baixarProtocolo(id, valorPago) {
  const dados = carregar();

  const item = dados.find(p => p.id == id);
  if (!item) return { erro: "Protocolo não encontrado" };

  const bruto = Number(item.valor_bruto) || 0;
  valorPago = Number(valorPago) || 0;

  if (valorPago >= bruto) {
    item.status = "recebido_total";
    item.valor_liquido = bruto;

  } else if (valorPago > 0) {
    item.status = "recebido_parcial";
    item.valor_liquido = valorPago;

  } else {
    item.status = "glosa";
    item.valor_liquido = 0;
  }

  salvar(dados);

  return { sucesso: true, item };
}

module.exports = {
  baixarProtocolo
};