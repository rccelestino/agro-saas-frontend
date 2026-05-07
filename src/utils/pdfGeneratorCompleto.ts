export async function gerarRelatorioPDFCompleto(data: any) {
  const plano = data.plano;
  const versao = data.versao;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Plano de Manejo Orgânico - AgroSaas</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.5; }
        @media print { body { margin: 0; padding: 0; } .page-break { page-break-before: always; } }
        h1 { color: #2e7d32; text-align: center; border-bottom: 3px solid #2e7d32; padding-bottom: 10px; margin-bottom: 20px; }
        h2 { color: #2e7d32; margin-top: 25px; margin-bottom: 15px; border-left: 5px solid #2e7d32; padding-left: 15px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 15px 0; }
        .info-item { padding: 10px; background-color: #f9f9f9; border-radius: 5px; }
        .info-label { font-weight: bold; color: #555; display: block; font-size: 0.85em; }
        .info-value { margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        .assinatura { margin-top: 40px; display: flex; justify-content: space-between; }
        .assinatura-item { text-align: center; width: 45%; }
        .linha-assinatura { border-top: 1px solid #000; margin-top: 40px; padding-top: 10px; }
        .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
        .badge { background-color: #4caf50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Plano de Manejo Orgânico</h1>
        <p>Documento gerado pelo sistema AgroSaas em ${new Date().toLocaleDateString('pt-BR')}</p>
        <p><strong>Status:</strong> <span class="badge">${versao?.status === "APROVADO" ? "✓ APROVADO" : "📝 RASCUNHO"}</span></p>
      </div>

      <!-- 1. DADOS DE IDENTIFICAÇÃO -->
      <div class="section">
        <h2>1. Identificação da Propriedade</h2>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">Plano ID:</span><div class="info-value">${plano?.id || "-"}</div></div>
          <div class="info-item"><span class="info-label">Tipo:</span><div class="info-value">${plano?.tipoPlano || "-"}</div></div>
          <div class="info-item"><span class="info-label">Escopo:</span><div class="info-value">${plano?.escopo || "-"}</div></div>
          <div class="info-item"><span class="info-label">Versão:</span><div class="info-value">${versao?.numeroVersao || "-"}</div></div>
          <div class="info-item"><span class="info-label">Grupo:</span><div class="info-value">${plano?.grupo || "-"}</div></div>
          <div class="info-item"><span class="info-label">Núcleo:</span><div class="info-value">${plano?.nucleo || "-"}</div></div>
          <div class="info-item"><span class="info-label">Comunidade:</span><div class="info-value">${plano?.comunidade || "-"}</div></div>
          <div class="info-item"><span class="info-label">Município/UF:</span><div class="info-value">${plano?.municipio || "-"} ${plano?.uf ? `/${plano.uf}` : ""}</div></div>
          <div class="info-item"><span class="info-label">Unidade Produtiva:</span><div class="info-value">${plano?.unidadeProdutivaFamilia || "-"}</div></div>
          <div class="info-item"><span class="info-label">Responsável:</span><div class="info-value">${plano?.responsavelNome || "-"}</div></div>
          <div class="info-item"><span class="info-label">CPF:</span><div class="info-value">${plano?.responsavelCpf || "-"}</div></div>
          <div class="info-item"><span class="info-label">Contato:</span><div class="info-value">${plano?.responsavelContato || "-"}</div></div>
        </div>
      </div>

      <!-- 2. INTEGRANTES -->
      <div class="section">
        <h2>2. Integrantes da Unidade Familiar</h2>
        ${data.integrantes && data.integrantes.length > 0 ? `
          <table><thead><tr><th>Nome</th><th>Parentesco</th><th>Contato</th></tr></thead>
          <tbody>${data.integrantes.map((i: any) => `<tr><td>${i.nome || "-"}</td><td>${i.parentesco || "-"}</td><td>${i.contato || "-"}</td></tr>`).join("")}</tbody>
          </table>
        ` : "<p>Nenhum integrante cadastrado.</p>"}
      </div>

      <!-- 3. SOLO -->
      <div class="section">
        <h2>3. Tipos de Solos</h2>
        <div class="info-item"><span class="info-label">Descrição da Área:</span><div class="info-value">${data.solo?.descricaoArea || "Não informado"}</div></div>
        <div class="info-item"><span class="info-label">Tipo de Solo:</span><div class="info-value">${data.solo?.tipoSolo || "Não informado"}</div></div>
      </div>

      <!-- 4. ÁGUA -->
      <div class="section">
        <h2>4. Água</h2>
        <div class="info-item"><span class="info-label">Fontes de água:</span><div class="info-value">${obterFontesAgua(data.agua)}</div></div>
        <div class="info-item"><span class="info-label">Irrigação:</span><div class="info-value">${obterIrrigacao(data.agua)}</div></div>
        <div class="info-item"><span class="info-label">Análise da água:</span><div class="info-value">${data.agua?.analiseAguaFeita ? "Sim" : "Não"}</div></div>
      </div>

      <!-- 5. SITUAÇÃO ORGÂNICA -->
      <div class="section">
        <h2>5. Situação Orgânica da Propriedade</h2>
        <div class="info-item"><span class="info-label">Toda propriedade é orgânica?</span><div class="info-value">${data.statusOrganico?.todaPropriedadeOrganica ? "Sim" : "Não"}</div></div>
        <div class="info-item"><span class="info-label">Possui produção paralela?</span><div class="info-value">${data.statusOrganico?.possuiProducaoParalela ? "Sim" : "Não"}</div></div>
        <div class="info-item"><span class="info-label">Há conversão?</span><div class="info-value">${data.statusOrganico?.haConversao ? "Sim" : "Não"}</div></div>
      </div>

      <!-- 6. RISCOS -->
      <div class="section">
        <h2>6. Riscos de Contaminação</h2>
        <div class="info-item"><span class="info-label">Riscos identificados:</span><div class="info-value">${obterRiscos(data.riscoContaminacao)}</div></div>
        <div class="info-item"><span class="info-label">Formas de controle:</span><div class="info-value">${obterControles(data.riscoContaminacao)}</div></div>
      </div>

      <!-- 7. BIODIVERSIDADE -->
      <div class="section">
        <h2>7. Biodiversidade e Conservação do Solo</h2>
        <div class="info-item"><span class="info-label">Práticas adotadas:</span><div class="info-value">${obterPraticasBiodiversidade(data.biodiversidade)}</div></div>
      </div>

      <!-- 8. RESÍDUOS -->
      <div class="section">
        <h2>8. Destinação do Lixo e Esgoto</h2>
        <div class="info-item"><span class="info-label">Destino do lixo não orgânico:</span><div class="info-value">${obterDestinoLixoNaoOrganico(data.residuos)}</div></div>
        <div class="info-item"><span class="info-label">Destino do lixo orgânico:</span><div class="info-value">${obterDestinoLixoOrganico(data.residuos)}</div></div>
        <div class="info-item"><span class="info-label">Tratamento do esgoto:</span><div class="info-value">${obterTratamentoEsgoto(data.residuos)}</div></div>
      </div>

      <!-- 9. MATÉRIA ORGÂNICA -->
      <div class="section">
        <h2>9. Manejo da Matéria Orgânica</h2>
        <div class="info-item"><span class="info-label">Compostagem:</span><div class="info-value">${data.materiaOrganica?.comoFazCompostagem || "Não informado"}</div></div>
      </div>

      <!-- 10. ANIMAIS -->
      <div class="section">
        <h2>10. Animais na Propriedade</h2>
        <div class="info-item"><span class="info-label">Possui animais?</span><div class="info-value">${data.animais?.possuiAnimais ? "Sim" : "Não"}</div></div>
        ${data.animais?.possuiAnimais ? `<div class="info-item"><span class="info-label">Quais animais:</span><div class="info-value">${data.animais?.quais || "-"}</div></div>` : ""}
      </div>

      <!-- 11. CULTIVOS -->
      <div class="section">
        <h2>11. Produção Vegetal - Cultivos</h2>
        ${data.cultivos && data.cultivos.length > 0 ? `
          <td><thead><tr><th>Categoria</th><th>Produto</th><th>Área</th><th>Estimativa</th></tr></thead>
          <tbody>${data.cultivos.map((c: any) => `<tr><td>${c.categoria || "-"}</td><td>${c.produtoEspecieVariedade || "-"}</td><td>${c.areaValor || 0} ${c.areaUnidade || ""}</td><td>${c.estimativaAnual || "-"}</td></tr>`).join("")}</tbody>
        </table>
        ` : "<p>Nenhum cultivo cadastrado.</p>"}
      </div>

      <!-- 12. SEMENTES -->
      <div class="section">
        <h2>12. Sementes e Mudas</h2>
        <div class="info-item"><span class="info-label">Usa sementes orgânicas?</span><div class="info-value">${data.sementes?.usaSementesOrganicas ? "Sim" : "Não"}</div></div>
        <div class="info-item"><span class="info-label">Usa sementes próprias?</span><div class="info-value">${data.sementes?.usaProprias ? "Sim" : "Não"}</div></div>
      </div>

      <!-- 13. ESTRUTURAS -->
      <div class="section">
        <h2>13. Estruturas Físicas e Equipamentos</h2>
        ${data.estruturas && data.estruturas.length > 0 ? `
          <table><thead><tr><th>Estrutura</th><th>Estado</th></tr></thead>
          <tbody>${data.estruturas.map((e: any) => `<tr><td>${e.nome || "-"}</td><td>${e.estado || "-"}</td></tr>`).join("")}</tbody>
        </table>
        ` : "<p>Nenhuma estrutura cadastrada.</p>"}
      </div>

      <!-- 14. DIMENSÃO DA ÁREA -->
      <div class="section">
        <h2>14. Dimensão da Área</h2>
        <div class="info-item"><span class="info-label">Total da área:</span><div class="info-value">${data.areaResumo?.totalAssentamentoM2 || 0} m²</div></div>
        <div class="info-item"><span class="info-label">Área de manejo orgânico:</span><div class="info-value">${data.areaResumo?.areaManejoOrganicoM2 || 0} m²</div></div>
        <div class="info-item"><span class="info-label">Reserva legal:</span><div class="info-value">${data.areaResumo?.reservaLegalM2 || 0} m²</div></div>
      </div>

      <!-- 15. COMERCIALIZAÇÃO -->
      <div class="section">
        <h2>15. Comercialização</h2>
        <div class="info-item"><span class="info-label">Canais de venda:</span><div class="info-value">${obterCanaisVenda(data.comercializacao)}</div></div>
        <div class="info-item"><span class="info-label">Mão de obra externa:</span><div class="info-value">${data.comercializacao?.maoDeObraRegular ? "Sim" : "Não"}</div></div>
      </div>

      <!-- 16. DECLARAÇÃO -->
      <div class="section">
        <h2>16. Declaração e Assinatura</h2>
        <p>Declaro serem verdadeiras as informações deste Plano de Manejo Orgânico.</p>
        <div class="assinatura">
          <div class="assinatura-item"><div class="linha-assinatura"></div><p>Assinatura do Fornecedor<br>${plano?.responsavelNome || "_________________________"}</p></div>
          <div class="assinatura-item"><div class="linha-assinatura"></div><p>Assinatura do Coordenador<br>_________________________</p></div>
        </div>
        ${versao?.dataAprovacao ? `<p>Data de Aprovação: ${new Date(versao.dataAprovacao).toLocaleDateString('pt-BR')}</p>` : ""}
      </div>

      <div class="footer"><p>Documento gerado automaticamente pelo sistema AgroSaas em ${new Date().toLocaleString('pt-BR')}</p></div>
    </body>
    </html>
  `;

  // Funções auxiliares
  function obterFontesAgua(agua: any): string {
    const fontes = [];
    if (agua?.fonteAcude) fontes.push("Açude");
    if (agua?.fonteCorregoRio) fontes.push("Córrego/Rio");
    if (agua?.fontePoco) fontes.push("Poço");
    return fontes.length > 0 ? fontes.join(", ") : "Não informado";
  }

  function obterIrrigacao(agua: any): string {
    const irrigacoes = [];
    if (agua?.irrigacaoAspersao) irrigacoes.push("Aspersão");
    if (agua?.irrigacaoGotejamento) irrigacoes.push("Gotejamento");
    return irrigacoes.length > 0 ? irrigacoes.join(", ") : "Não informado";
  }

  function obterRiscos(riscos: any): string {
    const riscosList = [];
    if (riscos?.riscoTransgenico) riscosList.push("Transgênico");
    if (riscos?.riscoPulverizacaoProxima) riscosList.push("Pulverização");
    return riscosList.length > 0 ? riscosList.join(", ") : "Não informado";
  }

  function obterControles(riscos: any): string {
    const controles = [];
    if (riscos?.controleBarreiraVegetal) controles.push("Barreira vegetal");
    return controles.length > 0 ? controles.join(", ") : "Não informado";
  }

  function obterPraticasBiodiversidade(bio: any): string {
    const praticas = [];
    if (bio?.consorcio) praticas.push("Cultivos consociados");
    if (bio?.adubacaoOrganica) praticas.push("Adubação orgânica");
    if (bio?.coberturaSolo) praticas.push("Cobertura do solo");
    return praticas.length > 0 ? praticas.join(", ") : "Não informado";
  }

  function obterDestinoLixoNaoOrganico(residuos: any): string {
    const destinos = [];
    if (residuos?.lixoNaoOrganicoColetaPublica) destinos.push("Coleta pública");
    if (residuos?.lixoNaoOrganicoReaproveita) destinos.push("Reaproveita");
    return destinos.length > 0 ? destinos.join(", ") : "Não informado";
  }

  function obterDestinoLixoOrganico(residuos: any): string {
    const destinos = [];
    if (residuos?.lixoOrganicoCompostado) destinos.push("Compostado");
    return destinos.length > 0 ? destinos.join(", ") : "Não informado";
  }

  function obterTratamentoEsgoto(residuos: any): string {
    const tratamentos = [];
    if (residuos?.esgotoFossaSeptica) tratamentos.push("Fossa séptica");
    return tratamentos.length > 0 ? tratamentos.join(", ") : "Não informado";
  }

  function obterCanaisVenda(com: any): string {
    const canais = [];
    if (com?.vendaDiretaFeiras) canais.push("Feiras");
    if (com?.vendaEntregaDomicilio) canais.push("Entregas");
    if (com?.vendaCestas) canais.push("Cestas");
    return canais.length > 0 ? canais.join(", ") : "Não informado";
  }

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `plano_manejo_completo_${plano?.id}_${versao?.numeroVersao}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return true;
}