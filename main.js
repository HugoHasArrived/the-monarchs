import './style.css';

const $ = (s) => document.querySelector(s);
const state = {
  screen: 'home',
  step: 0,
  difficulty: 'standard',
  objective: 'lunar',
  missionName: 'Luna Pathfinder',
  vehicle: 'medium',
  orbit: 'lunar',
  spacecraft: 'standard',
  power: 'solar',
  comms: 'highgain',
  instruments: ['camera', 'spectrometer'],
  upgrades: [],
  simulation: null
};

const catalog = {
  vehicles: {
    small: {name:'Asteria Small Lift', mass:180, cost:90, capacity:350, description:'Low-cost launcher for compact spacecraft.'},
    medium: {name:'Horizon Medium Lift', mass:0, cost:170, capacity:1400, description:'Balanced capacity for ambitious science missions.'},
    heavy: {name:'Titan Heavy Lift', mass:0, cost:290, capacity:5200, description:'Large payload capacity with a higher price.'}
  },
  orbits: {
    leo: {name:'Low Earth Orbit', mass:0, cost:35, power:0, comms:0, data:1.0, science:60, description:'Close to Earth; ideal for imaging and frequent ground contact.'},
    geo: {name:'Geostationary Orbit', mass:0, cost:55, power:0, comms:15, data:1.2, science:72, description:'Maintains a view of the same region of Earth.'},
    lunar: {name:'Lunar Transfer & Orbit', mass:0, cost:105, power:12, comms:10, data:1.15, science:100, description:'Reaches the Moon for detailed lunar observations.'},
    mars: {name:'Mars Transfer', mass:0, cost:190, power:24, comms:25, data:1.3, science:125, description:'A long journey with demanding power and communications needs.'}
  },
  spacecraft: {
    compact: {name:'Compact Bus', mass:140, cost:85, power:85, comms:45, description:'Lightweight platform with limited room to grow.'},
    standard: {name:'Explorer Bus', mass:260, cost:145, power:150, comms:75, description:'A flexible platform for a medium science payload.'},
    advanced: {name:'Deep Space Bus', mass:420, cost:230, power:235, comms:115, description:'More capable systems for demanding missions.'}
  },
  power: {
    solar: {name:'Deployable Solar Arrays', mass:55, cost:65, output:110, description:'Reliable near the Sun; output depends on mission location.'},
    nuclear: {name:'Radioisotope Power System', mass:75, cost:125, output:145, description:'Steady power for distant or shadowed environments.'},
    hybrid: {name:'Solar + Battery Hybrid', mass:85, cost:95, output:155, description:'Extra storage for periods without sunlight.'}
  },
  comms: {
    basic: {name:'Low-Gain Antenna', mass:12, cost:20, capacity:35, description:'Simple, low-data-rate communication.'},
    highgain: {name:'High-Gain Antenna', mass:35, cost:65, capacity:105, description:'Focused signal for larger science data volumes.'},
    relay: {name:'Relay Network Package', mass:60, cost:105, capacity:165, description:'High capacity, with additional infrastructure cost.'}
  },
  instruments: {
    camera: {name:'High-Resolution Camera', mass:28, cost:45, power:24, data:35, science:28, description:'Captures detailed images of the target.'},
    spectrometer: {name:'Imaging Spectrometer', mass:42, cost:70, power:38, data:48, science:42, description:'Studies materials by analysing light.'},
    radar: {name:'Radar Sounder', mass:58, cost:95, power:52, data:26, science:48, description:'Looks beneath surfaces and through some clouds.'},
    magnetometer: {name:'Magnetometer', mass:18, cost:35, power:12, data:12, science:22, description:'Measures magnetic fields around the target.'},
    thermal: {name:'Thermal Mapper', mass:32, cost:55, power:30, data:28, science:32, description:'Maps surface temperatures and thermal patterns.'},
    particle: {name:'Particle Detector', mass:24, cost:48, power:20, data:18, science:30, description:'Measures energetic particles in the space environment.'}
  }
};

