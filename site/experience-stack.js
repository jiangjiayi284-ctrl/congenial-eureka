/* Native-scroll pin and three-card stack. No wheel interception or scroll lock. */
(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  function poses(progress, travel) {
    const second = ease((progress - .10) / .34);
    const third = ease((progress - .55) / .34);
    return [
      {y: -16 * (second + third), scale: 1 - .03 * (second + third)},
      {y: travel * (1 - second) - 16 * third, scale: 1 - .03 * third},
      {y: travel * (1 - third), scale: 1}
    ];
  }
  // Exposed only as a pure geometry function for offline verification.
  window.experienceStackPoses = poses;
  const scene = document.querySelector('.experience-scene');
  if (!scene) return;
  const cards = [...scene.querySelectorAll('.experience')];
  const slot = scene.querySelector('.experience-cards');
  const stage = scene.querySelector('.experience-stage');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = false, distance = 1, cardTravel = 1, pinTop = 0, scheduled = false;
  let shownProgress = 0, lastFrameTime = null;
  function update(time) {
    scheduled = false;
    if (!enabled) return;
    const target = clamp((pinTop - scene.getBoundingClientRect().top) / distance);
    const dt = lastFrameTime === null || !Number.isFinite(time) ? 16.67 : Math.min(64, time - lastFrameTime);
    lastFrameTime = Number.isFinite(time) ? time : null;
    const amount = 1 - Math.exp(-dt / 75);
    shownProgress += (target - shownProgress) * amount;
    if (Math.abs(target - shownProgress) < .0004) shownProgress = target;
    const progress = shownProgress;
    poses(progress, cardTravel).forEach((pose, index) => {
      cards[index].style.setProperty('--stack-y', `${pose.y.toFixed(2)}px`);
      cards[index].style.setProperty('--stack-scale', pose.scale.toFixed(4));
    });
    scene.dataset.stackStep = progress < .44 ? 'meituan' : progress < .89 ? 'baidu' : 'meitu';
    if (shownProgress !== target) schedule();
    else lastFrameTime = null;
  }
  function schedule() {
    if (!scheduled && enabled) { scheduled = true; requestAnimationFrame(update); }
  }
  function layout() {
    enabled = !motion.matches && innerWidth > 900 && innerHeight >= 680;
    scene.classList.toggle('is-stacked', enabled);
    cards.forEach(card => { card.style.removeProperty('--stack-y'); card.style.removeProperty('--stack-scale'); });
    if (enabled) {
      distance = Math.round(innerHeight * 2.2);
      scene.style.setProperty('--stack-travel', `${distance}px`);
      pinTop = Math.max(0, innerHeight - stage.getBoundingClientRect().height);
      scene.style.setProperty('--stack-pin-top', `${pinTop}px`);
      cardTravel = slot.getBoundingClientRect().height + 180;
      // Text zoom or a short viewport must never clip an experience description.
      if (cards.some(card => card.scrollHeight > card.clientHeight + 1)) {
        enabled = false;
        scene.classList.remove('is-stacked');
        scene.style.removeProperty('--stack-travel');
        scene.style.removeProperty('--stack-pin-top');
        delete scene.dataset.stackStep;
        return;
      }
      shownProgress = clamp((pinTop - scene.getBoundingClientRect().top) / distance);
      lastFrameTime = null;
      update();
    } else {
      scene.style.removeProperty('--stack-travel');
      scene.style.removeProperty('--stack-pin-top');
      delete scene.dataset.stackStep;
    }
  }
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', layout);
  motion.addEventListener('change', layout);
  if (document.fonts) document.fonts.ready.then(layout);
  layout();
})();
