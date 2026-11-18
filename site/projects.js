(() => {
  const beijingClock=document.querySelector('#beijing-time');
  const beijingDate=beijingClock.querySelector('.beijing-date');
  const beijingTime=beijingClock.querySelector('.beijing-clock');
  const beijingFormatter=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  function updateBeijingTime(){
    const now=new Date();
    const parts=Object.fromEntries(beijingFormatter.formatToParts(now).map(part=>[part.type,part.value]));
    beijingDate.textContent=`现在是${parts.year}年北京时间${parts.month}月${parts.day}日`;
    beijingTime.textContent=`${parts.hour}:${parts.minute}:${parts.second}`;
    beijingClock.dateTime=now.toISOString();
  }
  updateBeijingTime();
  setInterval(updateBeijingTime,1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateBeijingTime()});
  const projects = [
    {id:'carbon',title:'碳账户升级',organization:'美团',type:'用户端产品设计',image:'assets/projects/carbon-11.webp',embedded:'projects/carbon/replica.html?v=radius-12',images:['carbon-11.webp','carbon-06.webp','carbon-12.webp','carbon-15.webp','carbon-18.webp']},
    {id:'annual-report',title:'员工公益年度报告',organization:'美团',type:'用户端产品设计'},
    {
      id:'baidu',title:'百度项目合集',organization:'百度',type:'营销传播设计',navImage:'assets/projects/baidu/nav-icon.png',
      artboards:[
        {id:480,height:3770,alt:'百科智能体运营'},
        {id:488,height:2657,alt:'多模语音传播设计'},
        {id:489,height:1857,alt:'其他人物以及物料延展'},
        {id:481,height:1735,alt:'金秋神龙红包'},
        {id:490,height:2509,alt:'金秋神龙红包设计展示'}
      ]
    },
    {
      id:'meitu',title:'美图设计合集',organization:'美图设计室',type:'平面设计',navImage:'assets/projects/meitu/nav-icon.png',
      artboards:[
        {id:487,height:1080,alt:'美图设计室设计计划'},
        {id:486,height:2096,alt:'AI 商品图片转视频设计过程'},
        {id:467,height:1080,alt:'AI 商品图片转视频场景展示'},
        {id:468,height:1080,alt:'AI PPT 项目展示'},
        {id:470,height:1080,alt:'简约和商务 PPT 模板'},
        {id:471,height:1080,alt:'多风格 PPT 模板展示'},
        {id:463,height:2964,alt:'美图设计室海报作品'}
      ]
    },
    {
      id:'banqu',title:'半区APP全链路升级',organization:'自驱',type:'UI设计',navImage:'assets/projects/banqu/nav-icon.png',
      artboardFormat:'png',
      artboards:[
        {id:1,width:2880,height:5742,alt:'项目介绍'},
        {id:2,width:2880,height:1620,alt:'用户群体'},
        {id:3,width:2880,height:1620,alt:'改版原因'},
        {id:4,width:2880,height:1620,alt:'项目目标'},
        {id:5,width:2880,height:1620,alt:'产品架构'},
        {id:6,width:2880,height:1620,alt:'旧页面回顾'},
        {id:7,width:2880,height:1620,alt:'注册登录优化：问题与策略'},
        {id:8,width:2880,height:1620,alt:'注册登录优化：新版流程'},
        {id:9,width:2880,height:9537,alt:'视觉风格与设计规范'},
        {id:10,width:2880,height:2861,alt:'首页设计展示'},
        {id:11,width:2880,height:9011,alt:'首页改版前后对比'},
        {id:12,width:2880,height:5565,alt:'核心玩法方向探索'},
        {id:13,width:2880,height:2916,alt:'发起组局流程'},
        {id:14,width:2880,height:1620,alt:'加入组局流程'},
        {id:15,width:2880,height:1620,alt:'Flag 功能介绍'},
        {id:16,width:2880,height:6138,alt:'Flag 挑战赛设计'},
        {id:17,width:2880,height:1620,alt:'Flag 广场与个人页面'},
        {id:18,width:2880,height:1620,alt:'Flag 挑战流程'},
        {id:19,width:2880,height:3717,alt:'消息界面优化'},
        {id:20,width:2880,height:1620,alt:'其他界面一览'},
        {id:21,width:2880,height:1620,alt:'品牌形象升级'},
        {id:22,width:2880,height:1620,alt:'IP 风格探索'},
        {id:23,width:2880,height:3798,alt:'空状态设计'},
        {id:24,width:2880,height:1620,alt:'项目总结'}
      ]
    },
    {
      id:'yumi',title:'YUMI IP 设计',organization:'自驱',type:'IP设计',
      artboardFormat:'png',
      artboards:[
        {id:1,width:1920,height:1080,alt:'YUMI IP 设计图 1'},
        {id:2,width:1920,height:1080,alt:'YUMI IP 设计图 2'},
        {id:3,width:1920,height:1080,alt:'YUMI IP 设计图 3'},
        {id:4,width:1920,height:1080,alt:'YUMI IP 设计图 4'},
        {id:5,width:1920,height:1278,alt:'YUMI IP 设计图 5'},
        {id:6,width:1920,height:1080,alt:'YUMI IP 设计图 6'},
        {id:7,width:1920,height:1080,alt:'YUMI IP 设计图 7'},
        {id:8,width:1920,height:1080,alt:'YUMI IP 设计图 8'},
        {id:9,width:1920,height:5383,alt:'YUMI IP 设计图 9'},
        {id:10,width:1920,height:1322,alt:'YUMI IP 设计图 10'}
      ]
    }
  ];
  const nav=document.querySelector('#project-navigation');
  const content=document.querySelector('#project-content');
  addEventListener('message',event=>{
    const frame=content.querySelector('.project-embedded');
    if(!frame||event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='carbon-project-size')return;
    const height=Number(event.data.height);
    if(Number.isFinite(height)&&height>0&&height<100000)frame.style.height=`${Math.ceil(height)}px`;
  });
  const thumbnail=p=>(p.navImage||p.image)?`<span class="project-thumb ${p.id}"><img src="${p.navImage||p.image}" alt="" width="72" height="72"></span>`:`<span class="project-thumb" aria-hidden="true"><span>${p.title.slice(0,2)}</span></span>`;
  nav.innerHTML=projects.map(p=>`<a class="project-link" href="#${p.id}" aria-label="${p.title}" title="${p.title}">${thumbnail(p)}<div><h2>${p.title}</h2><p>${p.organization} · ${p.type}</p></div></a>`).join('');
  function render(){
    const id=location.hash.slice(1)||'carbon';
    const p=projects.find(p=>p.id===id);
    const current=p?p.id:'all';
    nav.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    if(!p){
      document.title='全部项目｜姜佳仪';
      content.innerHTML=`<div class="project-overview">${projects.map(p=>`<a class="overview-card" href="#${p.id}"><div class="overview-art">${p.image?`<img src="${p.image}" alt="${p.title}" loading="lazy">`:`<span>${p.title}</span>`}</div><div class="overview-copy"><h2>${p.title}</h2><p>${p.organization} · ${p.type}</p></div></a>`).join('')}</div>`;
    }else if(p.artboards){
      document.title=p.title+'｜姜佳仪';
      content.innerHTML=p.artboards.map(({id,width=1920,height,alt},index)=>`
        <picture class="project-artboard-picture">
        <source media="(max-width: 760px)" srcset="assets/projects/${p.id}/${id}-960.webp">
        <img class="project-artboard" decoding="async" src="assets/projects/${p.id}/${id}.${p.artboardFormat||'webp'}"
          width="${width}" height="${height}" alt="${alt}"${index ? ' loading="lazy"' : ''}>
        </picture>
      `).join('');
    }else{
      document.title=p.title+'｜姜佳仪';
      content.innerHTML=(p.embedded?`<iframe class="project-embedded" src="${p.embedded}" title="碳账户全新改版完整项目" height="1000" scrolling="no"></iframe>`:p.images?`<div class="project-artwork carbon-cover"><img src="assets/projects/${p.images[0]}" alt="美团碳账户页面设计"><img src="assets/projects/${p.images[1]}" alt="碳账户页面设计方案"></div><section class="project-note"><h2>碳账户产品体验升级</h2><p>美团公益碳账户的产品迭代与全链路运营 UI 设计。</p></section><div class="project-artwork screen-gallery">${p.images.slice(2).map((image,i)=>`<img src="assets/projects/${image}" alt="碳账户界面设计 ${i+1}" loading="lazy">`).join('')}</div>`:`<section class="empty-project"><h2>${p.title}</h2><p>作品整理中</p></section>`);
    }
    content.setAttribute('aria-label',p?p.title:'我的项目');
    content.scrollTop=0;
    if(innerWidth<=760)scrollTo({top:0,behavior:'instant'});
  }
  addEventListener('hashchange',render);
  const sidebar=document.querySelector('#project-sidebar');
  const divider=document.querySelector('.project-divider');
  const minSidebarWidth=260;
  const maxSidebarWidth=()=>Math.floor(innerWidth*.55);
  const sidebarWidth=()=>Math.round(sidebar.getBoundingClientRect().width);
  function syncDivider(){
    if(innerWidth<=760)return;
    divider.setAttribute('aria-valuemin',String(minSidebarWidth));
    divider.setAttribute('aria-valuemax',String(maxSidebarWidth()));
    divider.setAttribute('aria-valuenow',String(sidebarWidth()));
  }
  function resizeSidebar(width){
    const clamped=Math.max(minSidebarWidth,Math.min(maxSidebarWidth(),width));
    document.body.style.setProperty('--sidebar-width',clamped+'px');
    syncDivider();
  }
  let dragOffset=0;
  divider.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    dragOffset=sidebarWidth()-event.clientX;
    divider.setPointerCapture(event.pointerId);
    divider.classList.add('is-dragging');
  });
  divider.addEventListener('pointermove',event=>{
    if(divider.hasPointerCapture(event.pointerId))resizeSidebar(event.clientX+dragOffset);
  });
  divider.addEventListener('lostpointercapture',()=>divider.classList.remove('is-dragging'));
  divider.addEventListener('keydown',event=>{
    const widths={
      ArrowLeft:sidebarWidth()-16,ArrowRight:sidebarWidth()+16,
      Home:minSidebarWidth,End:maxSidebarWidth()
    };
    if(!Object.hasOwn(widths,event.key))return;
    event.preventDefault();
    resizeSidebar(widths[event.key]);
  });
  addEventListener('resize',syncDivider);
  syncDivider();
  const sidebarToggle=document.querySelector('.sidebar-toggle');
  sidebarToggle.addEventListener('click',()=>{
    const collapsed=document.body.classList.toggle('sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded',String(!collapsed));
    sidebarToggle.setAttribute('aria-label',collapsed?'展开项目导航':'收起项目导航');
    if(!collapsed)syncDivider();
  });
  const toggle=document.querySelector('.theme-toggle');
  function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';toggle.setAttribute('aria-pressed',String(dark));toggle.setAttribute('aria-label',dark?'切换浅色模式':'切换深色模式')}
  toggle.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('portfolio-theme',theme)}catch{}syncTheme()});
  syncTheme();render();
})();
