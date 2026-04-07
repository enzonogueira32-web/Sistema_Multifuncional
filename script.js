const t=document.getElementById.bind(document);
const nameInput=t('name');
const start=t('start');
const story=t('story');
const user=t('user');
const storyText=t('storyText');
const yes=t('yes');
const no=t('no');
const taskPanel=t('taskPanel');
const taskSelect=t('task');
const form=t('form');
const output=t('output');
let userName='';
const tasks={
  1:{title:'Ordenar Chamada',repeat:'item',prompt:'Digite o',type:'text',handler:(d)=>d.items.map(s=>s.toUpperCase()).sort().map(x=>`→ ${x}`).join('\n')},
  2:{title:'Ordenar Números',repeat:'num',prompt:'Digite o',type:'number',handler:(d)=>d.items.map(Number).sort((a,b)=>a-b).join(', ')},
  3:{title:'Calculadora',fields:[{id:'n1',label:'Primeiro número',type:'number'},{id:'n2',label:'Segundo número',type:'number'}],handler:(d)=>{const a=Number(d.n1),b=Number(d.n2);return [`${a}+${b}=${a+b}`,`${a}-${b}=${a-b}`,`${a}×${b}=${a*b}`,`${a}÷${b}=${b? (a/b).toFixed(4):'Indefinido'}`].join('\n')}},
  4:{title:'Tabela de preços',repeat:'product',prompt:'Digite o',type:'text',fields:[{id:'code',label:'Código',type:'number'},{id:'price',label:'Preço',type:'number'},{id:'install',label:'Parcelas',type:'number'},{id:'card',label:'Juros cartão',type:'number'},{id:'fee',label:'Juros %',type:'number'}],handler:(d)=>{const i=Number(d.code),p=Number(d.price),n=Number(d.install),c=Number(d.card)/100,f=Number(d.fee)/100;if(!Number.isInteger(i)||i<0||i>=d.items.length)throw'Código inválido';const tot=p+p*(c+f);return[`Produto:${d.items[i]}`,`À vista:R$${p.toFixed(2)}`,`Parcelado:R$${tot.toFixed(2)}`,`Parcela:R$${(tot/n).toFixed(2)}`].join('\n')}},
  5:{title:'Par e Ímpar',repeat:'num',prompt:'Digite o',type:'number',handler:(d)=>{const n=d.items.map(Number);return[`Pares:${n.filter(x=>x%2===0).join(', ')||'Nenhum'}`,`Ímpares:${n.filter(x=>x%2!==0).join(', ')||'Nenhum'}`].join('\n')}},
  6:{title:'Raiz Quadrada',fields:[{id:'x',label:'Número',type:'number'}],handler:(d)=>{const v=Number(d.x);return`Raiz quadrada de ${v}=${Math.sqrt(v).toFixed(4)}`}},
  7:{title:'Sorteio',repeat:'item',prompt:'Digite o',type:'text',handler:(d)=>`Vencedor:${d.items[Math.floor(Math.random()*d.items.length)]}`},
  8:{title:'Raiz Cúbica',fields:[{id:'x',label:'Número',type:'number'}],handler:(d)=>`Raiz cúbica de ${d.x}=${Math.cbrt(Number(d.x)).toFixed(4)}`},
  9:{title:'Média Escolar',fields:[{id:'name',label:'Nome do aluno',type:'text'},{id:'g1',label:'1º bimestre',type:'number'},{id:'g2',label:'2º bimestre',type:'number'},{id:'g3',label:'3º bimestre',type:'number'},{id:'g4',label:'4º bimestre',type:'number'}],handler:(d)=>{const g=[Number(d.g1),Number(d.g2),Number(d.g3),Number(d.g4)];const avg=g.reduce((s,v)=>s+v,0)/4;return`Aluno:${d.name}\nMédia:${avg.toFixed(2)}\n${avg>=6?'Aprovado':'Reprovado'}${avg<6?`\nFaltaram ${(6-avg).toFixed(2)} pontos.`:''}`}},
  10:{title:'Contar até um número',fields:[{id:'n',label:'Número',type:'number'}],handler:(d)=>[...Array(Number(d.n))].map((_,i)=>Number(d.n)-i).join(', ')},
  11:{title:'Tabuada',fields:[{id:'op',label:'Operação',type:'text'},{id:'n',label:'Número',type:'number'}],handler:(d)=>{const n=Number(d.n);return [...Array(10)].map((_,i)=>{const x=i+1;return d.op==='+'?`${n}+${x}=${n+x}`:d.op==='-'?`${n}-${x}=${n-x}`:['x','×','*','X'].includes(d.op)?`${n}×${x}=${n*x}`:d.op==='÷'?`${n}÷${x}=${n/x} resto ${n%x}`:'Operação inválida'}).join('\n')}},
  12:{title:'Inverter Palavra',fields:[{id:'w',label:'Palavra',type:'text'}],handler:(d)=>`Palavra:${d.w}\nInvertida:${d.w.split('').reverse().join('')}`},
  13:{title:'Minigame',fields:[{id:'d',label:'Dificuldade 1/2/3',type:'number'},{id:'g',label:'Palpite',type:'number'}],handler:(d)=>{const m=d.d==='1'?10:d.d==='2'?20:50;const s=Math.floor(Math.random()*m)+1;return d.g==s?`Ganhou! número ${s}`:`Errou! era ${s}`}},
  14:{title:'Contar Vogais',fields:[{id:'w',label:'Palavra',type:'text'}],handler:(d)=>`Vogais:${[...d.w].filter(c=>'aeiouAEIOU'.includes(c)).length}`}
};

