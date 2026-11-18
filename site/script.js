const portrait = document.querySelector('.portrait');
const hint = document.querySelector('.click-hint');
const portraitImage = portrait.querySelector('img');
const chat = document.querySelector('.chat-card');
chat.classList.remove('is-open');
chat.hidden = true;
chat.id = 'personal-agent';
portrait.setAttribute('aria-controls', chat.id);
portrait.setAttribute('aria-expanded', 'false');

portraitImage.style.cssText = 'width:100%;height:100%;object-fit:contain;object-position:center';
const compactPortrait = matchMedia('(max-width: 900px)').matches;
let portraitPlayer;
function getPortraitPlayer() {
  const manifest = compactPortrait ? 'mobile/manifest.json' : 'manifest.json';
  return portraitPlayer ??= new PortraitPlayer(portrait, portraitImage, 'assets/portrait-sequence/' + manifest);
}
if (!compactPortrait && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('load', getPortraitPlayer, {once: true});
}
function setAgentOpen(open) {
  chat.classList.toggle('is-open', open);
  chat.hidden = !open;
  portrait.setAttribute('aria-expanded', String(open));
  hint.textContent = open ? '再次点击人物收起' : '点击人物试试';
  if (open || portraitPlayer) getPortraitPlayer().setOpen(open);
}
portrait.addEventListener('click', () => setAgentOpen(!chat.classList.contains('is-open')));
chat.innerHTML = `<div class="agent-heading"><span>✦</span> 你可以问我<button class="agent-close" aria-label="关闭对话">×</button></div><div class="agent-messages" aria-live="polite"><div class="agent-suggestions"><button>你是谁</button><button>你擅长什么</button><button>有哪些代表项目</button></div></div><form class="agent-form"><input aria-label="输入问题" placeholder="输入消息…" autocomplete="off"><button aria-label="发送消息" type="submit">↑</button></form>`;
const messages = chat.querySelector('.agent-messages');
const welcome = document.createElement('p');
welcome.className = 'agent-bubble assistant';
welcome.textContent = '你好，我是姜佳仪的 AI 助手。你可以问我她的设计经历、代表项目，以及 AI coding 和 AIGC 实践。';
messages.prepend(welcome);
['用一分钟介绍姜佳仪', '她有哪些有成果的设计项目？', '她如何把 AI 用在设计中？'].forEach((question, index) => {
  chat.querySelectorAll('.agent-suggestions button')[index].textContent = question;
});
const input = chat.querySelector('input');
chat.querySelector('.agent-form button').innerHTML = '<img src="assets/agent-send.svg" alt="">';
// Drag by the header and resize from any corner without interfering with chat controls.
const heading = chat.querySelector('.agent-heading');
function beginCardGesture(event, corner) {
  if (event.button !== 0 || (!corner && event.target.closest('button'))) return;
  event.preventDefault();
  const rect = chat.getBoundingClientRect();
  const startX = event.clientX, startY = event.clientY;
  const minWidth = Math.min(260, window.innerWidth - 24);
  const minHeight = 260;
  Object.assign(chat.style, { position:'fixed', left:`${rect.left}px`, top:`${rect.top}px`, right:'auto', transform:'none', width:`${rect.width}px`, height:`${rect.height}px`, minWidth:'0', maxWidth:'none', margin:'0' });
  // Fixed positioning must not be anchored to the animated hero's transform.
  document.body.appendChild(chat);
  const handle = event.currentTarget;
  handle.setPointerCapture(event.pointerId);
  function move(e) {
    const dx = e.clientX - startX, dy = e.clientY - startY;
    let left = rect.left, top = rect.top, width = rect.width, height = rect.height;
    if (!corner) {
      left = Math.max(0, Math.min(window.innerWidth - width, left + dx));
      top = Math.max(0, Math.min(window.innerHeight - 48, top + dy));
    } else {
      const west = corner.includes('w'), north = corner.includes('n');
      width = Math.max(minWidth, Math.min(west ? rect.right : window.innerWidth - rect.left, rect.width + (west ? -dx : dx)));
      height = Math.max(minHeight, Math.min(north ? rect.bottom : window.innerHeight - rect.top, rect.height + (north ? -dy : dy)));
      if (west) left = rect.right - width;
      if (north) top = rect.bottom - height;
    }
    Object.assign(chat.style, {left:`${left}px`,top:`${top}px`,width:`${width}px`,height:`${height}px`});
  }
  function end() {
    handle.removeEventListener('pointermove', move);
    handle.removeEventListener('pointerup', end);
    handle.removeEventListener('pointercancel', end);
  }
  handle.addEventListener('pointermove', move);
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}
heading.addEventListener('pointerdown', event => beginCardGesture(event, null));
for (const corner of ['nw','ne','sw','se']) {
  const grip = document.createElement('span');
  grip.className = `agent-resize ${corner}`;
  grip.title = '拖动调整会话大小';
  chat.appendChild(grip);
  grip.addEventListener('pointerdown', event => beginCardGesture(event, corner));
}
function answer(question) {
  if (/联系|微信|电话|邮箱/.test(question)) return '你可以通过微信或电话 18312476074 联系我，也可以发邮件到 3030798973@qq.com。';
  if (/项目|作品|案例/.test(question)) return '我的项目包括美团碳账户升级、员工公益年度报告、百度项目合集、美图设计合集、半区 APP 全链路升级和 YUMI IP 设计。你可以在下方「我的项目」中查看。';
  if (/擅长|能力|技能|工具/.test(question)) return '我擅长产品 UI 设计、全链路体验优化、设计规范与组件库，也关注 AI coding。我的工作涉及公益产品、办公效率产品，以及品牌传播和平面设计。';
  if (/经历|工作|美团/.test(question)) return '我从 2025 年 7 月起在美团担任产品 UI 设计师，参与公益产品的设计与改版，随后参与办公效率产品、组件库和亮暗模式设计规范，也参与过飞象视频会议从需求到上线的过程。';
  if (/谁|介绍|毕业|学校|名字/.test(question)) return '你好，我是姜佳仪，毕业于福州大学，目前在美团担任产品设计师。我喜欢打造能帮助他人更好地做事的工具。';
  return '我目前可以根据官网资料介绍姜佳仪的个人背景、设计能力、工作经历、代表项目和联系方式。你可以试着问「你的工作经历是什么？」';
}
const conversation = [];
let sending = false;
async function send(question) {
  const text = question.trim();
  if (!text || sending) return;
  if (text.length > 4000) { input.setCustomValidity('请输入 4000 字以内的问题'); input.reportValidity(); return; }
  input.setCustomValidity('');
  sending = true;
  const controls = chat.querySelectorAll('.agent-form button, .agent-suggestions button');
  controls.forEach(button => button.disabled = true);
  let reply;
  for (const [role, content] of [['user', text], ['assistant', '正在思考…']]) {
    const bubble = document.createElement('p');
    bubble.className = `agent-bubble ${role}`;
    bubble.textContent = content;
    messages.appendChild(bubble);
    if (role === 'assistant') reply = bubble;
  }
  input.value = '';
  messages.scrollTop = messages.scrollHeight;
  const pending = [...conversation.slice(-18), {role:'user', content:text}];
  try {
    const response = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({messages:pending}), signal:AbortSignal.timeout(55000)});
    const data = await response.json();
    if (!response.ok || !data.answer) throw new Error(data.error || '暂时无法连接 AI 服务，请稍后重试。');
    reply.textContent = data.answer;
    conversation.push({role:'user',content:text}, {role:'assistant',content:data.answer});
    if (conversation.length > 20) conversation.splice(0, conversation.length - 20);
  } catch (error) {
    reply.textContent = error.name === 'TimeoutError' ? '回复超时，请稍后再试。' : error.message;
    input.value = text;
  } finally {
    sending = false;
    controls.forEach(button => button.disabled = false);
    messages.scrollTop = messages.scrollHeight;
  }
}
chat.querySelectorAll('.agent-suggestions button').forEach(button => button.addEventListener('click', () => send(button.textContent)));
chat.querySelector('form').addEventListener('submit', event => { event.preventDefault(); send(input.value); });
chat.querySelector('.agent-close').addEventListener('click', () => { setAgentOpen(false); portrait.focus(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && chat.classList.contains('is-open')) chat.querySelector('.agent-close').click(); });

portraitImage.addEventListener('animationend', (event) => {
  if (event.animationName === 'hero-settle') portrait.classList.add('is-ready');
});

const revealGroups = [
  '.about > h2',
  '.bio',
  '.tools',
  '.work > h2',
  '.work-grid article',
  'footer h2',
  'footer .contact-qr',
  'footer p'
];

const revealItems = [...document.querySelectorAll(revealGroups.join(','))];
revealItems.forEach((item) => item.setAttribute('data-reveal', ''));

document.querySelectorAll('.work-grid article').forEach((item, index) => {
  item.style.setProperty('--i', index % 2);
});

document.querySelectorAll('footer [data-reveal]').forEach((item, index) => {
  item.style.setProperty('--i', Math.min(index, 3));
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-in'));
}
