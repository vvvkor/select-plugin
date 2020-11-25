class Select{
  
  items = [];
  cur = -1; //index
  handler = null;
  
  constructor(input, opt) {
    opt = opt ?? {}
    opt = {value: input.value, ...input.dataset, ...opt}; // last overrides first
    this.input = input;
    const el = document.createElement('div');
    el.className = 'select';
    this.el = el;
    this.input.hidden = true;
    this.input.parentNode.insertBefore(el, this.input.nextSibling);

    this.overlay = el.appendChild(document.createElement('div'));
    this.list = el.appendChild(document.createElement('ul'));
    this.item = el.appendChild(document.createElement('span'));
    this.label = el.appendChild(document.createElement('label'));
    this.icon = el.appendChild(document.createElement('b'));

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
    el.addEventListener('click', e => this.onClick(e), false);
    window.addEventListener('keyup', e => this.onKey(e), false);
  }
  
  fill(items) {
    this.items = items.map(v => ({
      id: v.value ?? v.id,
      title: v.title ?? v.name
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
    this.toggle();
  }
  
  onKey(e) {
    if (e.key == 'Escape' && this.isOpen()) {
      this.clear();
      this.toggle(false);
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
    this.list.querySelectorAll('li').forEach(el => el.classList[filled && el.dataset.id == this.items[i].id ? 'add' : 'remove']('selected'));
    if (this.handler) this.handler({item: this.get(), target: this});
  }
  
  clear() {
    this.set(null);
  }
  
  get() {
    return this.cur > -1 ? this.items[this.cur] : null;
  }
  
  toggle(on) {
    on = on ?? !this.isOpen();
    this.el.classList[on ? 'add' : 'remove']('open');
  }
  
  open() {
    this.toggle(true);
  }
  
  close() {
    this.toggle(false);
  }
  
  destroy() {
    this.input.hidden = false;
    this.el.parentNode.removeChild(this.el);
  }
  
}