(() => {
  const main=document.querySelector('main');
  const names=['项目封面','项目背景','目标与策略','视觉规范与等级成长','签到与积分兑换','勋章与证书体系'];
  document.querySelectorAll('.board-shell').forEach((section,i)=>section.setAttribute('aria-label',names[i]||'项目设计'));
  function size(){
    document.querySelectorAll('.board').forEach(board=>board.style.transform=`scale(${board.parentElement.clientWidth/1920})`);
    parent.postMessage({type:'carbon-project-size',height:Math.ceil(main.getBoundingClientRect().height)},location.origin);
  }
  new ResizeObserver(size).observe(main);
  addEventListener('load',size);
  addEventListener('resize',size);
  if(document.fonts)document.fonts.ready.then(size);
  size();
})();
