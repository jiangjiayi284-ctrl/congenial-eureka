/* Return only after the experience stack has established the final page height. */
(() => {
  const root=document.documentElement;
  if(!root.classList.contains('project-return-pending'))return;
  const ready=document.readyState==='loading'?new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true})):Promise.resolve();
  Promise.all([ready,document.fonts?.ready||Promise.resolve()]).then(()=>{
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const work=document.querySelector('#work');
      if(work){
        const nav=document.querySelector('header.nav');
        const offset=(nav?.getBoundingClientRect().height||76)+24;
        work.querySelectorAll('[data-reveal]').forEach(item=>{item.style.transition='none';item.classList.add('is-in')});
        scrollTo({top:Math.max(0,scrollY+work.getBoundingClientRect().top-offset),behavior:'instant'});
      }
      root.classList.remove('project-return-pending');
    }));
  });
})();
