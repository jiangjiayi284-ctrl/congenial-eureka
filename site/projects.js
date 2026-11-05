(() => {
  const beijingClock=document.querySelector('#beijing-time');
  const beijingFormatter=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  function updateBeijingTime(){
    const now=new Date();
    const parts=Object.fromEntries(beijingFormatter.formatToParts(now).map(part=>[part.type,part.value]));
    beijingClock.textContent=`现在是${parts.year}年北京时间${parts.month}月${parts.day}日 ${parts.hour}:${parts.minute}:${parts.second}`;
    beijingClock.dateTime=now.toISOString();
  }
  updateBeijingTime();
  setInterval(updateBeijingTime,1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateBeijingTime()});
  const projects = [
    {id:'carbon',title:'碳账户升级',organization:'美团',type:'用户端产品设计',image:'assets/projects/carbon-11.webp',embedded:'projects/carbon/replica.html',images:['carbon-11.webp','carbon-06.webp','carbon-12.webp','carbon-15.webp','carbon-18.webp']},
    {id:'annual-report',title:'员工公益年度报告',organization:'美团',type:'用户端产品设计'},
    {id:'baidu',title:'百度项目合集',organization:'百度',type:'营销传播设计'},
    {id:'meitu',title:'美图设计合集',organization:'美图设计室',type:'平面设计'},
    {id:'banqu',title:'半区APP全链路升级',organization:'自驱',type:'UI设计'},
    {id:'yumi',title:'YUMI IP 设计',organization:'自驱',type:'IP设计'}
  ];
  const nav=document.querySelector('#project-navigation');
  const content=document.querySelector('#project-content');
  addEventListener('message',event=>{
    const frame=content.querySelector('.project-embedded');
    if(!frame||event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='carbon-project-size')return;
    const height=Number(event.data.height);
    if(Number.isFinite(height)&&height>0&&height<100000)frame.style.height=`${Math.ceil(height)}px`;
  });
  const thumbnail=p=>p.image?`<span class="project-thumb carbon"><img src="${p.image}" alt="" width="72" height="72"></span>`:`<span class="project-thumb" aria-hidden="true"><span>${p.title.slice(0,2)}</span></span>`;
  nav.innerHTML=projects.map(p=>`<a class="project-link" href="#${p.id}">${thumbnail(p)}<div><h2>${p.title}</h2><p>${p.organization} · ${p.type}</p></div></a>`).join('');
  function render(){
    const id=location.hash.slice(1)||'carbon';
    const p=projects.find(p=>p.id===id);
    const current=p?p.id:'all';
    nav.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    if(!p){
      document.title='全部项目｜姜佳仪';
      content.innerHTML=`<div class="project-overview">${projects.map(p=>`<a class="overview-card" href="#${p.id}"><div class="overview-art">${p.image?`<img src="${p.image}" alt="${p.title}" loading="lazy">`:`<span>${p.title}</span>`}</div><div class="overview-copy"><h2>${p.title}</h2><p>${p.organization} · ${p.type}</p></div></a>`).join('')}</div>`;
    }else{
      document.title=p.title+'｜姜佳仪';
      content.innerHTML=(p.embedded?`<iframe class="project-embedded" src="${p.embedded}" title="碳账户全新改版完整项目" height="1000" scrolling="no"></iframe>`:p.images?`<div class="project-artwork carbon-cover"><img src="assets/projects/${p.images[0]}" alt="美团碳账户页面设计"><img src="assets/projects/${p.images[1]}" alt="碳账户页面设计方案"></div><section class="project-note"><h2>碳账户产品体验升级</h2><p>美团公益碳账户的产品迭代与全链路运营 UI 设计。</p></section><div class="project-artwork screen-gallery">${p.images.slice(2).map((image,i)=>`<img src="assets/projects/${image}" alt="碳账户界面设计 ${i+1}" loading="lazy">`).join('')}</div>`:`<section class="empty-project"><h2>${p.title}</h2><p>作品整理中</p></section>`);
    }
    content.setAttribute('aria-label',p?p.title:'我的项目');
    content.scrollTop=0;
    if(innerWidth<=760)scrollTo({top:0,behavior:'instant'});
  }
  addEventListener('hashchange',render);
  const toggle=document.querySelector('.theme-toggle');
  function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';toggle.setAttribute('aria-pressed',String(dark));toggle.setAttribute('aria-label',dark?'切换浅色模式':'切换深色模式')}
  toggle.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('portfolio-theme',theme)}catch{}syncTheme()});
  syncTheme();render();
})();
