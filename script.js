const TOTAL_QUESTOES = 10;
const OPCOES = ['A', 'B', 'C', 'D', 'E'];

// Inicializa os campos na tela
document.addEventListener('DOMContentLoaded', () => {
  gerarCamposQuestores('gabarito-inputs', 'gabarito');
  gerarCamposQuestores('aluno-inputs', 'aluno');
});

function gerarCamposQuestores(containerId, prefixo) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  for (let i = 1; i <= TOTAL_QUESTOES; i++) {
    const div = document.createElement('div');
    div.className = 'questao-item';

    const label = document.createElement('label');
    label.innerText = `Q${i}`;

    const select = document.createElement('select');
    select.id = `${prefixo}-q${i}`;

    OPCOES.forEach(opcao => {
      const opt = document.createElement('option');
      opt.value = opcao;
      opt.innerText = opcao;
      select.appendChild(opt);
    });

    div.appendChild(label);
    div.appendChild(select);
    container.appendChild(div);
  }
}

function corrigirProvas() {
  let acertos = 0;
  let detalhamento = '<ul>';

  for (let i = 1; i <= TOTAL_QUESTOES; i++) {
    const gabaritoOficial = document.getElementById(`gabarito-q${i}`).value;
    const respostaAluno = document.getElementById(`aluno-q${i}`).value;

    if (gabaritoOficial === respostaAluno) {
      acertos++;
      detalhamento += `<li>Questão ${i}: <span class="acerto">Correta (${respostaAluno})</span></li>`;
    } else {
      detalhamento += `<li>Questão ${i}: <span class="erro">Incorreta (Aluno: ${respostaAluno} | Gabarito: ${gabaritoOficial})</span></li>`;
    }
  }

  detalhamento += '</ul>';

  const notaFinal = (acertos / TOTAL_QUESTOES) * 10;
  
  const resultadoCard = document.getElementById('resultado-card');
  const resultadoConteudo = document.getElementById('resultado-conteudo');

  resultadoConteudo.innerHTML = `
    <h3>Pontuação: ${acertos} / ${TOTAL_QUESTOES} (${notaFinal.toFixed(1)} / 10.0)</h3>
    <br>
    ${detalhamento}
  `;

  resultadoCard.classList.remove('hidden');
}
