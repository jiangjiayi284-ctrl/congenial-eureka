/* Page integration. Animation is the original scoped boknows engine. */
(() => {
  // Asset pairs belong to positions, including repeated J and I characters.
  const config=text=>({...window.PERSONAL_LETTER_CONFIG,text,imagesByPosition:window.PERSONAL_LETTER_CONFIG?.imagesByPosition||[],enterDuration:340,exitDuration:620});
  const footer=document.querySelector('footer h2');
  createBoknowsLetters(footer,config(footer.textContent));
  const root=document.documentElement;
  if(!root.classList.contains('letter-intro-pending'))return;
  const overlay=document.createElement('div');overlay.className='letter-opening';
  overlay.setAttribute('role','dialog');overlay.setAttribute('aria-label','姜佳仪个人官网开场');
  const title=document.createElement('div');title.className='letter-opening-title';title.textContent='JIANGJIYI WORK';
  const skip=document.createElement('button');skip.className='letter-opening-skip';skip.textContent='跳过开场';
  overlay.append(title,skip);document.body.append(overlay);
  const main=document.querySelector('main');main.inert=true;
  let finished=false,engine;
  const finish=()=>{if(finished)return;finished=true;engine?.destroy();main.inert=false;root.classList.remove('letter-intro-pending');overlay.classList.add('is-finished');setTimeout(()=>overlay.remove(),650);document.removeEventListener('keydown',escape);};
  const escape=event=>{if(event.key==='Escape')finish();};
  skip.addEventListener('click',finish);document.addEventListener('keydown',escape);
  window.scrollTo({top:0,left:0,behavior:'instant'});
  engine=createBoknowsLetters(title,config(title.textContent),{intro:true,onDone:finish});
  setTimeout(finish,6000);
})();
