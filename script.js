
const $ = id => document.getElementById(id);


const nameInput = $('name');
const startBtn = $('start');
const story = $('story');
const user = $('user');
const storyText = $('storyText');
const yesBtn = $('yes');
const noBtn = $('no');
const taskPanel = $('taskPanel');
const taskSelect = $('task');
const form = $('form');
const output = $('output');

let userName = '';


const tasks = {
  1: {
    title: 'Ordenar Chamada',
    repeat: 'item',
    prompt: 'Digite o',
    type: 'text',
    handler: data => data.items.map(s => s.toUpperCase()).sort().map(x => `→ ${x}`).join('\n')
  },
  2: {
    title: 'Ordenar Números',
    repeat: 'num',
    prompt: 'Digite o',
    type: 'number',
    handler: data => data.items.map(Number).sort((a, b) => a - b).join(', ')
  },
  3: {
    title: 'Calculadora',
    fields: [
      { id: 'n1', label: 'Primeiro número', type: 'number' },
      { id: 'n2', label: 'Segundo número', type: 'number' }
    ],
    handler: data => {
      const a = Number(data.n1);
      const b = Number(data.n2);
      return [
        `${a} + ${b} = ${a + b}`,
        `${a} - ${b} = ${a - b}`,
        `${a} × ${b} = ${a * b}`,
        `${a} ÷ ${b} = ${b ? (a / b).toFixed(4) : 'Indefinido'}`
      ].join('\n');
    }
  },

};

// Funções utilitárias
function clear(element) {
  element.innerHTML = '';
}

function getInputValue(id) {
  return $(id).value.trim();
}

function createElementWithText(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

function showResult(text) {

  output.innerHTML = `<div class="output fade">${text.replace(/\n/g, '<br>')}</div>`;
  const fadeEl = output.querySelector('.fade');
  fadeEl.style.opacity = 0;
  setTimeout(() => fadeEl.style.opacity = 1, 50);
}


function renderTask(id) {
  clear(form);
  clear(output);
  const task = tasks[id];
  if (!task) return;

  
  if (task.repeat) {
    const container = document.createElement('div');
    container.className = 'field';
    container.appendChild(createElementWithText('label', 'Quantos itens deseja adicionar?'));

    const countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.min = 1;
    countInput.id = 'count';
    container.appendChild(countInput);
    form.appendChild(container);

    const fieldsBox = document.createElement('div');
    form.appendChild(fieldsBox);

    countInput.addEventListener('input', () => {
      fieldsBox.innerHTML = '';
      const count = Number(countInput.value) || 0;
      for (let i = 1; i <= count; i++) {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'field';
        fieldDiv.appendChild(createElementWithText('label', `${task.prompt} ${i}º ${task.repeat}:`));

        const input = document.createElement('input');
        input.type = task.type;
        input.id = `${task.repeat}-${i}`;
        fieldDiv.appendChild(input);
        fieldsBox.appendChild(fieldDiv);
      }
    });
  }

  
  if (task.fields) {
    task.fields.forEach(f => {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'field';
      fieldDiv.appendChild(createElementWithText('label', f.label));

      const input = document.createElement('input');
      input.type = f.type;
      input.id = f.id;
      fieldDiv.appendChild(input);
      form.appendChild(fieldDiv);
    });
  }

 
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Executar';
  btn.className = 'execute-btn';
  btn.addEventListener('click', () => {
    try {
      const data = {};
      if (task.fields) task.fields.forEach(f => data[f.id] = getInputValue(f.id));

      if (task.repeat) {
        const count = Number($('count').value) || 0;
        data.items = [];
        for (let i = 1; i <= count; i++) {
          data.items.push(getInputValue(`${task.repeat}-${i}`));
        }
      }

      showResult(task.handler(data));
    } catch (err) {
      showResult(err.message || err);
    }
  });

  form.appendChild(btn);
}


startBtn.addEventListener('click', () => {
  if (!nameInput.value.trim()) return alert('Por favor, digite seu nome.');
  user.textContent = nameInput.value.trim();
  userName = nameInput.value.trim();
  story.classList.remove('hidden');
  taskPanel.classList.remove('hidden');
});


yesBtn.addEventListener('click', () => {
  storyText.textContent = 'Nas férias de 2025 comecei este projeto para praticar minhas habilidades de lógica de programação.';
});

noBtn.addEventListener('click', () => {
  storyText.textContent = 'Tudo bem! Escolha uma função abaixo para começar.';
});


Object.entries(tasks).forEach(([key, value]) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = `${key} - ${value.title}`;
  taskSelect.appendChild(option);
});


taskSelect.addEventListener('change', e => renderTask(e.target.value));


const style = document.createElement('style');
style.innerHTML = `
  .fade { transition: opacity 0.5s ease-in-out; }
  .execute-btn { margin-top: 10px; cursor: pointer; padding: 5px 10px; }
  .field { margin-bottom: 8px; }
`;
document.head.appendChild(style);
