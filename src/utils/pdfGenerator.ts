import { api } from "../api/axios";

// Função para gerar PDF do plano completo
export async function gerarRelatorioPDF(planoId: number, versaoId: number) {
  try {
    // Buscar todos os dados do plano usando o formato correto de URL
    const [plano, versao, solo, agua, statusOrganico, riscos, biodiversidade, residuos, materiaOrganica, animais, cultivos, sementes, estruturas, comercializacao, areaResumo, roteiro, anexos, integrantes] = await Promise.all([
      api.get(`/pmo/planos/${planoId}`).then(res => res.data),
      api.get(`/pmo/planos/${planoId}/versoes`).then(res => res.data.find((v: any) => v.id === versaoId) || null),
      
      // CORRIGIDO: Usar o formato correto /pmo/versoes/{versaoId}/...
      api.get(`/pmo/versoes/${versaoId}/solo`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/agua`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/status-organico`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/risco-contaminacao`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/biodiversidade`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/residuos`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/materia-organica`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/animais`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/cultivos`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/sementes`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/estruturas`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/comercializacao`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/area-resumo`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/roteiro-acesso`).catch(() => null),
      api.get(`/pmo/versoes/${versaoId}/anexos`).catch(() => []),
      api.get(`/pmo/planos/${planoId}/integrantes`).catch(() => []),
    ]);

    // Criar conteúdo HTML para o PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Plano de Manejo Orgânico - AgroSaas</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #2e7d32; text-align: center; border-bottom: 2px solid #2e7d32; padding-bottom: 10px; }
          h2 { color: #2e7d32; margin-top: 30px; border-left: 4px solid #2e7d32; padding-left: 15px; }
          h3 { color: #555; margin-top: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
          .info-item { padding: 8px; background-color: #f9f9f9; border-radius: 4px; }
          .badge { background-color: #4caf50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Plano de Manejo Orgânico</h1>
          <p>Gerado pelo sistema AgroSaas em ${new Date().toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span class="badge">${versao?.status || "RASCUNHO"}</span></p>
        </div>

        <!-- Dados de Identificação -->
        <div class="section">
          <h2>1. Identificação da Propriedade</h2>
          <div class="info-grid">
            <div class="info-item"><strong>Plano:</strong> ${plano?.id || "-"}</div>
            <div class="info-item"><strong>Tipo:</strong> ${plano?.tipoPlano || "-"}</div>
            <div class="info-item"><strong>Escopo:</strong> ${plano?.escopo || "-"}</div>
            <div class="info-item"><strong>Grupo:</strong> ${plano?.grupo || "-"}</div>
            <div class="info-item"><strong>Núcleo:</strong> ${plano?.nucleo || "-"}</div>
            <div class="info-item"><strong>Comunidade:</strong> ${plano?.comunidade || "-"}</div>
            <div class="info-item"><strong>Município:</strong> ${plano?.municipio || "-"} ${plano?.uf ? `/${plano.uf}` : ""}</div>
            <div class="info-item"><strong>Unidade Produtiva:</strong> ${plano?.unidadeProdutivaFamilia || "-"}</div>
            <div class="info-item"><strong>Responsável:</strong> ${plano?.responsavelNome || "-"}</div>
            <div class="info-item"><strong>CPF:</strong> ${plano?.responsavelCpf || "-"}</div>
            <div class="info-item"><strong>Contato:</strong> ${plano?.responsavelContato || "-"}</div>
          </div>
        </div>

        <!-- Integrantes da Família -->
        <div class="section">
          <h2>2. Integrantes da Unidade Familiar</h2>
          ${integrantes && integrantes.length > 0 ? `
            <table>
              <thead><tr><th>Nome</th><th>Parentesco</th><th>Contato</th></tr></thead>
              <tbody>
                ${integrantes.map((i: any) => `<tr><td>${i.nome || "-"}</td><td>${i.parentesco || "-"}</td><td>${i.contato || "-"}</td></tr>`).join("")}
              </tbody>
            </table>
          ` : "<p>Nenhum integrante cadastrado.</p>"}
        </div>

        <!-- Solo -->
        <div class="section">
          <h2>3. Tipos de Solos</h2>
          ${solo ? `
            <div class="info-item"><strong>Descrição da Área:</strong> ${solo.descricaoArea || "-"}</div>
            <div class="info-item"><strong>Tipo de Solo:</strong> ${solo.tipoSolo || "-"}</div>
          ` : "<p>Não informado.</p>"}
        </div>

        <!-- Água -->
        <div class="section">
          <h2>4. Água</h2>
          ${agua ? `
            <div class="info-item"><strong>Fontes de água:</strong> ${agua.fontePoco ? "Poço " : ""}${agua.fonteAcude ? "Açude " : ""}${agua.fonteCorregoRio ? "Córrego/Rio " : ""}</div>
            <div class="info-item"><strong>Irrigação:</strong> ${agua.irrigacaoGotejamento ? "Gotejamento " : ""}${agua.irrigacaoAspersao ? "Aspersão " : ""}</div>
            <div class="info-item"><strong>Análise da água:</strong> ${agua.analiseAguaFeita ? "Sim" : "Não"}</div>
          ` : "<p>Não informado.</p>"}
        </div>

        <div class="footer">
          <p>Documento gerado automaticamente pelo sistema AgroSaas</p>
          <p>Data de geração: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Criar blob e baixar
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plano_manejo_${planoId}_${versaoId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}