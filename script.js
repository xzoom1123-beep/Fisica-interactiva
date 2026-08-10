const state=JSON.parse(localStorage.getItem("fisicaState")||'{"name":"","course":"","points":0,"completed":0,"badges":[],"quiz":null,"mru":false,"lab":false,"escape":0}');
const badgesDef=[
["move","🏃","Explorador del Movimiento"],["mru","⚡","Experto en MRU"],["force","💪","Maestro de las Fuerzas"],["physics","🏆","Maestro/a de la Física"]
];
function save(){localStorage.setItem("fisicaState",JSON.stringify(state));updateProgress()}
function go(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth"});closeMenu()}
function toggleMenu(){document.getElementById("nav").classList.toggle("open")}
function closeMenu(){document.getElementById("nav").classList.remove("open")}
function saveProfile(){
 state.name=document.getElementById("studentName").value.trim()||"Estudiante";
 state.course=document.getElementById("studentCourse").value.trim()||"9°";
 document.getElementById("profileMsg").textContent=`¡Perfil guardado, ${state.name}! Tu recorrido está listo.`;
 document.getElementById("profileMsg").style.color="#287c55"; save(); updateProfile();
}
function updateProfile(){
 document.getElementById("studentName").value=state.name; document.getElementById("studentCourse").value=state.course;
 document.getElementById("sumName").textContent=state.name||"Estudiante"; document.getElementById("sumCourse").textContent=state.course||"Grado 9°";
}
function unlock(key,pts=10){
 if(!state.badges.includes(key)){state.badges.push(key);state.points+=pts;state.completed++;save()}
}
function updateProgress(){
 const base=state.completed+ (state.quiz?1:0);
 const pct=Math.min(100,Math.round(base/5*100));
 document.getElementById("progressFill").style.width=pct+"%";document.getElementById("progressPct").textContent=pct+"%";
 document.getElementById("points").textContent=state.points;document.getElementById("completed").textContent=state.completed;
 document.getElementById("badges").textContent=state.badges.length;document.getElementById("quizScore").textContent=state.quiz===null?"—":state.quiz+"%";
 const list=document.getElementById("badgeList");list.innerHTML=badgesDef.map(b=>`<div class="badge-card ${state.badges.includes(b[0])?"unlocked":""}"><span>${b[1]}</span><b>${b[2]}</b><small>${state.badges.includes(b[0])?"Desbloqueada":"Bloqueada"}</small></div>`).join("");
}
function runMRU(){
 const v=Math.max(.1,Number(document.getElementById("mruV").value)||0),t=Math.max(.1,Number(document.getElementById("mruT").value)||0),d=v*t;
 document.getElementById("mruD").textContent=d.toFixed(2)+" m";document.getElementById("mruVR").textContent=v+" m/s";document.getElementById("mruTR").textContent=t+" s";
 const car=document.getElementById("car");car.style.transition="none";car.style.left="2%";setTimeout(()=>{car.style.transition=`left ${Math.min(4,Math.max(1,t/2))}s linear`;car.style.left="88%"},50);
 drawChart(v,t);state.mru=true;unlock("move",10);unlock("mru",15);save();
}
function drawChart(v,t){
 const c=document.getElementById("mruChart"),ctx=c.getContext("2d"),w=c.width,h=c.height,p=45;ctx.clearRect(0,0,w,h);
 ctx.strokeStyle="#d8dbea";ctx.lineWidth=1;for(let i=0;i<=5;i++){let x=p+i*(w-p-20)/5;ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,h-p);ctx.stroke();let y=h-p-i*(h-p-30)/5;ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(w-20,y);ctx.stroke()}
 ctx.strokeStyle="#6c5ce7";ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=50;i++){let x=p+i*(w-p-20)/50,y=h-p-(i/50)*(h-p-30);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
 ctx.fillStyle="#17213b";ctx.font="13px Arial";ctx.fillText("Posición (m)",p,18);ctx.fillText("Tiempo (s)",w-80,h-8);
 ctx.fillStyle="#6c5ce7";ctx.fillText("v = "+v+" m/s",w-120,28);
}
function checkMatch(){
 const vals=[match1.value,match2.value,match3.value];const msg=document.getElementById("matchMsg");
 if(vals.join(",")==="v,d,t"){msg.textContent="¡Correcto! Has relacionado los tres conceptos.";msg.style.color="#287c55";unlock("mru",5)}
 else{msg.textContent="Revisa las definiciones: velocidad, distancia y tiempo tienen funciones diferentes.";msg.style.color="#b24747"}
}
function answer(btn,ok){
 const msg=document.getElementById("mruChallengeMsg");document.querySelectorAll(".options button").forEach(b=>b.disabled=true);
 if(ok){msg.textContent="¡Correcto! d = v × t = 20 × 10 = 200 m.";msg.style.color="#287c55";unlock("mru",10)}
 else{msg.textContent="No es correcto. Usa d = v × t.";msg.style.color="#b24747"}
}
function demoNewton(n){
 const el=document.getElementById("ball"+n);el.animate([{transform:"translateX(-20px)"},{transform:"translateX(100px)"},{transform:"translateX(0)"}],{duration:900});
 if(n===2){el.textContent="🚀"} if(n===3){el.textContent="↔"} unlock("force",5);
}
function updateLab(){
 const m=Number(mass.value),f=Number(force.value),a=f/m;
 massOut.textContent=m+" kg";forceOut.textContent=f+" N";accel.textContent=a.toFixed(2)+" m/s²";
}
function applyForce(){
 updateLab();const crate=document.getElementById("crate");crate.style.left=Math.min(82,8+Number(force.value)*.72)+"%";
 document.getElementById("labText").textContent=`Con ${force.value} N sobre ${mass.value} kg, la aceleración es ${accel.textContent}. Observa cómo cambian las variables.`;
 state.lab=true;unlock("force",15);save();
}
function resetLab(){mass.value=5;force.value=25;updateLab();crate.style.left="8%";labText.textContent="Ajusta las variables y aplica una fuerza."}
const escapeQs=[
["RETO 1 • Primera Ley","Un libro permanece sobre una mesa porque…",["No hay una fuerza neta que cambie su estado.","Tiene aceleración infinita.","La tercera ley lo mantiene quieto."],0],
["RETO 2 • Segunda Ley","Si aplicas la misma fuerza a dos objetos, ¿cuál tendrá mayor aceleración?",["El de mayor masa.","El de menor masa.","Ambos siempre tendrán la misma."],1],
["RETO 3 • Tercera Ley","Cuando una persona empuja una pared, la pared…",["No ejerce ninguna fuerza.","Ejerce una fuerza de reacción sobre la persona.","Se mueve siempre en la dirección del empuje."],1]
];
let escapeIndex=state.escape||0;
function renderEscape(){
 const q=escapeQs[escapeIndex];document.getElementById("escapeStep").textContent=escapeIndex<3?`Reto ${escapeIndex+1} de 3`:"¡Completado!";
 document.getElementById("escapeBar").style.width=Math.min(100,escapeIndex/3*100)+"%";
 const box=document.getElementById("escapeContent");
 if(escapeIndex>=3){box.innerHTML='<div class="escape-question"><h2>🏆 ¡MISIÓN COMPLETADA!</h2><p>Has superado los tres retos y escapado del laboratorio.</p><div class="badge">💪 Maestro/a de las Fuerzas</div></div>';unlock("force",20);unlock("physics",20);return}
 box.innerHTML=`<div class="escape-question"><span class="badge">${q[0]}</span><h3>${q[1]}</h3><div class="escape-options">${q[2].map((x,i)=>`<button onclick="escapeAnswer(${i})">${String.fromCharCode(65+i)}. ${x}</button>`).join("")}</div><p id="escapeMsg" class="msg"></p></div>`;
}
function escapeAnswer(i){
 const q=escapeQs[escapeIndex],msg=document.getElementById("escapeMsg");
 if(i===q[3]){msg.textContent="✓ ¡Reto superado!";msg.style.color="#8ff0be";escapeIndex++;state.escape=escapeIndex;save();setTimeout(renderEscape,500)}
 else{msg.textContent="✗ Esa no es la respuesta. Analiza el concepto e inténtalo de nuevo.";msg.style.color="#ff9e9e"}
}
const questions=[
["En MRU, la velocidad…",["Cambia constantemente","Permanece constante","Siempre es cero","No puede medirse"],1],
["¿Cuál fórmula permite calcular distancia en MRU?",["d=v×t","v=d×t","t=d×v","d=v/t"],0],
["Un objeto viaja a 5 m/s durante 8 s. Su distancia es…",["13 m","40 m","3 m","80 m"],1],
["En una gráfica posición-tiempo de MRU, la línea es…",["Curva aleatoria","Recta con pendiente constante","Siempre horizontal","Una circunferencia"],1],
["La primera ley de Newton se relaciona principalmente con…",["La inercia","La masa molar","La temperatura","La densidad"],0],
["La segunda ley se expresa como…",["F=m×a","F=m/a","a=F×m","m=F×a"],0],
["Si la fuerza permanece constante y aumenta la masa, la aceleración…",["Aumenta","Disminuye","No cambia","Se vuelve infinita"],1],
["La unidad de fuerza en el SI es…",["Joule","Watt","Newton","Pascal"],2],
["La tercera ley de Newton describe…",["Acción y reacción","Solo objetos en reposo","La conservación de energía térmica","El MRU"],0],
["¿Qué hace una simulación interactiva?",["Solo decora el contenido","Permite modificar variables y observar resultados","Impide experimentar","Reemplaza todo razonamiento"],1]
];
function renderQuiz(){
 document.getElementById("quiz").innerHTML=questions.map((q,i)=>`<div class="question"><h3>${i+1}. ${q[0]}</h3>${q[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("");
}
function submitQuiz(){
 let score=0,answered=0;questions.forEach((q,i)=>{const a=document.querySelector(`input[name=q${i}]:checked`);if(a){answered++;if(Number(a.value)===q[2])score++}});
 if(answered<questions.length){document.getElementById("quizResult").innerHTML=`<div class="result"><b>Completa todas las preguntas.</b> Has respondido ${answered} de ${questions.length}.</div>`;return}
 const pct=Math.round(score/questions.length*100);state.quiz=pct;if(pct>=70)unlock("physics",20);save();
 const text=pct>=90?"¡Excelente dominio!":pct>=70?"¡Muy buen trabajo!":pct>=50?"Puedes seguir fortaleciendo tus conocimientos.":"Te recomendamos repasar los módulos.";
 document.getElementById("quizResult").innerHTML=`<div class="result"><h3>Resultado: ${pct}%</h3><p>${score} correctas de ${questions.length}. ${text}</p></div>`;
 go("quizResult");
}
function resetQuiz(){renderQuiz();document.getElementById("quizResult").innerHTML=""}
function clearData(){if(confirm("¿Borrar el progreso guardado en este navegador?")){localStorage.removeItem("fisicaState");location.reload()}}
updateProfile();updateLab();drawChart(10,5);renderEscape();renderQuiz();updateProgress();
