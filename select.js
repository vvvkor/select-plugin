class Select{
  
  items = [];
  cur = -1; //index
  handler = null;
  focused = false;
  actual = null;
  
  constructor(input, opt) {
    opt = opt ?? {}
    opt = {value: input.value, ...input.dataset, ...opt}; // last overrides first
    this.input = input;
    const el = document.createElement('div');
    el.className = 'select';
    el.tabIndex = "0";
    this.el = el;
    this.input.hidden = true;
    this.input.parentNode.insertBefore(el, this.input.nextSibling);

    //this.overlay = el.appendChild(document.createElement('div'));
    this.list = el.appendChild(document.createElement('ul'));
    this.item = el.appendChild(document.createElement('span'));
    this.label = el.appendChild(document.createElement('label'));
    this.icon = el.appendChild(document.createElement('b'));
    this.cross = el.appendChild(document.createElement('a'));

    this.label.textContent = opt.label ?? '';
    //this.toggle(false);
    if (opt.items) {
      this.fill(opt.items);
      this.set(opt.value);
    }
    else if (opt.src) {
      fetch(opt.src)
        .then(r => r.json())
        .then(r => this.fill(r))
        .then(() => this.set(opt.value))
    }
    else if (input.options) {
      this.fill(input.options);
      this.set(input.value)
    }
    el.addEventListener('focus', e => this.focused = true, false);
    el.addEventListener('blur', e => { this.focused = false; this.close(); }, false);
    el.addEventListener('click', e => this.onClick(e), false);
    document.addEventListener('click', e => e.defaultPrevented || el.contains(e.target) ? null : this.close(), false);
    window.addEventListener('keydown', e => this.onKey(e), false);
  }
  
  fill(items) {
    this.items = Array.prototype.slice.call(items).map(v => ({
      id: v.value ?? v.id,
      title: v.label ?? v.title ?? v.name
    }));
    this.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.title;
      li.dataset.id = item.id;
      this.list.appendChild(li);
    });
  }
  
  handle(h) {
    this.handler = h;
  }
  
  onClick(e) {
    if (e.target.closest('li')) this.set(e.target.dataset.id);
    else if (e.target.closest('a')) this.clear();
    this.toggle();
  }
  
  onKey(e) {
    if (this.isOpen()) {
      if (e.key == 'Delete' || e.key == 'Backspace') {
        this.clear();
        this.toggle(false);
      }
      if (e.key == 'Escape') {
        this.toggle(false);
      }
    }
    if (this.focused) {
      if (this.isOpen()){
        if(e.key.match(/^(Enter|Arrow|Page|Home|End)/)) e.preventDefault();
        if (e.key == 'Enter'){
          this.set(this.actual.dataset.id);
          this.close();
        }
        else if (e.key == 'ArrowDown') this.step('n');
        else if (e.key == 'ArrowUp') this.step('p');
        else if (e.key == 'Home' || e.key == 'PageUp') this.step('f');
        else if (e.key == 'End' || e.key == 'PageDown') this.step('l');
      }
      else {
        if(e.key.match(/^Arrow/)) e.preventDefault();
        if (e.key == 'ArrowDown' || e.key == 'ArrowUp'){
          this.open();
          if (!this.actual) this.step(e.key == 'ArrowDown' ? 'f' : 'l');
        }
      }
    }
  }
  
  isOpen() {
    return this.el.classList.contains('open');
  }
  
  set(v) {
    const i = (v === null)
      ? -1
      : this.items.findIndex(item => item.id == v);
    this.cur = i;
    const filled = (i > -1);
    this.el.classList[filled ? 'add' : 'remove']('selected');
    this.item.textContent = filled ? this.items[i].title : '';
    this.input.value = filled ? this.items[i].id : '';
    this.actuate();
    if (this.handler) this.handler({item: this.get(), target: this});
  }
  
  clear() {
    this.set(null);
  }
  
  get() {
    return this.cur > -1 ? this.items[this.cur] : null;
  }
  
  toggle(on) {
    this.actuate();
    on = on ?? !this.isOpen();
    this.el.classList[on ? 'add' : 'remove']('open');
  }
  
  open() {
    this.toggle(true);
  }
  
  close() {
    this.toggle(false);
  }
  
  actuate() {
    this.actual = null;
    this.list.querySelectorAll('li').forEach(el => {
      const act = (this.cur > -1 && el.dataset.id == this.items[this.cur].id);
      if (act) this.actual = el;
      el.classList[act ? 'add' : 'remove']('selected');
      el.classList[act ? 'add' : 'remove']('actual');
    });
  }
  
  step(x) {
    const p = {
      f: [false, 'firstChild'],
      p: [true, 'previousElementSibling', 'l'],
      n: [true, 'nextElementSibling', 'f'],
      l: [false, 'lastChild'],
      }
    if (p[x][0] && !this.actual) x = p[x][2];
    const rel = (p[x][0] && this.actual) ? this.actual : this.list;
    const n = p[x] ? rel[p[x][1]] : null;
    if(n){
      if(this.actual) this.actual.classList.remove('actual');
      this.actual = n;
      this.actual.classList.add('actual');
      this.actual.scrollIntoView();
    }
  }
  
  destroy() {
    this.input.hidden = false;
    this.el.parentNode.removeChild(this.el);
  }
  
}