const clear=e=>(e.innerHTML='');
const inp=(id)=>t(id).value.trim();
const el=(tag)=>document.createElement(tag);
const fill=(tag,txt)=>{const e=el(tag);e.textContent=txt;return e};
const show=(text)=>{output.innerHTML=`<div class="output">${text.replace(/\n/g,'<br>')}</div>`};
const render=(id)=>{
  clear(form);clear(output);
  const task=tasks[id];
  if(!task)return;
  if(task.repeat){
    const c=el('div');c.className='field';
    c.appendChild(fill('label',`Quantos itens?`));
    const n=el('input');n.type='number';n.min=1;n.id='count';c.appendChild(n);
    form.appendChild(c);
    const box=el('div');form.appendChild(box);
    n.addEventListener('input',()=>{
      box.innerHTML='';
      const v=Number(n.value)||0;
      for(let i=1;i<=v;i++){
        const f=el('div');f.className='field';
        f.appendChild(fill('label',`${task.prompt} ${i}º ${task.repeat}:`));
        const iin=el('input');iin.type=task.type;iin.id=`${task.repeat}-${i}`;f.appendChild(iin);box.appendChild(f);
      }
    });
  }
  task.fields?.forEach(f=>{
    const d=el('div');d.className='field';
    d.appendChild(fill('label',f.label));
    const i=el('input');i.type=f.type;i.id=f.id;d.appendChild(i);form.appendChild(d);
  });
  const btn=el('button');btn.textContent='Executar';btn.type='button';
  btn.addEventListener('click',()=>{
    try{
      const data={};
      task.fields?.forEach(f=>data[f.id]=inp(f.id));
      if(task.repeat){
        const c=Number(t('count').value)||0;data.items=[];
        for(let i=1;i<=c;i++)data.items.push(inp(`${task.repeat}-${i}`));
      }
      show(task.handler(data));
    }catch(e){show(e.message||e)}
  });
  form.appendChild(btn);
};

start.addEventListener('click',()=>{
  if(!nameInput.value.trim())return alert('Digite seu nome.');
  user.textContent=nameInput.value.trim();userName=nameInput.value.trim();story.classList.remove('hidden');taskPanel.classList.remove('hidden');
});
yes.addEventListener('click',()=>{storyText.textContent='Nas férias de 2025 comecei este projeto para praticar minhas habilidades de lógica de programação.'});
no.addEventListener('click',()=>{storyText.textContent='Tudo bem! Escolha uma função abaixo.'});
Object.entries(tasks).forEach(([k,v])=>{const o=el('option');o.value=k;o.textContent=`${k} - ${v.title}`;taskSelect.appendChild(o)});
taskSelect.addEventListener('change',e=>render(e.target.value));