const missions = {
  lunar: {title:'Moon Mapper', target:'The Moon', brief:'Map a lunar region and investigate its surface composition.', need:['camera','spectrometer'], bonus:'A balanced imaging and composition payload is especially useful.'},
  earth: {title:'Earth Watch', target:'Earth', brief:'Monitor changing land, oceans, and atmospheric conditions.', need:['camera','thermal'], bonus:'Frequent observations and reliable data return are valuable.'},
  mars: {title:'Red Planet Scout', target:'Mars', brief:'Study the Martian surface and search for clues about its past.', need:['camera','spectrometer','radar'], bonus:'A capable spacecraft and long-distance communications help.'},
  space: {title:'Solar Storm Sentinel', target:'Near-Earth Space', brief:'Observe energetic particles and magnetic activity near Earth.', need:['particle','magnetometer'], bonus:'Particle and magnetic-field measurements are the core science.'}
};

function money(n){return '$'+Math.round(n)+'M'}
function getTotals(){
  const v=catalog.vehicles[state.vehicle], o=catalog.orbits[state.orbit], s=catalog.spacecraft[state.spacecraft], p=catalog.power[state.power], c=catalog.comms[state.comms];
  const ins=state.instruments.map(k=>catalog.instruments[k]);
  const upgrades=state.upgrades.reduce((a,k)=>({mass:a.mass+({shield:20,computer:12,propulsion:35}[k]||0),cost:a.cost+({shield:35,computer:30,propulsion:55}[k]||0),power:a.power+({shield:0,computer:14,propulsion:8}[k]||0)}),{mass:0,cost:0,power:0});
  const mass=s.mass+p.mass+c.mass+ins.reduce((a,x)=>a+x.mass,0)+upgrades.mass;
  const cost=v.cost+o.cost+s.cost+p.cost+c.cost+ins.reduce((a,x)=>a+x.cost,0)+upgrades.cost+65;
  const powerNeed=ins.reduce((a,x)=>a+x.power,0)+upgrades.power+o.power+32;
  const powerHave=p.output+s.power;
  const data=ins.reduce((a,x)=>a+x.data,0)*o.data;
  const commsNeed=data*1.35;
  const commsHave=c.capacity+s.comms;
  return {mass,cost,powerNeed,powerHave,data,commsNeed,commsHave,capacity:v.capacity};
}
function setScreen(screen){state.screen=screen;render();}
function start(){state.screen='builder';state.step=0;render();}
function selectCard(group,key){
  if(group==='instruments'){
    state.instruments=state.instruments.includes(key)?state.instruments.filter(x=>x!==key):[...state.instruments,key];
  } else if(group==='upgrades'){
    state.upgrades=state.upgrades.includes(key)?state.upgrades.filter(x=>x!==key):[...state.upgrades,key];
  } else state[group]=key;
  render();
}
function optionCard(group,key,item,selected,extra=''){
  return `<button class="option ${selected?'selected':''}" data-group="${group}" data-key="${key}">
    <span class="option-top"><b>${item.name}</b><span class="check">${selected?'✓':'+'}</span></span>
    <span class="option-desc">${item.description}</span>
    <span class="option-stats">${extra}</span>
  </button>`;
}
function renderHome(){
  return `<main class="home">
    <nav class="topbar"><div class="brand"><span class="brand-mark">✦</span> ORBITAL<span class="brand-light">LAB</span></div><div class="nav-right"><span class="status-dot"></span> MISSION DESIGN SIMULATOR <span class="nav-version">V 1.0</span></div></nav>
    <section class="hero">
      <div class="hero-copy"><div class="eyebrow"><span></span> YOUR MISSION STARTS HERE</div>
        <h1>DESIGN A MISSION.<br><em>CHANGE WHAT WE KNOW.</em></h1>
        <p class="hero-lead">You are the mission director. Choose a scientific goal, engineer a spacecraft, balance limited resources, and put your design to the test.</p>
        <div class="hero-actions"><button class="primary-btn" id="start">START DESIGNING <span>↗</span></button><button class="text-btn" id="how">HOW TO PLAY <span>↓</span></button></div>
        <div class="hero-meta"><div><b>04</b><span>MISSION TYPES</span></div><i></i><div><b>06</b><span>SCIENCE INSTRUMENTS</span></div><i></i><div><b>∞</b><span>WAYS TO DESIGN</span></div></div>
      </div>
      <div class="hero-art"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="planet"></div><div class="moon"></div><div class="satellite"><div class="sat-body"></div><div class="panel left"></div><div class="panel right"></div><div class="antenna"></div></div><div class="art-label label-a">MISSION 001 <span>● ACTIVE CONCEPT</span></div><div class="art-label label-b">EARTH / LUNAR SYSTEM <span>384,400 KM</span></div><div class="star s1">✦</div><div class="star s2">✧</div><div class="star s3">✦</div></div>
    </section>
    <section class="below"><div class="section-kicker">THE MISSION DESIGN LOOP</div><div class="loop-grid"><article><span>01</span><b>DEFINE</b><p>Choose what your mission will discover.</p></article><article><span>02</span><b>ENGINEER</b><p>Build a spacecraft within real constraints.</p></article><article><span>03</span><b>SIMULATE</b><p>Launch your design and face mission events.</p></article><article><span>04</span><b>LEARN</b><p>Review results and improve your next design.</p></article></div></section>
    <div class="home-footer"><span>AN EDUCATIONAL SPACE SYSTEMS SIMULATOR</span><span>INSPIRED BY REAL MISSION DESIGN PRINCIPLES</span></div>
    <div class="modal hidden" id="how-modal"><div class="modal-card"><button class="close" id="close-how">×</button><div class="eyebrow">QUICK BRIEFING</div><h2>How to play</h2><ol><li>Pick a mission objective and difficulty.</li><li>Choose a launch vehicle, orbit, spacecraft bus, power system, and communications package.</li><li>Select science instruments and optional upgrades.</li><li>Keep cost, mass, power, and data within your limits.</li><li>Run the simulation, review mission events, and improve your design.</li></ol><p class="muted">There is no single perfect design. Every choice creates trade-offs.</p><button class="primary-btn" id="got-it">GOT IT</button></div></div>
  </main>`;
}
const steps=['MISSION','LAUNCH & ORBIT','SPACECRAFT','SCIENCE PAYLOAD','REVIEW'];
function stepContent(){
  const t=getTotals(), mission=missions[state.objective];
  if(state.step===0) return `<div class="step-intro"><div class="eyebrow">STEP 01 / MISSION CONCEPT</div><h2>What are we trying to discover?</h2><p>Every engineering decision starts with a scientific question.</p></div>
    <div class="mission-grid">${Object.entries(missions).map(([k,m])=>`<button class="mission-card ${state.objective===k?'active':''}" data-group="objective" data-key="${k}"><span class="mission-icon">${({lunar:'☾',earth:'◎',mars:'◉',space:'✧'})[k]}</span><span class="tag">MISSION CONCEPT</span><b>${m.title}</b><p>${m.brief}</p><small>TARGET: ${m.target.toUpperCase()}</small></button>`).join('')}</div>
    <div class="field-row"><label for="mission-name">MISSION NAME</label><input id="mission-name" maxlength="28" value="${state.missionName.replaceAll('"','&quot;')}"><span class="hint">Give your mission an identity.</span></div>
    <div class="field-row"><label>DESIGN DIFFICULTY</label><div class="segmented">${[['beginner','BEGINNER'],['standard','STANDARD'],['expert','EXPERT']].map(([k,v])=>`<button data-group="difficulty" data-key="${k}" class="${state.difficulty===k?'active':''}">${v}</button>`).join('')}</div><span class="hint">${state.difficulty==='beginner'?'More generous resource limits and guided feedback.':state.difficulty==='expert'?'Tighter limits and less room for inefficient choices.':'Balanced constraints for a realistic design challenge.'}</span></div>`;
  if(state.step===1) return `<div class="step-intro"><div class="eyebrow">STEP 02 / GETTING THERE</div><h2>Choose your ride and destination.</h2><p>Your launcher must carry the spacecraft, while your orbit determines what the mission can observe.</p></div>
    <h3 class="subhead">LAUNCH VEHICLE</h3><div class="option-grid">${Object.entries(catalog.vehicles).map(([k,v])=>optionCard('vehicle',k,v,state.vehicle,`PAYLOAD ${v.capacity.toLocaleString()} kg · ${money(v.cost)}`)).join('')}</div>
    <h3 class="subhead">MISSION ORBIT / TRAJECTORY</h3><div class="option-grid">${Object.entries(catalog.orbits).map(([k,v])=>optionCard('orbit',k,v,state.orbit,`SCIENCE POTENTIAL ${v.science} · ${money(v.cost)}`)).join('')}</div>`;
  if(state.step===2) return `<div class="step-intro"><div class="eyebrow">STEP 03 / SPACECRAFT BUS</div><h2>Build the spacecraft platform.</h2><p>The bus supports the payload. Choose a platform and make sure it can power and communicate with your instruments.</p></div>
    <h3 class="subhead">SPACECRAFT PLATFORM</h3><div class="option-grid">${Object.entries(catalog.spacecraft).map(([k,v])=>optionCard('spacecraft',k,v,state.spacecraft,`${v.mass} kg · ${money(v.cost)} · ${v.power} W bus power`)).join('')}</div>
    <h3 class="subhead">POWER SYSTEM</h3><div class="option-grid">${Object.entries(catalog.power).map(([k,v])=>optionCard('power',k,v,state.power,`${v.mass} kg · ${v.output} W · ${money(v.cost)}`)).join('')}</div>
    <h3 class="subhead">COMMUNICATIONS</h3><div class="option-grid">${Object.entries(catalog.comms).map(([k,v])=>optionCard('comms',k,v,state.comms,`${v.mass} kg · ${v.capacity} data units · ${money(v.cost)}`)).join('')}</div>`;
  if(state.step===3) return `<div class="step-intro"><div class="eyebrow">STEP 04 / SCIENCE PAYLOAD</div><h2>Choose what your mission will measure.</h2><p>More instruments can increase scientific value, but they also add mass, power demand, data, and cost.</p></div>
    <div class="payload-grid">${Object.entries(catalog.instruments).map(([k,v])=>`<button class="payload-card ${state.instruments.includes(k)?'active':''}" data-group="instruments" data-key="${k}"><span class="payload-check">${state.instruments.includes(k)?'✓':'+'}</span><b>${v.name}</b><p>${v.description}</p><div class="payload-metrics"><span>${v.mass} kg</span><span>${v.power} W</span><span>${money(v.cost)}</span></div><div class="science-value">SCIENCE VALUE <b>+${v.science}</b></div></button>`).join('')}</div>
    <h3 class="subhead">OPTIONAL ENGINEERING UPGRADES</h3><div class="upgrade-grid">${[['shield','Radiation shielding','Adds protection for sensitive electronics.'],['computer','Enhanced onboard computer','Adds processing capacity, with extra power draw.'],['propulsion','Extended propulsion package','Adds manoeuvring capability and additional mass.']].map(([k,n,d])=>`<button class="upgrade ${state.upgrades.includes(k)?'active':''}" data-group="upgrades" data-key="${k}"><span>${state.upgrades.includes(k)?'✓':'+'}</span><b>${n}</b><small>${d}</small></button>`).join('')}</div>`;
  return `<div class="step-intro"><div class="eyebrow">STEP 05 / DESIGN REVIEW</div><h2>Does your mission add up?</h2><p>Review your engineering margins before committing to launch.</p></div>
    <div class="review-layout"><div class="review-main"><div class="review-title"><div><span class="tag">MISSION DESIGN</span><h3>${escapeHtml(state.missionName)}</h3><p>${mission.title} · ${mission.target}</p></div><span class="review-emblem">✦</span></div>
    <div class="review-list">${[['Launch vehicle',catalog.vehicles[state.vehicle].name],['Trajectory',catalog.orbits[state.orbit].name],['Spacecraft',catalog.spacecraft[state.spacecraft].name],['Power',catalog.power[state.power].name],['Communications',catalog.comms[state.comms].name],['Science payload',state.instruments.map(k=>catalog.instruments[k].name).join(', ')||'No instruments selected'],['Upgrades',state.upgrades.join(', ')||'None']].map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('')}</div>
    <div class="mission-note"><b>SCIENCE OBJECTIVE</b><p>${mission.brief}</p></div></div><aside class="resource-panel"><div class="panel-heading">RESOURCE TELEMETRY <span>LIVE</span></div>${metric('TOTAL COST',money(t.cost),money(budget()),t.cost/budget(),'cost')}${metric('SPACECRAFT MASS',t.mass+' kg',t.capacity+' kg capacity',t.mass/t.capacity,'mass')}${metric('POWER BALANCE',t.powerNeed+' W needed',t.powerHave+' W available',t.powerNeed/t.powerHave,'power')}${metric('DATA RETURN',Math.round(t.data)+' units',Math.round(t.commsHave)+' capacity',t.commsNeed/t.commsHave,'data')}<div class="budget-foot">Limits change with difficulty. All values are simplified educational estimates.</div></aside></div>
    <div class="validation" id="validation">${validationMessages().map(x=>`<div class="${x.type}"><span>${x.type==='bad'?'×':'✓'}</span>${x.text}</div>`).join('')}</div>`;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function budget(){return ({beginner:1100,standard:850,expert:680})[state.difficulty]}
function metric(label,value,sub,ratio,kind){const pct=Math.min(100,Math.max(0,ratio*100));return `<div class="metric"><div class="metric-head"><span>${label}</span><b>${value}</b></div><div class="bar"><i class="${ratio>1?'over':''}" style="width:${pct}%"></i></div><small>${sub}</small></div>`}
function validationMessages(){
  const t=getTotals(), m=missions[state.objective], out=[];
  if(t.cost>budget())out.push({type:'bad',text:`Over budget by ${money(t.cost-budget())}. Reduce cost or choose a less expensive configuration.`});
  else out.push({type:'good',text:`Budget margin: ${money(budget()-t.cost)} remaining.`});
  if(t.mass>t.capacity)out.push({type:'bad',text:`Payload mass exceeds launcher capacity by ${t.mass-t.capacity} kg.`});
  else out.push({type:'good',text:`Launch vehicle can carry your ${t.mass} kg spacecraft.`});
  if(t.powerNeed>t.powerHave)out.push({type:'bad',text:`Power shortfall: ${t.powerNeed-t.powerHave} W. Your instruments may not all operate.`});
  else out.push({type:'good',text:`Power margin: ${t.powerHave-t.powerNeed} W available.`});
  if(t.commsNeed>t.commsHave)out.push({type:'bad',text:`Communications capacity is too low for the planned data volume.`});
  else out.push({type:'good',text:`Communications can return the planned science data.`});
  if(state.instruments.length===0)out.push({type:'bad',text:'Select at least one science instrument.'});
  if(m.need.every(k=>state.instruments.includes(k)))out.push({type:'good',text:'Your payload includes the core instruments for this science objective.'});
  else out.push({type:'warn',text:`Consider adding ${m.need.filter(k=>!state.instruments.includes(k)).map(k=>catalog.instruments[k].name).join(' and ')} for stronger objective coverage.`});
  return out;
}
function canLaunch(){return validationMessages().every(x=>x.type!=='bad');}
function renderBuilder(){
  const t=getTotals();
  return `<main class="app-shell"><header class="app-header"><button class="brand brand-button" id="home"><span class="brand-mark">✦</span> ORBITAL<span class="brand-light">LAB</span></button><div class="header-center">MISSION DESIGN WORKSPACE <span> / </span> ${steps[state.step]}</div><button class="save-btn" id="reset">↻ RESET DESIGN</button></header>
    <div class="workspace"><aside class="sidebar"><div class="side-label">MISSION WORKFLOW</div>${steps.map((s,i)=>`<button class="step-link ${i===state.step?'current':''} ${i<state.step?'done':''}" data-step="${i}"><span class="step-num">${i<state.step?'✓':String(i+1).padStart(2,'0')}</span><span>${s}</span>${i===state.step?'<i>●</i>':''}</button>`).join('')}<div class="sidebar-bottom"><div class="mini-orbit">✦</div><b>ENGINEERING IS A TEAM SPORT.</b><p>Every choice affects the whole mission. Think in systems, not parts.</p></div></aside>
    <section class="builder-content"><div class="content-scroll">${stepContent()}</div><footer class="builder-footer"><button class="back-btn" id="back" ${state.step===0?'disabled':''}>← BACK</button><div class="footer-center"><span>DESIGN PROGRESS</span><div class="progress">${steps.map((_,i)=>`<i class="${i<=state.step?'filled':''}"></i>`).join('')}</div><b>${state.step+1} / 5</b></div><button class="primary-btn next-btn" id="next">${state.step===4?'RUN SIMULATION':'CONTINUE'} <span>→</span></button></footer></section>
    <aside class="telemetry"><div class="telemetry-title">MISSION TELEMETRY <span class="live-dot">● LIVE</span></div><div class="telemetry-target"><span>TARGET BODY</span><b>${missions[state.objective].target}</b><small>${missions[state.objective].title}</small></div><div class="telemetry-metric"><span>EST. TOTAL COST</span><b>${money(t.cost)}</b><small>LIMIT ${money(budget())}</small></div><div class="telemetry-metric"><span>SPACECRAFT MASS</span><b>${t.mass} <small>KG</small></b><small>CAPACITY ${t.capacity.toLocaleString()} KG</small></div><div class="telemetry-metric"><span>POWER BALANCE</span><b class="${t.powerNeed>t.powerHave?'warning-text':''}">${t.powerNeed} / ${t.powerHave} <small>W</small></b><small>${t.powerHave-t.powerNeed>=0?'SURPLUS':'SHORTFALL'} ${Math.abs(t.powerHave-t.powerNeed)} W</small></div><div class="telemetry-metric"><span>DATA / COMMS</span><b>${Math.round(t.commsNeed)} / ${t.commsHave}</b><small>PLANNED / CAPACITY</small></div><div class="telemetry-tip"><span>✦ DESIGN TIP</span><p>${missions[state.objective].bonus}</p></div></aside></div></main>`;
}
function simulate(){
  const t=getTotals(), m=missions[state.objective], checks=validationMessages();
  const issues=checks.filter(x=>x.type==='bad').length;
  const matched=m.need.filter(k=>state.instruments.includes(k)).length/m.need.length;
  const marginPower=Math.max(0,Math.min(1,(t.powerHave-t.powerNeed+60)/100));
  const marginComms=Math.max(0,Math.min(1,(t.commsHave-t.commsNeed+30)/90));
  const massScore=Math.max(0,1-t.mass/t.capacity);
  const budgetScore=Math.max(0,1-t.cost/budget());
  let score=Math.round(28+matched*28+marginPower*12+marginComms*10+massScore*10+budgetScore*12-issues*18);
  score=Math.max(0,Math.min(100,score));
  const success=issues===0 && matched>=.5 && score>=52;
  const events=[
    ['T+00:00','LAUNCH SEQUENCE','Vehicle and spacecraft configuration reviewed.'],
    ['T+00:08','ORBIT INSERTION',state.orbit==='mars'?'Spacecraft begins its long interplanetary cruise.':state.orbit==='lunar'?'Spacecraft enters the planned lunar transfer and orbit phase.':'Spacecraft reaches the selected Earth orbit.'],
    ['T+01:20','SYSTEMS CHECK',t.powerNeed<=t.powerHave?'Power system supports the planned instrument operations.':'Power demand exceeds available generation; some instruments enter reduced operation.'],
    ['T+02:10','COMMUNICATIONS',t.commsNeed<=t.commsHave?'Science data fits within the communications capacity.':'Data backlog builds because downlink capacity is limited.'],
    ['T+03:40','SCIENCE OPERATIONS',matched===1?'All core objective instruments are available for science collection.':`Core objective coverage is ${Math.round(matched*100)}%; some science questions remain unanswered.`],
    ['END OF MISSION','MISSION REVIEW',success?'Mission meets its main design requirements.':'Mission completes with engineering or science limitations to address.']
  ];
  state.simulation={score,success,issues,matched,events,t};
}
function renderResults(){
  const r=state.simulation;
  return `<main class="results-screen"><header class="app-header"><div class="brand"><span class="brand-mark">✦</span> ORBITAL<span class="brand-light">LAB</span></div><div class="header-center">MISSION CONTROL <span>/</span> POST-FLIGHT ANALYSIS</div><span class="report-id">REPORT // ${Math.floor(1000+Math.random()*8999)}</span></header>
    <section class="results-wrap"><div class="results-heading"><div class="eyebrow">SIMULATION COMPLETE</div><h1>${r.success?'MISSION OBJECTIVES ACHIEVED.':'MISSION DATA RECEIVED.'}</h1><p>${escapeHtml(state.missionName)} · ${missions[state.objective].target} · ${catalog.orbits[state.orbit].name}</p></div>
    <div class="score-layout"><div class="score-card"><div class="score-label">MISSION PERFORMANCE INDEX</div><div class="score-number">${r.score}<small>/100</small></div><div class="score-track"><i style="width:${r.score}%"></i></div><b class="${r.success?'success-text':'warning-text'}">${r.success?'SUCCESSFUL DESIGN':'DESIGN NEEDS IMPROVEMENT'}</b><p>This score reflects objective coverage, resource margins, and design efficiency. It is an educational game score, not a real flight certification.</p></div>
    <div class="result-stats"><div><span>SCIENCE COVERAGE</span><b>${Math.round(r.matched*100)}%</b><small>Core instruments selected</small></div><div><span>RESOURCE ISSUES</span><b>${r.issues}</b><small>Constraint checks failed</small></div><div><span>PROJECT COST</span><b>${money(r.t.cost)}</b><small>Estimated development + operations</small></div><div><span>SPACECRAFT MASS</span><b>${r.t.mass} kg</b><small>Launcher limit ${r.t.capacity} kg</small></div></div></div>
    <div class="timeline-card"><div class="timeline-head"><div><span class="tag">FLIGHT LOG</span><h2>Mission event timeline</h2></div><span class="log-status">● SIMULATED</span></div><div class="event-list">${r.events.map((e,i)=>`<div class="event"><span class="event-time">${e[0]}</span><span class="event-dot">${i===r.events.length-1?'✦':'·'}</span><div><b>${e[1]}</b><p>${e[2]}</p></div></div>`).join('')}</div></div>
    <div class="debrief"><div><div class="eyebrow">ENGINEERING DEBRIEF</div><h2>What did your design teach you?</h2><p>${r.success?'Your design passed the simplified resource checks. The next step is to improve margins and consider how the mission would handle unexpected events.':'The simulation exposed trade-offs in your design. Use the review below to identify what to change before your next attempt.'}</p></div><div class="debrief-list">${validationMessages().map(x=>`<div class="${x.type}"><span>${x.type==='bad'?'×':x.type==='warn'?'!':'✓'}</span>${x.text}</div>`).join('')}</div></div>
    <div class="result-actions"><button class="back-btn" id="edit">← EDIT THIS DESIGN</button><button class="primary-btn" id="again">DESIGN A NEW MISSION <span>↗</span></button><button class="text-btn" id="print">EXPORT REPORT ↗</button></div></section></main>`;
}
function render(){
  const app=$('#app');
  app.innerHTML=state.screen==='home'?renderHome():state.screen==='builder'?renderBuilder():renderResults();
  if(state.screen==='home'){
    $('#start').onclick=start;$('#how').onclick=()=>$('#how-modal').classList.remove('hidden');$('#close-how').onclick=()=>$('#how-modal').classList.add('hidden');$('#got-it').onclick=()=>{$('#how-modal').classList.add('hidden');start();};
  } else if(state.screen==='builder'){
    $('#home').onclick=()=>setScreen('home');$('#reset').onclick=()=>{Object.assign(state,{step:0,difficulty:'standard',objective:'lunar',missionName:'Luna Pathfinder',vehicle:'medium',orbit:'lunar',spacecraft:'standard',power:'solar',comms:'highgain',instruments:['camera','spectrometer'],upgrades:[]});render();};
    $('#back').onclick=()=>{state.step=Math.max(0,state.step-1);render();};
    $('#next').onclick=()=>{if(state.step<4){if(state.step===0)state.missionName=$('#mission-name').value.trim()||'Unnamed Mission';state.step++;render();}else{if(canLaunch()){simulate();setScreen('results');}else{$('#validation')?.scrollIntoView({behavior:'smooth',block:'center'});$('#validation')?.classList.add('shake');}}};
    document.querySelectorAll('[data-group]').forEach(el=>el.addEventListener('click',()=>selectCard(el.dataset.group,el.dataset.key)));
    document.querySelectorAll('[data-step]').forEach(el=>el.addEventListener('click',()=>{state.step=Number(el.dataset.step);render();}));
    $('#mission-name')?.addEventListener('input',e=>state.missionName=e.target.value);
  } else {
    $('#edit').onclick=()=>{state.step=4;setScreen('builder');};$('#again').onclick=()=>{Object.assign(state,{step:0,objective:'lunar',missionName:'Luna Pathfinder',instruments:['camera','spectrometer'],upgrades:[]});setScreen('builder');};$('#print').onclick=()=>window.print();
  }
}
render();