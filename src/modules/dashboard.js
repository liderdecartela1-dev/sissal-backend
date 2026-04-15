function dashboard() {
  const dados = carregarDB();

  let recebido = 0;
  let aberto = 0;
  let glosa = 0;
  let perda = 0;

  let operadoras = {};

  dados.forEach(item => {
    const bruto = Number(item.valor_bruto) || 0;
    const liquido = Number(item.valor_liquido) || 0;
    const glosaItem = Number(item.glosa) || 0;
    const recursado = Number(item.recursado) || 0;

    if (!operadoras[item.convenio]) {
      operadoras[item.convenio] = 0;
    }

    operadoras[item.convenio] += bruto;

    if (item.status === "recebido_total") {
      recebido += liquido;
    }

    else if (item.status === "recebido_parcial") {
      recebido += liquido;
      glosa += glosaItem;
    }

    else if (item.status === "em_aberto") {
      aberto += bruto;
    }

    else if (item.status === "glosa") {
      glosa += bruto;
    }

    // 🔥 PERDA = O QUE NÃO FOI RECUPERADO
    if (glosaItem > 0 && recursado < glosaItem) {
      perda += (glosaItem - recursado);
    }

  });

  return { recebido, aberto, glosa, perda, operadoras };
}