/* Five clicks on the navigation's Agent link mask page copy until refresh. */
(() => {
  const trigger = document.querySelector('.nav > a[href="#top"]');
  if (!trigger) return;
  let clicks = 0;
  const mask = text => text.replace(/\S/gu, '*');
  function maskContent(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (root.parentElement?.closest('script,style,noscript,textarea')) return;
      const next = mask(root.data);
      if (next !== root.data) root.data = next;
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE || root.matches('script,style,noscript,textarea')) return;
    if (root.hasAttribute('placeholder')) {
      const original = root.getAttribute('placeholder');
      const next = mask(original);
      if (next !== original) root.setAttribute('placeholder', next);
    }
    for (const child of root.childNodes) maskContent(child);
  }
  trigger.addEventListener('click', () => {
    if (++clicks !== 5) return;
    document.documentElement.classList.add('asterisk-mode');
    maskContent(document.body);
    // Also mask new chat replies, hints, and other copy added after activation.
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'childList') record.addedNodes.forEach(maskContent);
        else maskContent(record.target);
      }
    }).observe(document.body, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ['placeholder']
    });
  });
})();
