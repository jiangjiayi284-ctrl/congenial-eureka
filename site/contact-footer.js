(() => {
  const host=document.querySelector('.footer-character');
  const strip=document.querySelector('.contact-strip');
  if(!host||!strip)return;
  host.innerHTML=`<svg viewBox="520 20 480 270" xmlns="http://www.w3.org/2000/svg" aria-label="戴眼镜的白色角色，眼睛会跟随鼠标">
    <defs><clipPath id="footer-left-eye"><path d="M588 141 Q636 102 691 139 Q707 155 696 151 Q677 146 659 158 Q622 179 588 141Z"/></clipPath><clipPath id="footer-right-eye"><path d="M925 141 Q877 102 822 139 Q806 155 817 151 Q836 146 854 158 Q891 179 925 141Z"/></clipPath></defs><g class="footer-face-scene">
    <path fill="var(--bg, #fafafa)" d="M587 93 624 84 649 49 637 83 685 82 694 62 690 82 754 82 751 60 763 82 865 84 862 50 886 86 924 94C938 135 942 166 950 210C959 242 944 259 931 250C918 244 916 227 925 231C932 235 925 244 922 242C926 227 939 224 939 240C943 250 923 260 915 290H621C634 270 643 251 629 239C617 228 603 231 600 241C595 251 601 250 606 243C614 254 595 258 582 250C560 240 562 217 565 195C569 162 578 123 587 93Z"/>
    <g class="footer-eyes" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M588 141 Q636 102 691 139 Q707 155 696 151 Q677 146 659 158 Q622 179 588 141Z"/>
      <path d="M925 141 Q877 102 822 139 Q806 155 817 151 Q836 146 854 158 Q891 179 925 141Z"/>
      <g clip-path="url(#footer-left-eye)"><circle class="footer-pupil" cx="650" cy="135" r="20" fill="#000" stroke="none"/></g>
      <g clip-path="url(#footer-right-eye)"><circle class="footer-pupil" cx="864" cy="135" r="20" fill="#000" stroke="none"/></g>
    </g>
    <g fill="#000"><circle cx="749" cy="173" r="3.2"/><circle cx="762" cy="173" r="3.2"/></g>
    <path d="M743 194Q756 202 769 194" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>
    </g><g class="glasses" role="button" tabindex="0" aria-label="拖动眼镜，松开弹回；也可使用方向键移动">
      <rect x="535" y="89" width="445" height="120" fill="transparent"/>
      <g fill="none" stroke="#efff54" stroke-width="2.5"><path d="M566 107C531 117 535 153 572 175"/><path d="M947 107C982 117 978 153 941 175"/></g>
      <g class="glasses-rim" fill="none" stroke="#000" stroke-width="13" stroke-linejoin="round"><path d="M568 105C617 91 689 99 719 126C749 155 702 198 650 198C601 198 569 174 563 149"/><path d="M945 105C896 91 824 99 794 126C764 155 811 198 863 198C912 198 944 174 950 149"/><path d="M724 140Q756 124 789 140"/></g>
      <g fill="none" stroke="#000" stroke-width="2"><path d="M714 152q-13 0-20 15m18-8-15 12m101-19q13 0 20 15m-18-8 15 12"/></g>
    </g>
  </svg>`;
  const svg=host.querySelector('svg'),glasses=host.querySelector('.glasses'),eyes=host.querySelector('.footer-eyes');
  const pupils=[...host.querySelectorAll('.footer-pupil')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let dragging=false,start=null,x=0,y=0,vx=0,vy=0,frame=0;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const point=e=>{const m=svg.getScreenCTM();return m?new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse()):new DOMPoint(750,142)};
  function paint(){
    const distance=Math.hypot(x,y);
    glasses.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${clamp(x*.08,-14,14).toFixed(2)} 756 145)`);
    strip.style.setProperty('--contact-blur',`${clamp((distance-3)/12,0,10).toFixed(2)}px`);
    strip.classList.toggle('is-glasses-offset',distance>3);
  }
  function settle(){
    frame=0;if(dragging)return;
    if(reduced.matches){x=y=vx=vy=0;paint();return}
    vx=(vx-x*.13)*.72;vy=(vy-y*.13)*.72;x+=vx;y+=vy;paint();
    if(Math.abs(x)+Math.abs(y)+Math.abs(vx)+Math.abs(vy)>.08)frame=requestAnimationFrame(settle);
    else{x=y=vx=vy=0;paint()}
  }
  function release(){if(!dragging)return;dragging=false;glasses.classList.remove('is-dragging');if(!frame)frame=requestAnimationFrame(settle)}
  glasses.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();cancelAnimationFrame(frame);frame=0;dragging=true;const p=point(e);start={x:p.x-x,y:p.y-y};glasses.classList.add('is-dragging');glasses.setPointerCapture(e.pointerId)});
  strip.addEventListener('pointermove',e=>{
    const p=point(e);
    pupils.forEach((pupil,i)=>pupil.setAttribute('transform',`translate(${clamp((p.x-(i?864:650))/18,-12,12).toFixed(2)} ${clamp((p.y-140)/20,-8,8).toFixed(2)})`));
    if(dragging){x=clamp(p.x-start.x,-180,180);y=clamp(p.y-start.y,-110,110);vx=vy=0;paint()}
  });
  glasses.addEventListener('pointerup',release);glasses.addEventListener('pointercancel',release);glasses.addEventListener('lostpointercapture',release);
  strip.addEventListener('pointerleave',()=>{if(!dragging)pupils.forEach(p=>p.removeAttribute('transform'))});
  glasses.addEventListener('keydown',e=>{const move={ArrowLeft:[-90,0],ArrowRight:[90,0],ArrowUp:[0,-65],ArrowDown:[0,65]}[e.key];if(move){e.preventDefault();cancelAnimationFrame(frame);x=move[0];y=move[1];paint();frame=requestAnimationFrame(settle)}if(e.key==='Escape'){x=y=vx=vy=0;paint()}});
  setInterval(()=>{if(reduced.matches||document.hidden||dragging||host.getBoundingClientRect().top>innerHeight)return;eyes.classList.remove('is-blinking');void eyes.getBoundingClientRect();eyes.classList.add('is-blinking')},6200);
})();
