(() => {
  const ids = ['1:98', '1:99', '1:104', '1:95', '1:96', '1:97'];
  const cards = ids.map(id => document.querySelector(`[data-node-id="${id}"]`));
  const tagIds = ['1:105', '1:106', '1:107', '1:108'];
  const tags = tagIds.map(id => document.querySelector(`[data-node-id="${id}"]`));
  if (cards.some(card => !card)) return;
  const tagOrigins = tags.map(tag => ({left: tag.offsetLeft, top: tag.offsetTop}));
  const label = tags[1].querySelector('p');
  let active = 2;
  const select = index => {
    active = index;
    // All six cards share the same 120–1800 design-space bounds.
    const smallWidth = 220;
    const largeWidth = 449;
    const gap = (1680 - largeWidth - smallWidth * 5) / 5;
    let left = 120;
    let selectedLeft = 120;
    cards.forEach((card, i) => {
      const selected = i === index;
      const width = selected ? largeWidth : smallWidth;
      if (selected) selectedLeft = left;
      card.style.left = `${left}px`;
      left += width + gap;
      card.style.top = `${selected ? 2539.77 : 2766.77}px`;
      card.style.width = `${width}px`;
      card.style.height = `${selected ? 904 : 362}px`;
      card.style.border = selected ? '12px solid white' : '0 solid transparent';
      card.style.borderRadius = '28px';
      card.style.zIndex = selected ? '5' : '1';
      card.setAttribute('aria-pressed', String(selected));
      const crop = card.firstElementChild;
      crop.style.cssText = 'position:absolute;inset:0;overflow:hidden;border-radius:16px';
      const image = crop.querySelector('img');
      image.style.width = '100%';
      image.style.height = 'auto';
      image.style.top = '0';
      image.style.left = '0';
    });
    const delta = Math.min(selectedLeft - 580, 1800 - 1094);
    tags.forEach((tag, i) => {
      tag.getAnimations().forEach(animation => animation.cancel());
      tag.style.left = `${tagOrigins[i].left + delta}px`;
      tag.style.top = `${tagOrigins[i].top}px`;
      tag.style.zIndex = '6';
    });
    label.textContent = `等级LV${index + 1}`;
    tags.forEach(tag => tag.animate([
      { opacity: 0, scale: '0.55', translate: '0 16px' },
      { opacity: 1, scale: '1.12', translate: '0 -4px', offset: 0.7 },
      { opacity: 1, scale: '1', translate: '0 0' }
    ], { duration: 340, easing: 'ease-out' }));
  };
  cards.forEach((card, index) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `查看等级LV${index + 1}`);
    card.setAttribute('aria-pressed', String(index === active));
    card.style.cursor = 'pointer';
    card.style.transition = 'left 320ms ease,top 320ms ease,width 320ms ease,height 320ms ease,border-width 320ms ease';
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && active !== index) select(index);
    });
    card.addEventListener('focus', () => { if (active !== index) select(index); });
    card.addEventListener('click', () => select(index));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(index); }
    });
  });
  tags.forEach(tag => { tag.style.pointerEvents = 'none'; tag.style.transition = 'none'; tag.style.transformOrigin = 'center'; });
  select(active);
})();
