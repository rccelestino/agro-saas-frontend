export async function gerarRelatorioPDFSintetico(data: any) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Sintético - Plano de Manejo Orgânico</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2e7d32; text-align: center; border-bottom: 2px solid #2e7d32; padding-bottom: 10px; }
        h2 { color: #2e7d32; margin-top: 25px; border-left: 4px solid #2e7d32; padding-left: 15px; }
        .header { text-align: center; margin-bottom: 30px; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 15px 0; }
        .info-item { padding: 10px; background-color: #f9f9f9; border-radius: 5px; }
        .info-label { font-weight: bold; color: #555; }
        .badge { background-color: #4caf50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; }
        .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório Sintético</h1>
        <h2>Plano de Manejo Orgânico</h2>
        <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
        <p><strong>Status:</strong> <span class="badge">${data.status === "APROVADO" ? "✓ APROVADO" : "📝 RASCUNHO"}</span></p>
      </div>

      <div class="info-grid">
        <div class="info-item"><span class="info-label">Plano ID:</span> ${data.id || "-"}</div>
        <div class="info-item"><span class="info-label">Tipo:</span> ${data.tipoPlano || "-"}</div>
        <div class="info-item"><span class="info-label">Escopo:</span> ${data.escopo || "-"}</div>
        <div class="info-item"><span class="info-label">Versão:</span> ${data.numeroVersao || "-"}</div>
        <div class="info-item"><span class="info-label">Município/UF:</span> ${data.municipio || "-"} ${data.uf ? `/${data.uf}` : ""}</div>
        <div class="info-item"><span class="info-label">Responsável:</span> ${data.responsavelNome || "-"}</div>
        <div class="info-item"><span class="info-label">Tipo de Solo:</span> ${data.tipoSolo || "-"}</div>
        <div class="info-item"><span class="info-label">Situação Orgânica:</span> ${data.todaPropriedadeOrganica ? "Toda a propriedade é orgânica" : "Em processo de conversão"}</div>
        <div class="info-item"><span class="info-label">Fontes de Água:</span> ${data.fontesAgua || "-"}</div>
        <div class="info-item"><span class="info-label">Práticas de Biodiversidade:</span> ${data.praticasBiodiversidade || "-"}</div>
        <div class="info-item"><span class="info-label">Quantidade de Cultivos:</span> ${data.quantidadeCultivos || 0}</div>
        <div class="info-item"><span class="info-label">Canais de Venda:</span> ${data.canaisVenda || "-"}</div>
        ${data.dataAprovacao ? `<div class="info-item"><span class="info-label">Data de Aprovação:</span> ${new Date(data.dataAprovacao).toLocaleDateString('pt-BR')}</div>` : ""}
      </div>

      <div class="footer">
        <p>Relatório sintético gerado pelo sistema AgroSaas</p>
        <p>${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio_sintetico_${data.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return true;
}