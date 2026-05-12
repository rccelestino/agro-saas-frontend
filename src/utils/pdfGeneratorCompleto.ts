import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function gerarRelatorioPDFCompleto(data: any) {
  console.log("=== GERANDO PDF COMPLETO ===");


   // LOG PARA DEBUG - VERIFICAR TODOS OS DADOS
  console.log("=== DEBUG - DADOS RECEBIDOS ===");
  console.log("data.solo:", JSON.stringify(data.solo, null, 2));
  console.log("data.statusOrganico:", JSON.stringify(data.statusOrganico, null, 2));
  console.log("data.riscoContaminacao:", JSON.stringify(data.riscoContaminacao, null, 2));
  console.log("data.agua:", JSON.stringify(data.agua, null, 2));
  console.log("data.biodiversidade:", JSON.stringify(data.biodiversidade, null, 2));
  
  const plano = data.plano;
  const versao = data.versao;
  
  // ========== FUNCOES AUXILIARES ==========
  const formatar = (valor: any): string => {
    if (valor === null || valor === undefined || valor === '') return '';
    if (typeof valor === 'string' && valor.trim() === '') return '';
    if (valor === 'Nao informado') return '';
    return String(valor);
  };
  
  const checkbox = (condicao: boolean, texto: string) => {
    return condicao ? `( X ) ${texto}` : `(   ) ${texto}`;
  };
  
  // ========== BUSCAR DADOS DAS SECOES ==========
  const cultivos = data.cultivos || [];
  const produtosOrganicos = cultivos.filter((c: any) => c.tipo !== 'NAO_ORGANICO' && c.tipo !== 'NAO_ORGANICOS');
  const produtosNaoOrganicos = cultivos.filter((c: any) => c.tipo === 'NAO_ORGANICO' || c.tipo === 'NAO_ORGANICOS');
  
  const insumosAdubacao = data.insumoAdubacao || [];
  const insumosDefensivos = data.insumoDefensivo || [];
  const estruturas = data.estruturas || [];
  const equipamentos = data.equipamentos || [];
  const integrantes = data.integrantes || [];
  const sementesCrioulas = data.sementeCrioula || [];
  const origemSementes = data.origemSementeItem || [];
  const anexos = data.anexos || [];
  
  const imagensCroqui = anexos.filter((a: any) => {
    return a.tipo === 'CROQUI' || a.tipo === 'IMAGEM' ||
      (a.mimeType && a.mimeType.startsWith('image/')) ||
      (a.nome_arquivo && a.nome_arquivo.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i));
  });
  
  const getImageUrl = (uri: string): string => {
    if (!uri) return '';
    if (uri.startsWith('http')) return uri;
    if (uri.startsWith('/api/uploads')) return `http://localhost:8080${uri}`;
    if (uri.startsWith('/uploads')) return `http://localhost:8080${uri}`;
    return `http://localhost:8080${uri.startsWith('/') ? uri : '/' + uri}`;
  };
  
  // ========== GERAR HTML DAS TABELAS ==========
  
  const produtosOrganicosHTML = produtosOrganicos.length > 0 ?
    produtosOrganicos.map((c: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(c.produto_especie_variedade)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(c.area_valor)} ${formatar(c.area_unidade)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(c.estimativa_anual)}</td>
      </tr>
    `).join('') : '<tr><td colspan="3" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhum produto cadastrado</td></tr>';
  
  const produtosNaoOrganicosHTML = produtosNaoOrganicos.length > 0 ?
    produtosNaoOrganicos.map((c: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(c.produto_especie_variedade)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(c.area_valor)} ${formatar(c.area_unidade)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(c.estimativa_anual)}</td>
      </tr>
    `).join('') : '<tr><td colspan="3" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhum produto nao organico cadastrado</td></tr>';
  
  const insumosAdubacaoHTML = insumosAdubacao.length > 0 ?
    insumosAdubacao.map((i: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.substancia)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.marca_nome_comercial)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.cultura_area)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.quantidade_dose)}</td>
      </tr>
    `).join('') : '<tr><td colspan="4" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhum insumo cadastrado</td></tr>';
  
  const insumosDefensivosHTML = insumosDefensivos.length > 0 ?
    insumosDefensivos.map((i: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.substancia)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.marca_nome_comercial)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.cultura_area)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.quantidade_dose)}</td>
      </tr>
    `).join('') : '<tr><td colspan="4" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhum insumo cadastrado</td></tr>';
  
  const estruturasHTML = estruturas.length > 0 ?
    estruturas.map((e: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(e.nome)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(e.tempo_meses)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(e.estado)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(e.observacao)}</td>
      </tr>
    `).join('') : '<tr><td colspan="4" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhuma estrutura cadastrada</td></tr>';
  
  const equipamentosHTML = equipamentos.length > 0 ?
    equipamentos.map((e: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(e.especificacao)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(e.tempo_meses)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(e.estado)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(e.observacao)}</td>
      </tr>
    `).join('') : '<tr><td colspan="4" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhum equipamento cadastrado</td></tr>';
  
  const integrantesHTML = integrantes.length > 0 ?
    integrantes.map((i: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.nome)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.parentesco)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(i.contato)}</td>
      </tr>
    `).join('') : '<tr><td colspan="3" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhum integrante cadastrado</td></tr>';
  
  const sementesCrioulasHTML = sementesCrioulas.length > 0 ?
    sementesCrioulas.map((s: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(s.nome_variedade)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(s.quantidade)}</td>
      </tr>
    `).join('') : '<tr><td colspan="2" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhuma semente crioula cadastrada</td></tr>';
  
  const origemSementesHTML = origemSementes.length > 0 ?
    origemSementes.map((o: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(o.especie_cultivar)}</td>
        <td style="border:1px solid #ddd; padding:5px;">${checkbox(o.origem === 'PROPRIA', 'Propria')} ${checkbox(o.origem === 'ADQUIRIDA', 'Adquirida')}</td>
        <td style="border:1px solid #ddd; padding:5px;">${checkbox(o.condicao === 'ORGANICA', 'Organica')} ${checkbox(o.condicao === 'CONVENCIONAL', 'Convencional')}</td>
      </tr>
    `).join('') : '<tr><td colspan="3" style="border:1px solid #ddd; padding:5px; text-align:center;">Nenhuma origem cadastrada</td></tr>';
  
  const croquiImagesHTML = imagensCroqui.length > 0 ?
    imagensCroqui.map((img: any) => `<div style="margin:10px auto; text-align:center;"><img src="${getImageUrl(img.uri)}" style="max-width:90%; max-height:280px; border:1px solid #ddd;" /></div>`).join('') :
    '<p style="text-align:center; padding:30px; border:1px dashed #ccc;">Nenhum croqui foi anexado</p>';
  
  // Dados do solo
  const soloData = data.solo || {};
  const descricaoArea = soloData.descricaoArea || '';
  const tipoSolo = soloData.tipoSolo || '';
  
  // ============================================
  // PAGINA 1 - IDENTIFICACAO, INTEGRANTES, DIMENSAO DA AREA
  // ============================================
  // ============================================
// PAGINA 1 - IDENTIFICACAO, INTEGRANTES, DIMENSAO DA AREA, TIPOS DE SOLOS
// ============================================
const pagina1HTML = `
  <div style="font-family: Arial, sans-serif; padding: 15px; width: 210mm; box-sizing: border-box;">
    <div style="text-align:center; margin-bottom:15px;">
      <h1 style="color:#2e7d32; font-size:18px;">PLANO DE MANEJO ORGANICO</h1>
      <p style="font-size:10px;"><strong>Associacao Ecoceara de Certificacao Participativa</strong><br>
      CNPJ: 43.075.772/0001-03<br>
      Rua Leonardo Mota, 2117 Sala C - Bairro: Aldeota - Fortaleza/Ceara<br>
      CEP: 60.170-041 - Fone/Fax: (85) 3223 8005</p>
      <hr>
      <p style="font-size:9px;">Documento gerado em: ${new Date().toLocaleDateString('pt-BR')} | Status: ${versao?.status === "APROVADO" ? "APROVADO" : "RASCUNHO"}</p>
    </div>
    
    <table style="width:100%; border-collapse:collapse; font-size:10px;">
      <tr>
        <td style="border:1px solid #ddd; padding:5px; width:20%; background:#f5f5f5;">TIPO DE PLANO</td>
        <td style="border:1px solid #ddd; padding:5px;" colspan="3">${checkbox(plano?.tipoPlano === "PMA", "Novo Plano de Manejo")} / ${checkbox(plano?.tipoPlano === "ATUALIZACAO", "Atualizacao")}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">ESCOPO</td>
        <td style="border:1px solid #ddd; padding:5px;" colspan="3">${checkbox(plano?.escopo === "PROPRIEDADE", "Producao Primaria Vegetal")} / ${checkbox(plano?.escopo === "ANIMAL", "Producao Primaria Animal")}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">GRUPO</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(plano?.grupo)}</td>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">NUCLEO</td>
        <td style="border:1px solid #ddd; padding:5px;">${formatar(plano?.nucleo)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">COMUNIDADE</td>
        <td colspan="3">${formatar(plano?.comunidade)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">MUNICIPIO/UF</td>
        <td colspan="3">${formatar(plano?.municipio)} / ${formatar(plano?.uf)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">UNIDADE PRODUTIVA/FAMILIA</td>
        <td colspan="3">${formatar(plano?.unidadeProdutivaFamilia)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">COORDENADA GEORREF.</td>
        <td colspan="3">Lat: ${formatar(plano?.geoLatNum || plano?.geoLat)} / Long: ${formatar(plano?.geoLngNum || plano?.geoLng)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">RESPONSAVEL</td>
        <td colspan="3">${formatar(plano?.responsavelNome)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">CPF</td>
        <td>${formatar(plano?.responsavelCpf)}</td>
        <td style="border:1px solid #ddd; padding:5px; background:#f5f5f5;">CONTATO</td>
        <td>${formatar(plano?.responsavelContato)}</td>
      </tr>
    </table>
    
    <h3 style="background-color:#2e7d32; color:white; padding:5px; margin:10px 0;">OUTROS INTEGRANTES DA UNIDADE FAMILIAR</h3>
    <table style="width:100%; border-collapse:collapse; font-size:10px;">
      <tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:5px;">NOME</th><th style="border:1px solid #ddd; padding:5px;">PARENTESCO</th><th style="border:1px solid #ddd; padding:5px;">CONTATO</th></tr>
      ${integrantesHTML}
    </table>
    
    <h3 style="background-color:#2e7d32; color:white; padding:5px; margin:10px 0;">DIMENSAO DA AREA</h3>
    <table style="width:100%; border-collapse:collapse; font-size:10px;">
      <tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:5px;">DESCRICAO DA AREA</th><th style="border:1px solid #ddd; padding:5px;">TAMANHO ESTIMADO</th></tr>
      <tr><td style="border:1px solid #ddd; padding:5px;">Total da area do Assentamento</td><td style="border:1px solid #ddd; padding:5px;">${formatar(data.areaResumo?.totalAssentamentoM2)} m²</td></tr>
      <tr><td style="border:1px solid #ddd; padding:5px;">Area de manejo Organico utilizada</td><td style="border:1px solid #ddd; padding:5px;">${formatar(data.areaResumo?.areaManejoOrganicoM2)} m²</td></tr>
      <tr><td style="border:1px solid #ddd; padding:5px;">Reserva Legal</td><td style="border:1px solid #ddd; padding:5px;">${formatar(data.areaResumo?.reservaLegalM2)} m²</td></tr>
      <tr><td style="border:1px solid #ddd; padding:5px;">Area de producao Paralela</td><td style="border:1px solid #ddd; padding:5px;">${formatar(data.areaResumo?.areaProducaoParalelaM2) || '----'}</td></tr>
      <tr><td style="border:1px solid #ddd; padding:5px;">Area das estruturas e moradias</td><td style="border:1px solid #ddd; padding:5px;">${formatar(data.areaResumo?.areaEstruturasMoradiasM2) || '----'}</td></tr>
    </table>
    
    <!-- TIPOS DE SOLOS - ADICIONADO AQUI -->
    <h3 style="background-color:#2e7d32; color:white; padding:5px; margin:10px 0;">TIPOS DE SOLOS</h3>
    <p style="font-size:10px;"><strong>Quais os tipos (simplificados) de solo da area de uso?</strong></p>
    <table style="width:100%; border-collapse:collapse; font-size:10px;">
      <tr style="background:#f5f5f5;">
        <td style="border:1px solid #ddd; padding:8px; font-weight:bold;">DESCRICAO DA AREA</td>
        <td style="border:1px solid #ddd; padding:8px; font-weight:bold;">TIPO DE SOLO</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:8px;">${descricaoArea || '_________________________'}</td>
        <td style="border:1px solid #ddd; padding:8px;">${tipoSolo || '_________________________'}</td>
      </tr>
    </table>
  </div>
`;
  // ============================================
// PAGINA 2 - ROTEIRO, CROQUI, SITUACAO ORGANICA, RISCOS
// ============================================
const pagina2HTML = `
  <div style="font-family: Arial, sans-serif; padding: 15px; width: 210mm; box-sizing: border-box;">
    
    <h3 style="background-color:#2e7d32; color:white; padding:5px;">ROTEIRO DE ACESSO A UNIDADE PRODUTIVA</h3>
    <p style="font-size:10px;">${data.roteiroAcesso || "___________________________________________________________________________________________"}</p>
    
    <h3 style="background-color:#2e7d32; color:white; padding:5px;">CROQUI DA AREA DE PRODUCAO</h3>
    ${croquiImagesHTML}
    <p style="text-align:center;"><strong>Area Total:</strong> ${formatar(data.areaResumo?.totalAssentamentoM2)} m²</p>
    
    <!-- SITUACAO ORGANICA -->
    <h3 style="background-color:#2e7d32; color:white; padding:5px;">SITUACAO ORGANICA DA PROPRIEDADE</h3>
    <p style="font-size:10px;">${data.statusOrganico?.todaPropriedadeOrganica ? "( X ) Toda propriedade já é Orgânica?" : "(   ) Toda propriedade já é Orgânica?"}</p>
    <p style="font-size:10px;">${data.statusOrganico?.possuiProducaoParalela ? "( X ) Possui produção paralela? (não orgânica e orgânica)" : "(   ) Possui produção paralela? (não orgânica e orgânica)"}</p>
    <p style="font-size:10px;">${data.statusOrganico?.haConversao ? "( X ) Há conversão ?" : "(   ) Há conversão ?"} ${data.statusOrganico?.conversaoTipo === "PARCIAL" ? "( X ) parcial" : "(   ) parcial"} ${data.statusOrganico?.conversaoTipo === "TOTAL" ? "( X ) total" : "(   ) total"}</p>
    <p style="font-size:10px;"><strong>Em quanto tempo sua propriedade pode se tornar totalmente orgânica?</strong><br>
    ${data.statusOrganico?.prazoTotalmenteOrganico ? `( X ) ${data.statusOrganico.prazoTotalmenteOrganico}` : "(   ) 01 ano (   ) 02 anos (   ) 03 anos (   ) 04 anos (   ) outros"}</p>
    <p style="font-size:10px;"><strong>O que precisa ser feito para sua propriedade se tornar 100% orgânica?</strong><br>${data.statusOrganico?.oQuePrecisaFazer || "____________________________________________________________________"}</p>
    <p style="font-size:10px;"><strong>Quais mudanças realizará para fazer a conversão total e ou evoluir na produção orgânica?</strong><br>${data.statusOrganico?.mudancasParaConversao || "____________________________________________________________________"}</p>
    
    <!-- RISCOS DE CONTAMINACAO -->
    <h3 style="background-color:#2e7d32; color:white; padding:5px;">RISCOS DE CONTAMINACAO</h3>
    <p style="font-size:10px;"><strong>Quais os principais riscos de contaminação da produção orgânica de sua propriedade?</strong></p>
    <p style="font-size:10px;">${data.riscoContaminacao?.riscoTransgenico ? "( X ) Cultivo de transgênico próximo" : "(   ) Cultivo de transgênico próximo"} ${data.riscoContaminacao?.riscoPulverizacaoProxima ? "( X ) Pulverização próxima" : "(   ) Pulverização próxima"}</p>
    <p style="font-size:10px;">${data.riscoContaminacao?.riscoInsumosQuimicosProximo ? "( X ) Uso de insumos químicos próximo" : "(   ) Uso de insumos químicos próximo"} ${data.riscoContaminacao?.riscoCursosAgua ? "( X ) Contaminação por cursos de água" : "(   ) Contaminação por cursos de água"}</p>
    <p style="font-size:10px;">${data.riscoContaminacao?.riscoPulverizacaoVizinhos ? "( X ) Contaminação por pulverização de áreas vizinhas" : "(   ) Contaminação por pulverização de áreas vizinhas"}</p>
    <p style="font-size:10px;"><strong>Quais as formas de controle usadas na sua propriedade para evitar a contaminação nas divisas com vizinhos que produz convencional?</strong><br>
    ${data.riscoContaminacao?.controleBarreiraVegetal ? "( X ) Barreiras vegetal" : "(   ) Barreiras vegetal"} 
    ${data.riscoContaminacao?.controleAcordoVizinho ? "( X ) Acordo com vizinho para respeitar um limite de controle" : "(   ) Acordo com vizinho para respeitar um limite de controle"}<br>
    ${data.riscoContaminacao?.controleSemRisco ? "( X ) Não oferece risco de contaminação" : "(   ) Não oferece risco de contaminação"} 
    ${data.riscoContaminacao?.controleOutros ? `( X ) ${data.riscoContaminacao.controleOutros}` : "(   ) Outros"}</p>
    <p style="font-size:10px;"><strong>Quais suas principais dificuldades no controle para evitar contaminação?</strong><br>${data.riscoContaminacao?.dificuldades || "____________________________________________________________________"}</p>
    
  </div>
`;
    
  // ============================================
  // PAGINA 3 - AGUA, DESTINACAO DO LIXO, BIODIVERSIDADE, ATIVIDADES, ANIMAIS
  // ============================================
  const pagina3HTML = `
    <div style="font-family: Arial, sans-serif; padding: 15px; width: 210mm; box-sizing: border-box;">
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">AGUA</h3>
      <p style="font-size:10px;"><strong>Qual fonte de agua utilizada para a producao?</strong><br>
      ${checkbox(data.agua?.fonteAcude, "Acude ou Barragem")} ${checkbox(data.agua?.fonteCorregoRio, "Corrego ou Rio")} 
      ${checkbox(data.agua?.fontePoco, "Poco comum ou Artesiano")} ${checkbox(data.agua?.fonteRiacho, "Riacho")} ${checkbox(data.agua?.fonteCisterna, "Cisternas de placa")}</p>
      <p style="font-size:10px;"><strong>Que sistema de irrigacao e usado?</strong><br>
      ${checkbox(data.agua?.irrigacaoAspersao, "Aspersao")} ${checkbox(data.agua?.irrigacaoMicroaspersao, "Micro aspersao")} ${checkbox(data.agua?.irrigacaoGotejamento, "Gotejamento")}
      ${checkbox(data.agua?.irrigacaoBombeamento, "Bombeamento")} ${checkbox(data.agua?.irrigacaoGravidade, "Gravidade natural")} ${checkbox(data.agua?.irrigacaoSulcos, "Sulcos")} ${checkbox(data.agua?.irrigacaoNenhum, "Nenhum")}</p>
      <p style="font-size:10px;"><strong>Fez analise da agua?</strong> ${data.agua?.analiseAguaFeita ? "Sim" : "Nao"}</p>
      <p style="font-size:10px;">${checkbox(data.agua?.riscoContaminacaoAgua, "Ha riscos de contaminacao da agua utilizada?")}</p>
      <p style="font-size:10px;"><strong>O que faz para garantir a qualidade da agua?</strong><br>
      ${checkbox(data.agua?.acoesMataCiliar, "Mantenho a mata ciliar")} ${checkbox(data.agua?.acoesAnaliseAgua, "Faco analise da agua")}<br>
      ${checkbox(data.agua?.acoesOrientaVizinhos, "Oriento meus vizinhos")} ${checkbox(data.agua?.acoesManejoResiduais, "Realizo o manejo das aguas residuais")}<br>
      ${checkbox(data.agua?.acoesMantemNascente, "Mantenho a nascente propria")}</p>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">DESTINACAO DO LIXO</h3>
      <p style="font-size:10px;"><strong>Destino do lixo nao-organico:</strong> ${data.residuos?.lixoNaoOrganicoColetaPublica ? "Encaminha a coleta publica" : ""} ${data.residuos?.lixoNaoOrganicoReaproveita ? "Reaproveita" : ""}</p>
      <p style="font-size:10px;"><strong>Destino do lixo organico:</strong> ${data.residuos?.lixoOrganicoCompostado ? "Compostado" : ""}</p>
      <p style="font-size:10px;"><strong>Tratamento do esgoto:</strong> ${data.residuos?.esgotoFossaSeptica ? "Fossa septica/sumidouro" : ""}</p>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">BIODIVERSIDADE E CONSERVACAO DO SOLO</h3>
      <p style="font-size:10px;">${checkbox(data.biodiversidade?.consorcio, "Cultivos consociados")} ${checkbox(data.biodiversidade?.recuperacaoApps, "Recuperacao/enriquecimento de APPs")}</p>
      <p style="font-size:10px;">${checkbox(data.biodiversidade?.rotacaoCultura, "Rotacao de Cultura")} ${checkbox(data.biodiversidade?.quebraVento, "Quebra vento")}</p>
      <p style="font-size:10px;">${checkbox(data.biodiversidade?.semFogo, "Agricultura na propriedade sem fogo")} ${checkbox(data.biodiversidade?.adubacaoOrganica, "Adubacao Organica")}</p>
      <p style="font-size:10px;">${checkbox(data.biodiversidade?.coberturaSolo, "Cobertura do Solo")}</p>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">ATIVIDADES EDUCATIVAS</h3>
      <p style="font-size:10px;">${checkbox(data.atividadesEducativas?.incentivaEscolarizacao, "Incentiva a escolarizacao")}</p>
      ${data.atividadesEducativas?.incentivaEscolarizacao ? `<p style="font-size:10px;"><strong>Como?</strong> ${formatar(data.atividadesEducativas?.comoIncentiva)}</p>` : ''}
      <p style="font-size:10px;">${checkbox(data.atividadesEducativas?.participaAssociacao, "Participa da associacao comunitaria")}</p>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">ANIMAIS NA PROPRIEDADE</h3>
      <p style="font-size:10px;">${checkbox(data.animais?.possuiAnimais, "Possui animais de estimacao")}</p>
      ${data.animais?.possuiAnimais ? `
        <p style="font-size:10px;"><strong>Quais?</strong> ${formatar(data.animais?.quais)}</p>
        <p style="font-size:10px;"><strong>Como sao alimentados?</strong> ${formatar(data.animais?.alimentacao)}</p>
        <p style="font-size:10px;"><strong>Tratamento de doencas:</strong> ${formatar(data.animais?.tratamentoDoencas)}</p>
        <p style="font-size:10px;">${checkbox(data.animais?.circulamLivre, "Circulam livremente pela propriedade")}</p>
        <p style="font-size:10px;">${checkbox(data.animais?.oferecemRiscoContaminacao, "Os animais oferecem riscos de contaminacao da producao?")}</p>
      ` : ''}
    </div>
  `;
  
  // ============================================
// PAGINA 4 - SITUACAO ORGANICA, RISCOS, PRODUTOS ORGANICOS E NAO ORGANICOS
// ============================================
const pagina4HTML = `
  <div style="font-family: Arial, sans-serif; padding: 15px; width: 210mm; box-sizing: border-box;">
    
    <!-- SITUACAO ORGANICA -->
    <h3 style="background-color:#2e7d32; color:white; padding:5px;">SITUACAO ORGANICA DA PROPRIEDADE</h3>
    <p style="font-size:10px; margin:3px 0;">${data.statusOrganico?.todaPropriedadeOrganica ? "( X ) Toda propriedade já é Orgânica?" : "(   ) Toda propriedade já é Orgânica?"}</p>
    <p style="font-size:10px; margin:3px 0;">${data.statusOrganico?.possuiProducaoParalela ? "( X ) Possui produção paralela? (não orgânica e orgânica)" : "(   ) Possui produção paralela? (não orgânica e orgânica)"}</p>
    <p style="font-size:10px; margin:3px 0;">${data.statusOrganico?.haConversao ? "( X ) Há conversão ?" : "(   ) Há conversão ?"} ${data.statusOrganico?.conversaoTipo === "PARCIAL" ? "( X ) parcial" : "(   ) parcial"} ${data.statusOrganico?.conversaoTipo === "TOTAL" ? "( X ) total" : "(   ) total"}</p>
    <p style="font-size:10px; margin:5px 0;"><strong>Em quanto tempo sua propriedade pode se tornar totalmente orgânica?</strong><br>
    ${data.statusOrganico?.prazoTotalmenteOrganico === "01 ano" ? "( X ) 01 ano" : "(   ) 01 ano"} 
    ${data.statusOrganico?.prazoTotalmenteOrganico === "02 anos" ? "( X ) 02 anos" : "(   ) 02 anos"} 
    ${data.statusOrganico?.prazoTotalmenteOrganico === "03 anos" ? "( X ) 03 anos" : "(   ) 03 anos"} 
    ${data.statusOrganico?.prazoTotalmenteOrganico === "04 anos" ? "( X ) 04 anos" : "(   ) 04 anos"} 
    ${data.statusOrganico?.prazoTotalmenteOrganico && !["01 ano","02 anos","03 anos","04 anos"].includes(data.statusOrganico.prazoTotalmenteOrganico) ? `( X ) ${data.statusOrganico.prazoTotalmenteOrganico}` : "(   ) outros"}</p>
    <p style="font-size:10px; margin:5px 0;"><strong>O que precisa ser feito para sua propriedade se tornar 100% orgânica?</strong><br>${data.statusOrganico?.oQuePrecisaFazer || "____________________________________________________________________"}</p>
    <p style="font-size:10px; margin:5px 0;"><strong>Quais mudanças realizará para fazer a conversão total e ou evoluir na produção orgânica?</strong><br>${data.statusOrganico?.mudancasParaConversao || "____________________________________________________________________"}</p>
    
    <!-- RISCOS DE CONTAMINACAO -->
    <h3 style="background-color:#2e7d32; color:white; padding:5px; margin-top:15px;">RISCOS DE CONTAMINACAO</h3>
    <p style="font-size:10px;"><strong>Quais os principais riscos de contaminação da produção orgânica de sua propriedade?</strong></p>
    <p style="font-size:10px; margin:2px 0;">${data.riscoContaminacao?.riscoTransgenico ? "( X ) Cultivo de transgênico próximo" : "(   ) Cultivo de transgênico próximo"} ${data.riscoContaminacao?.riscoPulverizacaoProxima ? "( X ) Pulverização próxima" : "(   ) Pulverização próxima"}</p>
    <p style="font-size:10px; margin:2px 0;">${data.riscoContaminacao?.riscoInsumosQuimicosProximo ? "( X ) Uso de insumos químicos próximo" : "(   ) Uso de insumos químicos próximo"} ${data.riscoContaminacao?.riscoCursosAgua ? "( X ) Contaminação por cursos de água" : "(   ) Contaminação por cursos de água"}</p>
    <p style="font-size:10px; margin:2px 0;">${data.riscoContaminacao?.riscoPulverizacaoVizinhos ? "( X ) Contaminação por pulverização de áreas vizinhas" : "(   ) Contaminação por pulverização de áreas vizinhas"}</p>
    <p style="font-size:10px; margin:5px 0;"><strong>Quais as formas de controle usadas na sua propriedade para evitar a contaminação nas divisas com vizinhos que produz convencional?</strong><br>
    ${data.riscoContaminacao?.controleBarreiraVegetal ? "( X ) Barreiras vegetal" : "(   ) Barreiras vegetal"} 
    ${data.riscoContaminacao?.controleAcordoVizinho ? "( X ) Acordo com vizinho para respeitar um limite de controle" : "(   ) Acordo com vizinho para respeitar um limite de controle"}<br>
    ${data.riscoContaminacao?.controleSemRisco ? "( X ) Não oferece risco de contaminação" : "(   ) Não oferece risco de contaminação"} 
    ${data.riscoContaminacao?.controleOutros ? `( X ) ${data.riscoContaminacao.controleOutros}` : "(   ) Outros"}</p>
    <p style="font-size:10px; margin:5px 0;"><strong>Quais suas principais dificuldades no controle para evitar contaminação?</strong><br>${data.riscoContaminacao?.dificuldades || "____________________________________________________________________"}</p>
    
    <!-- PRODUTOS ORGANICOS CULTIVADOS -->
    <h3 style="background-color:#2e7d32; color:white; padding:5px; margin-top:15px;">PRODUTOS ORGANICOS CULTIVADOS</h3>
    <table style="width:100%; border-collapse:collapse; font-size:9px;">
      <tr style="background:#f5f5f5;">
        <th style="border:1px solid #ddd; padding:5px;">PRODUTO/ESPECIES</th>
        <th style="border:1px solid #ddd; padding:5px;">AREA UTILIZADA</th>
        <th style="border:1px solid #ddd; padding:5px;">ESTIMATIVA ANUAL</th>
      </tr>
      ${produtosOrganicosHTML}
    </table>
    
    <!-- PRODUTOS NAO ORGANICOS -->
    <h3 style="background-color:#2e7d32; color:white; padding:5px;">PRODUTOS NAO ORGANICOS (PRODUCAO PARALELA)</h3>
    <table style="width:100%; border-collapse:collapse; font-size:9px;">
      <tr style="background:#f5f5f5;">
        <th style="border:1px solid #ddd; padding:5px;">PRODUTO/ESPECIES</th>
        <th style="border:1px solid #ddd; padding:5px;">AREA UTILIZADA</th>
        <th style="border:1px solid #ddd; padding:5px;">ESTIMATIVA ANUAL</th>
      </tr>
      ${produtosNaoOrganicosHTML}
    </table>
  </div>
`;
  
  // ============================================
  // PAGINA 5 - MANEJO, INSUMOS, PRAGAS, PLANTAS ESPONTANEAS
  // ============================================
  const pagina5HTML = `
    <div style="font-family: Arial, sans-serif; padding: 15px; width: 210mm; box-sizing: border-box;">
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">MANEJO DA MATERIA ORGANICA</h3>
      <p style="font-size:10px;"><strong>Como faz a compostagem?</strong> ${formatar(data.materiaOrganica?.comoFazCompostagem)}</p>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">INSUMOS PARA ADUBACAO</h3>
      <table style="width:100%; border-collapse:collapse; font-size:9px;">
        <tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:5px;">SUBSTANCIA</th><th style="border:1px solid #ddd; padding:5px;">MARCA</th><th style="border:1px solid #ddd; padding:5px;">CULTURA</th><th style="border:1px solid #ddd; padding:5px;">DOSE</th></tr>
        ${insumosAdubacaoHTML}
      </table>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">CONTROLE DE PRAGAS E DOENCAS</h3>
      <table style="width:100%; border-collapse:collapse; font-size:9px;">
        <tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:5px;">SUBSTANCIA</th><th style="border:1px solid #ddd; padding:5px;">MARCA</th><th style="border:1px solid #ddd; padding:5px;">CULTURA</th><th style="border:1px solid #ddd; padding:5px;">DOSE</th></td>
        ${insumosDefensivosHTML}
      </table>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">PLANTAS ESPONTANEAS</h3>
      <p style="font-size:10px;"><strong>Quais as plantas espontaneas?</strong> ${formatar(data.plantasEspontaneas?.quais)}</p>
      <p style="font-size:10px;"><strong>Estrategias de controle nas areas cultivadas:</strong> ${checkbox(data.plantasEspontaneas?.controleCapina, "Capina")} ${checkbox(data.plantasEspontaneas?.controlePalha, "Cobertura com palha")} ${checkbox(data.plantasEspontaneas?.controleRocadeira, "Rocadeira")}</p>
      <p style="font-size:10px;"><strong>Controle no entorno:</strong> ${formatar(data.plantasEspontaneas?.controleEntorno)}</p>
    </div>
  `;
  
  // ============================================
  // PAGINA 6 - SEMENTES, ESTRUTURAS, EQUIPAMENTOS
  // ============================================
  const pagina6HTML = `
    <div style="font-family: Arial, sans-serif; padding: 15px; width: 210mm; box-sizing: border-box;">
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">SEMENTES E MUDAS</h3>
      <p style="font-size:10px;">${checkbox(data.sementes?.usaSementesOrganicas, "Usa sementes e mudas organicas")} ${checkbox(data.sementes?.usaProprias, "Usa sementes e mudas proprias")}</p>
      <p style="font-size:10px;"><strong>Dificuldades:</strong> ${formatar(data.sementes?.dificuldades)}</p>
      
      <p style="font-size:10px;"><strong>Sementes Crioulas:</strong></p>
      <table style="width:100%; border-collapse:collapse; font-size:9px;">
        <tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:5px;">VARIEDADE</th><th style="border:1px solid #ddd; padding:5px;">QUANTIDADE</th></tr>
        ${sementesCrioulasHTML}
      </table>
      
      <p style="font-size:10px;"><strong>Origem das Sementes:</strong></p>
      <table style="width:100%; border-collapse:collapse; font-size:9px;">
        <tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:5px;">ESPECIE</th><th style="border:1px solid #ddd; padding:5px;">ORIGEM</th><th style="border:1px solid #ddd; padding:5px;">CONDICAO</th></tr>
        ${origemSementesHTML}
      </table>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">ESTRUTURAS FISICAS</h3>
      <table style="width:100%; border-collapse:collapse; font-size:9px;">
        <tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:5px;">ESTRUTURA</th><th style="border:1px solid #ddd; padding:5px;">TEMPO</th><th style="border:1px solid #ddd; padding:5px;">ESTADO</th><th style="border:1px solid #ddd; padding:5px;">OBS</th></tr>
        ${estruturasHTML}
      </table>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">EQUIPAMENTOS</h3>
      <table style="width:100%; border-collapse:collapse; font-size:9px;">
        <tr style="background:#f5f5f5;"><th style="border:1px solid #ddd; padding:5px;">EQUIPAMENTO</th><th style="border:1px solid #ddd; padding:5px;">TEMPO</th><th style="border:1px solid #ddd; padding:5px;">ESTADO</th><th style="border:1px solid #ddd; padding:5px;">OBS</th></tr>
        ${equipamentosHTML}
      </tr>
    </div>
  `;
  
  // ============================================
  // PAGINA 7 - COMERCIALIZACAO, ASSISTENCIA TECNICA, DECLARACAO
  // ============================================
  const pagina7HTML = `
    <div style="font-family: Arial, sans-serif; padding: 15px; width: 210mm; box-sizing: border-box;">
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">COMERCIALIZACAO</h3>
      <p style="font-size:10px;"><strong>Faz venda direta?</strong> ${checkbox(data.comercializacao?.vendaDiretaFeiras, "Feiras")} ${checkbox(data.comercializacao?.vendaEntregaDomicilio, "Entregas a domicilio")} ${checkbox(data.comercializacao?.vendaCestas, "Cestas")}</p>
      <p style="font-size:10px;"><strong>Venda para o governo:</strong> ${checkbox(data.comercializacao?.vendaGovernoPaa, "PAA")} ${checkbox(data.comercializacao?.vendaGovernoPnae, "PNAE")}</p>
      <p style="font-size:10px;"><strong>Rastreabilidade:</strong> ${formatar(data.comercializacao?.rastreabilidadeDesc)}</p>
      <p style="font-size:10px;"><strong>Mao de obra externa:</strong> ${data.comercializacao?.maoDeObraRegular ? `Sim (${data.comercializacao.maoDeObraQtdPessoas} pessoas, ${data.comercializacao.maoDeObraHorasSemana} h/semana)` : "Nao"}</p>
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px;">ACOMPANHAMENTO TECNICO</h3>
      <p style="font-size:10px;"><strong>Existe assistencia tecnica?</strong> ${data.assistenciaTecnica?.possuiAssistencia ? "Sim" : "Nao"}</p>
      ${data.assistenciaTecnica?.possuiAssistencia ? `
        <p style="font-size:10px;"><strong>Orgao/pessoa:</strong> ${formatar(data.assistenciaTecnica?.orgaoPessoa)}</p>
        <p style="font-size:10px;"><strong>Frequencia:</strong> ${formatar(data.assistenciaTecnica?.frequencia)}</p>
      ` : ''}
      
      <h3 style="background-color:#2e7d32; color:white; padding:5px; text-align:center;">DECLARACAO</h3>
      <div style="text-align:justify; font-size:9px; line-height:1.4;">
        <p>Declaro serem verdadeiras as informacoes deste Plano de Manejo Organico, comprometendo-me a comunicar imediatamente ao OPAC ECOCEARA por escrito, caso haja necessidade de uso de praticas essenciais nao previstas neste Plano de Manejo Organico, incluindo anexos. Declaro ter total conhecimento da Lei 10.831 e as demais normas de producao Organicas brasileiras e trabalharei de acordo com elas.</p>
        <p>Declaro ter pleno conhecimento das regras de funcionamento do SPG ECOCEARA bem como comprometo-me a fornecer todas as informacoes necessarias para a efetivacao do processo de Avaliacao da Conformidade participativa junto ao OPAC ECOCEARA.</p>
        <p>Concordo com a verificacao e o acesso integral pelos representantes do OPAC ECOCEARA aos locais da unidade de producao.</p>
        <p><strong>Todas as informacoes e as declaracoes feitas neste Plano de Manejo Organico sao de meu total conhecimento e conviccao.</strong></p>
      </div>
      
      <!-- ASSINATURAS - MESMO PADRÃO PARA AMBAS -->
      <div style="display:flex; justify-content:space-between; margin-top:40px;">
        <br>
        <div style="border-top:1px solid #000; padding-top:10px; width:45%; text-align:center;">
          
          Assinatura do Fornecedor<br><br>
        </div>
        <div style="border-top:1px solid #000; padding-top:10px; width:45%; text-align:center;">
       
          Assinatura do Coordenador do grupo<br><br><br>
        </div>
      </div>
      ${versao?.dataAprovacao ? `<p style="text-align:center; margin-top:15px;">Data da Aprovacao: ${new Date(versao.dataAprovacao).toLocaleDateString('pt-BR')}</p>` : ''}
    </div>
  `;
  
  // ============================================
  // RENDERIZAR
  // ============================================
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pages = [pagina1HTML, pagina2HTML, pagina3HTML, pagina4HTML, pagina5HTML, pagina6HTML, pagina7HTML];
  let primeiraPagina = true;
  
  for (let i = 0; i < pages.length; i++) {
    console.log(`Renderizando pagina ${i + 1}/${pages.length}...`);
    const container = document.createElement('div');
    container.style.width = '210mm';
    container.style.backgroundColor = '#ffffff';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.innerHTML = pages[i];
    document.body.appendChild(container);
    
    try {
      const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (!primeiraPagina) pdf.addPage();
      primeiraPagina = false;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } catch (error) {
      console.error(`Erro na pagina ${i + 1}:`, error);
    } finally {
      document.body.removeChild(container);
    }
  }
  
  pdf.save(`plano_manejo_organico_${plano?.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
  console.log(`PDF gerado com sucesso! Total de paginas: ${pages.length}`);
  return true;
}