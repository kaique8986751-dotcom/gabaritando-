const OPCOES = ['A', 'B', 'C', 'D', 'E'];
let streamCamera = null;
let nomesDisciplinas = {};

// =========================================================================
// CADASTRE O GABARITO OFICIAL PADRÃO AQUI
// Informe o número da questão e a letra correta ('A', 'B', 'C', 'D' ou 'E')
// =========================================================================
const GABARITO_PADRAO = {
  1: 'A', 2: 'C', 3: 'B', 4: 'D', 5: 'E', // Português (1 a 5)
  6: 'B', 7: 'A', 8: 'D', 9: 'C', 10: 'E', // Inglês (6 a 10)
  11: 'C', 12: 'D', 13: 'A', 14: 'E', 15: 'B', // Matemática (11 a 15)
  16: 'E', 17: 'B', 18: 'C', 19: 'A', 20: 'D'  // História (16 a 20)
};

document.addEventListener('DOMContentLoaded', () => {
  gerarEstruturaDisciplinas();
  configurarUpload();
});

// Configuração da Imagem / Câmera
function configurarUpload() {
  const fileInput = document.getElementById('upload-file');
  const imgPreview = document.getElementById('image-preview');
  const previewContainer = document.getElementById('preview-container');

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        imgPreview.src = ev.target.result;
        previewContainer.classList.remove('hidden');
        fecharCamera();
      };
      reader.readAsDataURL(file);
    }
  });
}

async function abrirCamera() {
  const cameraContainer = document.getElementById('camera-container');
  const video = document.getElementById('video');
  cameraContainer.classList.remove('hidden');

  try {
    streamCamera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = streamCamera;
  } catch (err) {
    alert("Não foi possível acessar a câmera: " + err.message);
  }
}

function tirarFoto() {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  const imgPreview = document.getElementById('image-preview');
  imgPreview.src = canvas.toDataURL('image/png');
  document.getElementById('preview-container').classList.remove('hidden');

  fecharCamera();
}

function fecharCamera() {
  if (streamCamera) {
    streamCamera.getTracks().forEach(track => track.stop());
  }
  document.getElementById('camera-container').classList.add('hidden');
}

// Geração dos blocos de 5 em 5 até o total informado
function gerarEstruturaDisciplinas() {
  let totalQuestoes = parseInt(document.getElementById('total-questoes').value) || 10;
  
  if (totalQuestoes > 60) {
    totalQuestoes = 60;
    document.getElementById('total-questoes').value = 60;
  }

  const containerGabarito = document.getElementById('disciplinas-gabarito');
  const containerAluno = document.getElementById('disciplinas-aluno');
  
  containerGabarito.innerHTML = '';
  containerAluno.innerHTML = '';

  const totalBlocos = Math.ceil(totalQuestoes / 5);

  const nomesPadrao = ["Português", "Inglês", "Matemática", "História", "Geografia", "Biologia", "Física", "Química", "Filosofia", "Sociologia", "Conhecimentos Gerais", "Atualidades"];

  for (let bloco = 0; bloco < totalBlocos; bloco++) {
    const qInicio = bloco * 5 + 1;
    const qFim = Math.min((bloco + 1) * 5, totalQuestoes);
    const chave = `bloco_${bloco}`;

    if (!nomesDisciplinas[chave]) {
      nomesDisciplinas[chave] = nomesPadrao[bloco] || `Disciplina ${bloco + 1}`;
    }

    // Bloco do Gabarito Oficial
    const boxGabarito = document.createElement('div');
    boxGabarito.className = 'disciplina-box';
    boxGabarito.innerHTML = `
      <div class="disciplina-header">
        <span>Questões ${qInicio} a ${qFim}:</span>
        <input type="text" value="${nomesDisciplinas[chave]}" onchange="atualizarNomeMateria('${chave}', this.value)">
      </div>
      <div class="grid-questoes" id="gabarito-grid-${bloco}"></div>
    `;
    containerGabarito.appendChild(boxGabarito);

    // Bloco das Respostas do Aluno
    const boxAluno = document.createElement('div');
    boxAluno.className = 'disciplina-box';
    boxAluno.innerHTML = `
      <h3 id="titulo-aluno-${chave}">${nomesDisciplinas[chave]} (Questões ${qInicio} a ${qFim})</h3>
      <div class="grid-questoes" id="aluno-grid-${bloco}"></div>
    `;
    containerAluno.appendChild(boxAluno);

    // Preenche as opções
    const gridGabarito = document.getElementById(`gabarito-grid-${bloco}`);
    const gridAluno = document.getElementById(`aluno-grid-${bloco}`);

    for (let q = qInicio; q <= qFim; q++) {
      gridGabarito.appendChild(criarSelect(`gab-q${q}`, q));
      gridAluno.appendChild(criarSelect(`alu-q${q}`, q));
    }
  }
}

