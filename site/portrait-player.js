/* One persistent, opaque rendering surface: no animated img swaps or layered blend flashes. */
class PortraitPlayer {
  constructor(button, fallback, manifestUrl) {
    this.button = button;
    this.fallback = fallback;
    this.url = new URL(manifestUrl, document.baseURI);
    this.sheets = new Map();
    this.desiredOpen = false;
    this.state = 'idle';
    this.index = 0;
    this.elapsed = 0;
    this.lastTime = null;
    this.drawnKey = '';
    this.stats = {frames: 0, transitions: 0, loadingHolds: 0};
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'portrait-surface';
    this.canvas.hidden = true;
    this.canvas.setAttribute('aria-hidden', 'true');
    button.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d', {alpha: false});
    this.snapshot = document.createElement('canvas');
    this.snapshotContext = this.snapshot.getContext('2d', {alpha: false});
    this.ready = this.initialize();
    document.addEventListener('visibilitychange', () => { this.lastTime = null; });
  }

  async initialize() {
    try {
      const response = await fetch(this.url, {cache: 'no-cache'});
      if (!response.ok) throw new Error('Animation manifest unavailable');
      this.data = await response.json();
      this.canvas.width = this.snapshot.width = this.data.width;
      this.canvas.height = this.snapshot.height = this.data.height;
      if (this.desiredOpen) this.state = 'turning';
      const frame = this.currentFrame();
      await this.loadSheet(frame.sheet).promise;
      this.paintFrame(frame, 1);
      this.fallback.hidden = true;
      this.canvas.hidden = false;
      this.button.dataset.state = this.state;
      this.readyToPlay = true;
      this.prefetch();
      requestAnimationFrame(time => this.tick(time));
      return true;
    } catch (error) {
      this.button.dataset.state = 'unavailable';
      return false;
    }
  }

  frames() { return this.data.clips[this.state === 'turning' || this.state === 'returning' ? 'turn' : this.state].frames; }
  currentFrame() { return this.frames()[this.index]; }

  loadSheet(name) {
    if (this.sheets.has(name)) {
      const entry = this.sheets.get(name);
      entry.used = performance.now();
      return entry;
    }
    const entry = {image: null, used: performance.now(), error: false};
    const image = new Image();
    entry.promise = new Promise((resolve, reject) => {
      image.onload = async () => {
        try {
          await image.decode();
          entry.image = image;
          resolve(image);
          this.trimCache();
        } catch (error) { entry.error = true; reject(error); }
      };
      image.onerror = () => { entry.error = true; reject(new Error('Animation sheet unavailable')); };
      image.src = new URL(name, this.url).href;
    });
    // Keep the last painted frame if loading fails; never clear it to a blank frame.
    entry.promise.catch(() => {});
    this.sheets.set(name, entry);
    return entry;
  }

  trimCache() {
    const protectedNames = this.protectedSheets();
    const candidates = [...this.sheets].filter(([name, entry]) => entry.image && !protectedNames.has(name)).sort((a,b) => a[1].used - b[1].used);
    while (this.sheets.size > 6 && candidates.length) this.sheets.delete(candidates.shift()[0]);
  }

  protectedSheets() {
    const frames = this.frames();
    const step = this.state === 'returning' ? -1 : 1;
    const names = new Set([frames[this.index].sheet]);
    for (let offset = 1; offset <= 12; offset++) {
      const frame = frames[this.index + offset * step];
      if (frame) names.add(frame.sheet);
    }
    if (this.state === 'turning') names.add(this.data.clips.thinking.frames[0].sheet);
    if (this.state === 'returning') names.add(this.data.clips.idle.frames[0].sheet);
    if (this.state === 'idle') names.add(this.data.clips.turn.frames[0].sheet);
    if (this.state === 'thinking') names.add(this.data.clips.turn.frames.at(-1).sheet);
    return names;
  }

  prefetch() { for (const name of this.protectedSheets()) this.loadSheet(name); }

  paintFrame(frame, opacity) {
    const image = this.loadSheet(frame.sheet).image;
    if (!image) return false;
    this.ctx.globalAlpha = opacity;
    this.ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.stats.frames++;
    return true;
  }

  switchTo(state, index, blend = true) {
    if (blend) {
      this.snapshotContext.drawImage(this.canvas, 0, 0);
      this.transition = {elapsed: 0, duration: 160};
      this.stats.transitions++;
    } else this.transition = null;
    this.state = state;
    this.index = index;
    this.elapsed = 0;
    this.drawnKey = '';
    this.button.dataset.state = state;
    this.prefetch();
  }

  setOpen(open) {
    this.desiredOpen = open;
    if (!this.readyToPlay) return;
    if (open && this.state === 'idle') this.switchTo('turning', 0);
    else if (open && this.state === 'returning') this.switchTo('turning', this.index, false);
    else if (!open && this.state === 'thinking') this.switchTo('returning', this.data.clips.turn.frames.length - 1);
    else if (!open && this.state === 'turning') this.switchTo('returning', this.index, false);
  }

  advance() {
    const frames = this.frames();
    if (this.state === 'returning') {
      if (this.index > 0) this.index--;
      else this.switchTo(this.desiredOpen ? 'turning' : 'idle', 0);
    } else if (this.index < frames.length - 1) this.index++;
    else if (this.state === 'turning') this.switchTo(this.desiredOpen ? 'thinking' : 'returning', this.desiredOpen ? 0 : frames.length - 1);
    else this.switchTo(this.state, 0);
    this.prefetch();
  }

  tick(time) {
    const delta = this.lastTime === null ? 0 : Math.min(80, time - this.lastTime);
    this.lastTime = time;
    const frame = this.currentFrame();
    const entry = this.loadSheet(frame.sheet);
    if (!entry.image) {
      this.stats.loadingHolds++;
    } else if (this.transition) {
      this.transition.elapsed += delta;
      const t = Math.min(1, this.transition.elapsed / this.transition.duration);
      const ease = t * t * (3 - 2 * t);
      // Composite in pixel space, THEN apply the one background-blending operation.
      this.ctx.drawImage(this.snapshot, 0, 0);
      this.paintFrame(frame, ease);
      if (t === 1) { this.transition = null; this.drawnKey = `${this.state}:${this.index}`; }
    } else {
      const key = `${this.state}:${this.index}`;
      if (key !== this.drawnKey) {
        this.paintFrame(frame, 1);
        this.drawnKey = key;
      }
      this.elapsed += delta;
      if (this.elapsed >= frame.duration) {
        this.elapsed -= frame.duration;
        this.advance();
      }
    }
    requestAnimationFrame(next => this.tick(next));
  }
}
window.PortraitPlayer = PortraitPlayer;
