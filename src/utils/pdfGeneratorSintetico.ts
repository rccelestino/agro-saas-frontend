import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function gerarRelatorioPDFSintetico(data: any) {
  console.log("=== GERANDO PDF SINTÉTICO ===");
  
  // Criar container temporário
  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.padding = '25px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '10px';
  container.style.lineHeight = '1.3';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  
  container.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Sintético - Plano de Manejo Orgânico</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; vertical-align: top; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .header { text-align: center; margin-bottom: 15px; }
        .title { color: #2e7d32; font-size: 18px; font-weight: bold; }
        .subtitle { color: #2e7d32; font-size: 14px; margin-bottom: 10px; }
        .section-title { background-color: #2e7d32; color: white; padding: 4px 10px; margin: 10px 0 8px 0; font-weight: bold; font-size: 11px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0; }
        .info-card { background-color: #f9f9f9; border-left: 3px solid #2e7d32; padding: 6px 8px; border-radius: 3px; }
        .info-label { font-weight: bold; color: #2e7d32; font-size: 9px; text-transform: uppercase; margin-bottom: 3px; }
        .info-value { font-size: 10px; }
        .badge { background-color: #4caf50; color: white; padding: 3px 10px; border-radius: 15px; font-size: 10px; display: inline-block; }
        .assinatura-container { display: flex; justify-content: space-between; margin-top: 25px; }
        .assinatura { border-top: 1px solid #000; padding-top: 8px; width: 45%; text-align: center; }
        .footer { text-align: center; margin-top: 20px; font-size: 8px; color: #888; border-top: 1px solid #ddd; padding-top: 8px; }
        .declaracao-texto { text-align: justify; font-size: 9px; line-height: 1.3; margin: 8px 0; }
        .declaracao-texto p { margin: 5px 0; }
      </style>
    </head>
    <body>

    <!-- CABEÇALHO -->
    <div class="header">
      <div class="title">RELATÓRIO SINTÉTICO</div>
      <div class="subtitle">Plano de Manejo Orgânico</div>
      <p style="font-size: 9px; margin: 5px 0;"><strong>Associação Ecoceará de Certificação Participativa</strong><br>
      CNPJ: 43.075.772/0001-03<br>
      Rua Leonardo Mota, 2117 Sala C - Bairro: Aldeota - Fortaleza/Ceará<br>
      CEP: 60.170-041 - Fone/Fax: (85) 3223 8005</p>
      <hr style="margin: 8px 0;">
      <p style="font-size: 9px; margin: 5px 0;">Documento gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
      <p style="margin: 5px 0;"><strong>Status:</strong> <span class="badge">${data.status === "APROVADO" ? "APROVADO" : "RASCUNHO"}</span></p>
    </div>

    <!-- INFORMAÇÕES PRINCIPAIS -->
    <div class="section-title">DADOS DO PLANO</div>
    <div class="info-grid">
      <div class="info-card"><div class="info-label">Plano ID</div><div class="info-value">${data.id || "-"}</div></div>
      <div class="info-card"><div class="info-label">Tipo</div><div class="info-value">${data.tipoPlano || "-"}</div></div>
      <div class="info-card"><div class="info-label">Escopo</div><div class="info-value">${data.escopo || "-"}</div></div>
      <div class="info-card"><div class="info-label">Versão</div><div class="info-value">${data.numeroVersao || "-"}</div></div>
      <div class="info-card"><div class="info-label">Município/UF</div><div class="info-value">${data.municipio || "-"} ${data.uf ? `/${data.uf}` : ""}</div></div>
      <div class="info-card"><div class="info-label">Responsável</div><div class="info-value">${data.responsavelNome || "-"}</div></div>
    </div>

    <div class="section-title">INDICADORES DE PRODUÇÃO</div>
    <div class="info-grid">
      <div class="info-card"><div class="info-label">Tipo de Solo</div><div class="info-value">${data.tipoSolo || "-"}</div></div>
      <div class="info-card"><div class="info-label">Situação Orgânica</div><div class="info-value">${data.todaPropriedadeOrganica ? "Toda propriedade é orgânica" : "Em processo de conversão"}</div></div>
      <div class="info-card"><div class="info-label">Fontes de Água</div><div class="info-value">${data.fontesAgua || "-"}</div></div>
      <div class="info-card"><div class="info-label">Práticas de Biodiversidade</div><div class="info-value">${data.praticasBiodiversidade || "-"}</div></div>
      <div class="info-card"><div class="info-label">Quantidade de Cultivos</div><div class="info-value">${data.quantidadeCultivos || 0}</div></div>
      <div class="info-card"><div class="info-label">Canais de Venda</div><div class="info-value">${data.canaisVenda || "-"}</div></div>
    </div>

    ${data.dataAprovacao ? `
    <div class="section-title">APROVAÇÃO</div>
    <div class="info-grid">
      <div class="info-card"><div class="info-label">Data de Aprovação</div><div class="info-value">${new Date(data.dataAprovacao).toLocaleDateString('pt-BR')}</div></div>
    </div>
    ` : ""}

    <!-- DECLARAÇÃO - UMA PÁGINA COM TAMANHO REDUZIDO -->
    <div class="section-title">DECLARAÇÃO</div>
    <div class="declaracao-texto">
      <p>Declaro serem verdadeiras as informações deste Plano de Manejo Orgânico, comprometendo-me a comunicar imediatamente ao OPAC ECOCEARÁ por escrito, caso haja necessidade de uso de práticas essenciais não previstas neste Plano de Manejo Orgânico, incluindo anexos. Declaro ter total conhecimento da Lei 10.831 e as demais normas de produção Orgânicas brasileiras e trabalharei de acordo com elas.</p>
      
      <p>Declaro ter pleno conhecimento das regras de funcionamento do SPG ECOCEARÁ bem como comprometo-me a fornecer todas as informações necessárias para a efetivação do processo de Avaliação da Conformidade participativa junto ao OPAC ECOCEARÁ.</p>
      
      <p>Concordo com a verificação e o acesso integral pelos representantes do OPAC ECOCEARÁ aos locais da unidade de produção, orgânica ou não, sob minha responsabilidade. Concordo em fornecer qualquer informação adicional requerida pelos membros do OPAC ECOCEARÁ sobre a unidade de produção da qual solicito a avaliação participativa da conformidade orgânica.</p>
      
      <p>Estou ciente de que minha Unidade de Produção pode receber visitas ou coletas de amostras para análise de resíduos sem aviso prévio a qualquer momento, se isto for apropriado para garantir a conformidade da mesma com as normas mencionadas acima.</p>
      
      <p>Aceito eventuais condições e sanções no caso de não-conformidades detectadas pelos representantes do OPAC ECOCEARÁ, no Sistema Orgânico de Produção sob minha responsabilidade, resguardando-me o direito de recurso conforme as normas do OPAC ECOCEARÁ.</p>
      
      <p style="margin-top: 8px; font-weight: bold;">Todas as informações e as declarações feitas neste Plano de Manejo Orgânico são de meu total conhecimento e convicção.</p>
    </div>

    <!-- ASSINATURAS -->
    <div class="assinatura-container">
      <div class="assinatura">
        <p style="font-size: 9px;">Assinatura do Fornecedor<br><br>${data.responsavelNome || "_________________________"}</p>
      </div>
      <div class="assinatura">
        <p style="font-size: 9px;">Assinatura do Coordenador do grupo<br><br>_________________________</p>
      </div>
    </div>

    <!-- RODAPÉ -->
    <div class="footer">
      <p>Relatório sintético gerado pelo sistema AgroSaas</p>
    </div>

    </body>
    </html>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    let page = 1;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      page++;
    }
    
    pdf.save(`relatorio_sintetico_${data.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log(`PDF Sintético gerado com sucesso! Total de páginas: ${page}`);
    
  } catch (error) {
    console.error("Erro ao gerar PDF sintético:", error);
    throw error;
  } finally {
    document.body.removeChild(container);
  }
  
  return true;
}