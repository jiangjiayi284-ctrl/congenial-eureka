/* Draw the sidebar introduction once on page entry, like dragging out a frame. */
(() => {
  const root = document.documentElement;
  const intro = document.querySelector('.sidebar-intro');
  const copy = intro?.querySelector('.intro-copy');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!copy || motion.matches) {
    root.classList.remove('intro-draw-pending');
    return;
  }
  const drawing = document.createElement('div');
  drawing.className = 'intro-drawing';
  drawing.setAttribute('aria-hidden', 'true');
  drawing.innerHTML = `<div class="intro-draw-frame"><span class="intro-draw-size"></span></div><div class="intro-draw-pointer"><svg viewBox="0 0 32 38"><path d="M4 3 28 14 18 18 14 32Z"/></svg><span>姜佳仪</span></div>`;
  document.body.append(drawing);
  const frame = drawing.querySelector('.intro-draw-frame');
  const cursor = drawing.querySelector('.intro-draw-pointer');
  const size = drawing.querySelector('.intro-draw-size');
  let raf, start, finished = false;
  const ease = t => t * t * (3 - 2 * t);
  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    copy.style.removeProperty('clip-path');
    intro.classList.remove('is-drawing');
    root.classList.remove('intro-draw-pending');
    intro.dataset.introPhase = 'complete';
    drawing.remove();
    removeEventListener('resize', finish);
    motion.removeEventListener('change', finish);
  }
  function play() {
    if (finished) return;
    const box = copy.getBoundingClientRect();
    const parent = intro.getBoundingClientRect();
    Object.assign(drawing.style, {left:`${parent.left}px`, top:`${parent.top}px`, width:`${parent.width}px`, height:`${parent.height}px`});
    const left = box.left - parent.left - 8;
    const top = box.top - parent.top - 8;
    const width = box.width + 16, height = box.height + 16;
    const initial = Math.min(46, height);
    intro.classList.add('is-drawing');
    intro.dataset.introPhase = 'drawing';
    copy.style.clipPath = 'inset(0 100% 100% 0)';
    root.classList.remove('intro-draw-pending');
    function tick(now) {
      if (finished) return;
      start ??= now;
      const elapsed = now - start;
      const progress = ease(Math.max(0, Math.min(1, (elapsed - 450) / 1150)));
      const w = initial + (width - initial) * progress;
      const h = initial + (height - initial) * progress;
      Object.assign(frame.style, {left:`${left}px`, top:`${top}px`, width:`${w}px`, height:`${h}px`});
      // The original text stays at its final size while the drag reveals it.
      copy.style.clipPath = `inset(0 ${Math.max(0, width - w - 8)}px ${Math.max(0, height - h - 8)}px 0)`;
      size.textContent = `${Math.round(w)} × ${Math.round(h)}`;
      const arrive = ease(Math.min(1, elapsed / 300));
      cursor.style.transform = `translate(${left + w + (1 - arrive) * 22}px,${top + h + (1 - arrive) * 16}px)`;
      const opacity = elapsed < 120 ? elapsed / 120 : elapsed > 1800 ? Math.max(0, 1 - (elapsed - 1800) / 300) : 1;
      drawing.style.opacity = String(opacity);
      if (elapsed >= 2100) finish();
      else raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }
  addEventListener('resize', finish, {once:true});
  motion.addEventListener('change', finish, {once:true});
  // Wait for text metrics, not the large project artwork/iframe.
  (document.fonts?.ready || Promise.resolve()).then(play).catch(finish);
})();