function atualizarNomeMateria(chave, novoNome) {
  nomesDisciplinas[chave] = novoNome || "Disciplina";
  const elementoTitulo = document.getElementById(`titulo-aluno-${chave}`);
  if (elementoTitulo) {
    const textoAtual = elementoTitulo.innerText;
    const intervaloText = textoAtual.substring(textoAtual.indexOf('('));
    elementoTitulo.innerText = `${nomesDisciplinas[chave]} ${intervaloText}`;
  }
}

// Cria o campo de seleção aplicando o gabarito oficial cadastrado
function criarSelect(id, num) {
  const div = document.createElement('div');
  div.className = 'questao-item';

  const label = document.createElement('label');
  label.innerText = `Q${num}`;

  const select = document.createElement('select');
  select.id = id;

  OPCOES.forEach(op => {
    const option = document.createElement('option');
    option.value = op;
    option.innerText = op;

    // Aplica a resposta correta se for o campo de gabarito oficial
    if (id.startsWith('gab-') && GABARITO_PADRAO[num] === op) {
      option.selected = true;
    }

    select.appendChild(option);
  });

  div.appendChild(label);
  div.appendChild(select);
  return div;
}

// Lógica de Correção Individualizada
function corrigirGabarito() {
  const totalQuestoes = parseInt(document.getElementById('total-questoes').value) || 10;
  const totalBlocos = Math.ceil(totalQuestoes / 5);

  let acertosTotaisGeral = 0;
  let htmlResultado = '';

  for (let bloco = 0; bloco < totalBlocos; bloco++) {
    const qInicio = bloco * 5 + 1;
    const qFim = Math.min((bloco + 1) * 5, totalQuestoes);
    const chave = `bloco_${bloco}`;
    const nomeMateria = nomesDisciplinas[chave];
    const totalQuestoesBloco = (qFim - qInicio) + 1;

    let acertosMateria = 0;
    let detalhesBloco = '<ul>';

    for (let q = qInicio; q <= qFim; q++) {
      const gabarito = document.getElementById(`gab-q${q}`).value;
      const resposta = document.getElementById(`alu-q${q}`).value;

      if (gabarito === resposta) {
        acertosMateria += 1; // 1 ponto por questão
        detalhesBloco += `<li>Questão ${q}: <span class="acerto">Acertou (${resposta})</span></li>`;
      } else {
        detalhesBloco += `<li>Questão ${q}: <span class="erro">Errou (Aluno: ${resposta} | Gabarito: ${gabarito})</span></li>`;
      }
    }

    detalhesBloco += '</ul>';
    acertosTotaisGeral += acertosMateria;

    htmlResultado += `
      <div class="res-disciplina">
        <h3>${nomeMateria} (Q${qInicio} a Q${qFim}): ${acertosMateria} / ${totalQuestoesBloco} Ponto(s)</h3>
        ${detalhesBloco}
      </div>
    `;
  }

  htmlResultado = `
    <h2>Pontuação Total: ${acertosTotaisGeral} / ${totalQuestoes} Pontos</h2>
    <hr style="margin: 15px 0;">
    ${htmlResultado}
  `;

  const resultadoCard = document.getElementById('resultado-card');
  document.getElementById('resultado-conteudo').innerHTML = htmlResultado;
  resultadoCard.classList.remove('hidden');
  resultadoCard.scrollIntoView({ behavior: 'smooth' });
}
