import './style.css';

const app = document.querySelector('#app');
const missions = {
  lunar: ['Moon Mapper', 'Map lunar terrain and investigate surface composition.', ['Camera', 'Spectrometer']],
  earth: ['Earth Watch', 'Monitor land, oceans, and atmospheric conditions.', ['Camera', 'Thermal Mapper']],
  mars: ['Red Planet Scout', 'Study the Martian surface and search for clues about its past.', ['Camera', 'Spectrometer', 'Radar Sounder']],
  solar: ['Solar Sentinel', 'Observe energetic particles and magnetic activity.', ['Particle Detector', 'Magnetometer']]
};
const instruments = {
  Camera:{mass:28,power:24,cost:45,data:35,science:28},
  Spectrometer:{mass:42,power:38,cost:70,data:48,science:42},
  Radar:{mass:58,power:52,cost:95,data:26,science:48},
  'Thermal Mapper':{mass:32,power:30,cost:55,data:28,science:32},
  'Particle Detector':{mass:24,power:20,cost:48,data:18,science:30},
  Magnetometer:{mass:18,power:12,cost:35,data:12,science:22}
};
const options = {
  launcher:{small:['Asteria Small Lift',350,90],medium:['Horizon Medium Lift',1400,170],heavy:['Titan Heavy Lift',5200,290]},
  orbit:{leo:['Low Earth Orbit',35,60],geo:['Geostationary Orbit',55,72],lunar:['Lunar Transfer & Orbit',105,100],mars:['Mars Transfer',190,125]},
  bus:{compact:['Compact Bus',140,85,85,45],standard:['Explorer Bus',260,145,150,75],advanced:['Deep Space Bus',420,230,235,115]},
  power:{solar:['Solar Arrays',55,65,110],nuclear:['Radioisotope Power',75,125,145],hybrid:['Solar + Battery Hybrid',85,95,155]},
  comms:{basic:['Low-Gain Antenna',12,20,35],high:['High-Gain Antenna',35,65,105],relay:['Relay Network',60,105,165]}
};
let s={page:'home',step:0,name:'Luna Pathfinder',mission:'lunar',difficulty:'standard',launcher:'medium',orbit:'lunar',bus:'standard',power:'solar',comms:'high',payload:['Camera','Spectrometer'],upgrades:[],result:null};
const budget=()=>({beginner:1100,standard:850,expert:680}[s.difficulty]);
function totals(){
 const b=options.bus[s.bus],p=options.power[s.power],c=options.comms[s.comms],v=options.launcher[s.launcher],o=options.orbit[s.orbit];
 const ins=s.payload.map(x=>instruments[x]||instruments.Camera);
 const extra=s.upgrades.reduce((a,x)=>{let q={shield:[20,35,0],computer:[12,30,14],propulsion:[35,55,8]}[x];return {mass:a.mass+q[0],cost:a.cost+q[1],power:a.power+q[2]}},{mass:0,cost:0,power:0});
 return {mass:b[1]+p[1]+c[1]+ins.reduce((a,x)=>a+x.mass,0)+extra.mass,
 cost:v[2]+o[1]+b[2]+p[2]+c[2]+ins.reduce((a,x)=>a+x.cost,0)+extra.cost+65,
 need:32+o[1]*.12+ins.reduce((a,x)=>a+x.power,0)+extra.power,
 have:b[3]+p[2]*0+p[3],data:ins.reduce((a,x)=>a+x.data,0),science:ins.reduce((a,x)=>a+x.science,0),
 commNeed:ins.reduce((a,x)=>a+x.data,0)*1.35,commHave:c[3]+b[4],capacity:v[1]};
}
function checks(){
 const t=totals();return [
  [t.cost<=budget(),`Budget: $${t.cost}M / $${budget()}M`],
  [t.mass<=t.capacity,`Mass: ${t.mass} kg / ${t.capacity} kg launcher capacity`],
  [t.need<=t.have,`Power: ${t.need.toFixed(0)} W needed / ${t.have} W available`],
  [t.commNeed<=t.commHave,`Data link: ${t.commNeed.toFixed(0)} / ${t.commHave} capacity`],
  [s.payload.length>0,'At least one science instrument selected']
 ];
}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function home(){app.innerHTML=`<div class="home"><nav><b>✦ ORBITAL<span>LAB</span></b><small>SPACE MISSION DESIGN SIMULATOR</small></nav><section class="hero"><div><label>YOUR MISSION STARTS HERE</label><h1>DESIGN A MISSION.<br><em>CHANGE WHAT WE KNOW.</em></h1><p>You are the mission director. Choose a scientific goal, engineer a spacecraft, balance limited resources, and put your design to the test.</p><button id="start">START DESIGNING ↗</button><div class="stats"><span><b>04</b> MISSION TYPES</span><span><b>06</b> SCIENCE INSTRUMENTS</span><span><b>∞</b> POSSIBLE DESIGNS</span></div></div><div class="planet-art"><div class="planet"></div><div class="sat">✦</div><small>EARTH / LUNAR SYSTEM</small></div></section><section class="steps"><div>01 <b>DEFINE</b><p>Choose what your mission will discover.</p></div><div>02 <b>ENGINEER</b><p>Build a spacecraft within constraints.</p></div><div>03 <b>SIMULATE</b><p>Launch your design and face events.</p></div><div>04 <b>LEARN</b><p>Review results and improve your design.</p></div></section></div>`;document.querySelector('#start').onclick=()=>{s.page='builder';render();};}
function card(group,key,title,desc,stats,selected){return `<button class="card ${selected?'selected':''}" data-group="${group}" data-key="${key}"><b>${title}</b><p>${desc}</p><small>${stats}</small></button>`;}
function builder(){
 const t=totals(),steps=['MISSION','LAUNCH & ORBIT','SPACECRAFT','SCIENCE PAYLOAD','REVIEW'];
 let body='';
 if(s.step===0) body=`<h1>What are we trying to discover?</h1><p class="intro">Every engineering decision starts with a scientific question.</p><div class="cards">${Object.entries(missions).map(([k,m])=>card('mission',k,m[0],m[1],'MISSION CONCEPT',s.mission===k)).join('')}</div><label class="field">MISSION NAME <input id="mission-name" value="${esc(s.name)}" maxlength="28"></label><label class="field">DIFFICULTY <select id="difficulty"><option value="beginner">Beginner</option><option value="standard">Standard</option><option value="expert">Expert</option></select></label>`;
 if(s.step===1) body=`<h1>Choose your ride and destination.</h1><p class="intro">Your launcher must carry the spacecraft. Your orbit shapes the science you can do.</p><h3>LAUNCH VEHICLE</h3><div class="cards">${Object.entries(options.launcher).map(([k,v])=>card('launcher',k,v[0],'Payload capacity and development cost.',`${v[1]} kg · $${v[2]}M`,s.launcher===k)).join('')}</div><h3>ORBIT / TRAJECTORY</h3><div class="cards">${Object.entries(options.orbit).map(([k,v])=>card('orbit',k,v[0],'Different destinations create different mission demands.',`Science potential ${v[2]} · $${v[1]}M`,s.orbit===k)).join('')}</div>`;
 if(s.step===2) body=`<h1>Build your spacecraft platform.</h1><p class="intro">Choose the bus, power system, and communications package.</p><h3>SPACECRAFT BUS</h3><div class="cards">${Object.entries(options.bus).map(([k,v])=>card('bus',k,v[0],'The platform that supports your payload.',`${v[1]} kg · $${v[2]}M · ${v[3]} W`,s.bus===k)).join('')}</div><h3>POWER SYSTEM</h3><div class="cards">${Object.entries(options.power).map(([k,v])=>card('power',k,v[0],'Supplies electrical power to spacecraft systems.',`${v[1]} kg · ${v[3]} W · $${v[2]}M`,s.power===k)).join('')}</div><h3>COMMUNICATIONS</h3><div class="cards">${Object.entries(options.comms).map(([k,v])=>card('comms',k,v[0],'Returns mission data to Earth.',`${v[1]} kg · capacity ${v[3]} · $${v[2]}M`,s.comms===k)).join('')}</div>`;
 if(s.step===3) body=`<h1>Choose your science instruments.</h1><p class="intro">More instruments add science value, but also increase mass, power, data, and cost.</p><div class="cards">${Object.entries(instruments).map(([k,v])=>card('payload',k,k,'Collects scientific measurements.',`${v.mass} kg · ${v.power} W · $${v.cost}M`,s.payload.includes(k))).join('')}</div><h3>OPTIONAL UPGRADES</h3><div class="cards">${[['shield','Radiation shielding'],['computer','Enhanced computer'],['propulsion','Extended propulsion']].map(([k,n])=>card('upgrade',k,n,'Optional engineering enhancement.', 'Adds mass and cost',s.upgrades.includes(k))).join('')}</div>`;
 if(s.step===4) body=`<h1>Review your mission design.</h1><p class="intro">${esc(s.name)} · ${missions[s.mission][0]}</p><div class="review"><div class="panel"><h3>MISSION CONFIGURATION</h3><p>Objective: <b>${missions[s.mission][0]}</b></p><p>Launcher: <b>${options.launcher[s.launcher][0]}</b></p><p>Orbit: <b>${options.orbit[s.orbit][0]}</b></p><p>Spacecraft: <b>${options.bus[s.bus][0]}</b></p><p>Power: <b>${options.power[s.power][0]}</b></p><p>Communications: <b>${options.comms[s.comms][0]}</b></p><p>Instruments: <b>${s.payload.join(', ')||'None selected'}</b></p></div><div class="panel"><h3>LIVE RESOURCE TELEMETRY</h3><p>Estimated cost <b>$${t.cost}M / $${budget()}M</b></p><p>Spacecraft mass <b>${t.mass} / ${t.capacity} kg</b></p><p>Power <b>${t.need.toFixed(0)} / ${t.have} W</b></p><p>Data link <b>${t.commNeed.toFixed(0)} / ${t.commHave}</b></p><hr>${checks().map(x=>`<p class="${x[0]?'good':'bad'}">${x[0]?'✓':'×'} ${x[1]}</p>`).join('')}</div></div>`;
 app.innerHTML=`<div class="game"><header><b>✦ ORBITAL<span>LAB</span></b><small>MISSION DESIGN WORKSPACE</small><button id="reset" class="outline">RESET</button></header><div class="layout"><aside><label>MISSION WORKFLOW</label>${steps.map((x,i)=>`<button class="${s.step===i?'current':''}" data-step="${i}">${String(i+1).padStart(2,'0')} &nbsp; ${x}</button>`).join('')}<p class="tip">ENGINEERING IS A TEAM SPORT.<br><br>Every choice affects the whole mission. Think in systems, not parts.</p></aside><main><div class="content">${body}</div><footer><button class="outline" id="back" ${s.step===0?'disabled':''}>← BACK</button><span>STEP ${s.step+1} / 5</span><button id="next">${s.step===4?'RUN SIMULATION':'CONTINUE →'}</button></footer></main><aside class="telemetry"><label>MISSION TELEMETRY · LIVE</label><h2>${missions[s.mission][0]}</h2><p>TARGET: ${s.mission.toUpperCase()}</p><hr><label>EST. TOTAL COST</label><h2>$${t.cost}M</h2><label>SPACECRAFT MASS</label><h2>${t.mass} KG</h2><label>POWER BALANCE</label><h2>${t.need.toFixed(0)} / ${t.have} W</h2><label>DATA / COMMS</label><h2>${t.commNeed.toFixed(0)} / ${t.commHave}</h2></aside></div></div>`;
 document.querySelectorAll('[data-group]').forEach(el=>el.onclick=()=>{let {group,key}=el.dataset;if(group==='payload')s.payload=s.payload.includes(key)?s.payload.filter(x=>x!==key):[...s.payload,key];else if(group==='upgrade')s.upgrades=s.upgrades.includes(key)?s.upgrades.filter(x=>x!==key):[...s.upgrades,key];else s[group]=key;render();});
 document.querySelectorAll('[data-step]').forEach(el=>el.onclick=()=>{s.step=+el.dataset.step;render();});
 document.querySelector('#mission-name')?.addEventListener('input',e=>s.name=e.target.value);
 document.querySelector('#difficulty')?.addEventListener('change',e=>{s.difficulty=e.target.value;render();});
 document.querySelector('#back').onclick=()=>{s.step=Math.max(0,s.step-1);render();};
 document.querySelector('#next').onclick=()=>{if(s.step<4){s.step++;render();}else if(checks().every(x=>x[0])){simulate();}else alert('Your design has failed one or more resource checks. Adjust the design before launch.');};
 document.querySelector('#reset').onclick=()=>{s={...s,page:'builder',step:0,name:'Luna Pathfinder',mission:'lunar',difficulty:'standard',launcher:'medium',orbit:'lunar',bus:'standard',power:'solar',comms:'high',payload:['Camera','Spectrometer'],upgrades:[],result:null};render();};
}
function simulate(){
 const t=totals(),good=checks().filter(x=>x[0]).length,need=missions[s.mission][2],coverage=need.filter(x=>s.payload.includes(x)).length/need.length;
 const score=Math.max(0,Math.min(100,Math.round(35+coverage*35+good*6+t.science*.08)));
 s.result={score,t,good,coverage};s.page='results';render();
}
function results(){
 const r=s.result;
 app.innerHTML=`<div class="game"><header><b>✦ ORBITAL<span>LAB</span></b><small>POST-FLIGHT ANALYSIS</small></header><main class="results"><label>SIMULATION COMPLETE</label><h1>${r.score>=70?'MISSION REVIEW: STRONG DESIGN':'MISSION REVIEW: ROOM TO IMPROVE'}</h1><p>${esc(s.name)} · ${missions[s.mission][0]}</p><div class="resultgrid"><section class="panel"><label>MISSION PERFORMANCE INDEX</label><div class="score">${r.score}<small>/100</small></div><div class="meter"><i style="width:${r.score}%"></i></div><h3>${r.score>=70?'DESIGN PERFORMANCE: GOOD':'DESIGN PERFORMANCE: DEVELOPING'}</h3><p>This educational score reflects objective coverage and resource checks. It is not a real flight certification.</p></section><section class="panel"><h3>MISSION SUMMARY</h3><p>Science coverage <b>${Math.round(r.coverage*100)}%</b></p><p>Passed resource checks <b>${r.good}/5</b></p><p>Estimated cost <b>$${r.t.cost}M</b></p><p>Spacecraft mass <b>${r.t.mass} kg</b></p></section></div><section class="panel timeline"><h2>MISSION EVENT LOG</h2>${[['T+00:00','LAUNCH SEQUENCE','Launch vehicle and spacecraft configuration reviewed.'],['T+00:08','ORBIT INSERTION',`Spacecraft enters ${options.orbit[s.orbit][0]}.`],['T+01:20','SYSTEMS CHECK',r.t.need<=r.t.have?'Power supports planned operations.':'Power demand exceeds available generation.'],['T+02:10','COMMUNICATIONS',r.t.commNeed<=r.t.commHave?'Data fits within communications capacity.':'A data backlog develops.'],['END','SCIENCE REVIEW',`Core science objective coverage: ${Math.round(r.coverage*100)}%.`]].map(e=>`<p><small>${e[0]}</small><b>${e[1]}</b> — ${e[2]}</p>`).join('')}</section><button id="edit" class="outline">← EDIT DESIGN</button> <button id="new">DESIGN ANOTHER MISSION ↗</button> <button id="print" class="outline">PRINT REPORT</button></main></div>`;
 document.querySelector('#edit').onclick=()=>{s.page='builder';s.step=4;render();};
 document.querySelector('#new').onclick=()=>{s={...s,page:'builder',step:0,name:'Luna Pathfinder',mission:'lunar',difficulty:'standard',launcher:'medium',orbit:'lunar',bus:'standard',power:'solar',comms:'high',payload:['Camera','Spectrometer'],upgrades:[],result:null};render();};
 document.querySelector('#print').onclick=()=>window.print();
}
function render(){if(s.page==='home')home();else if(s.page==='builder')builder();else results();}
render();
