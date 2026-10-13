(() => {
  const track = document.getElementById('character-photo-track');
  if (track && window.COZ_CONTENT) {
    const tiles = window.COZ_CONTENT.backgroundPhotos;
    track.innerHTML = [0,1,2,3].map(column => {
      const photos = tiles.filter((number,index) => index%4 === column);
      const group = '<div class="photo-group">' + photos.map(number => '<img src="/assets/clients/client-' + String(number).padStart(2,'0') + '.jpg" alt="" width="640" height="640" decoding="async">').join('') + '</div>';
      return '<div class="photo-column" style="--photo-count:' + photos.length + '"><div class="photo-column-track ' + (column%2?'drift-down':'drift-up') + '">' + group + group + '</div></div>';
    }).join('');
  }
  const menu = document.querySelector('.service-menu');
  const button = menu?.querySelector('button');
  const panel = menu?.querySelector('.service-menu-panel');
  if (button && panel) {
    const close = () => { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); };
    const open = () => { panel.hidden = false; button.setAttribute('aria-expanded', 'true'); };
    button.addEventListener('click', () => {
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) { open(); return; }
      panel.hidden = !panel.hidden;
      button.setAttribute('aria-expanded', String(!panel.hidden));
    });
    menu.addEventListener('pointerenter', () => {
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) open();
    });
    menu.addEventListener('pointerleave', () => {
      if (matchMedia('(hover: hover) and (pointer: fine)').matches && !menu.contains(document.activeElement)) close();
    });
    document.addEventListener('click', event => { if (!menu.contains(event.target)) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) { close(); button.focus(); }
    });
    menu.addEventListener('focusout', event => { if (!menu.contains(event.relatedTarget)) close(); });
  }
  const search = document.getElementById('role-search');
  if (search) {
    const en = document.documentElement.lang === 'en';
    const rows = [...document.querySelectorAll('[data-role]')];
    const status = document.getElementById('role-count');
    const empty = document.getElementById('role-empty');
    const filter = () => {
      const query = search.value.trim().toLocaleLowerCase().normalize('NFKC');
      let count = 0;
      rows.forEach(row => {
        const text = row.textContent.toLocaleLowerCase().normalize('NFKC');
        row.hidden = !text.includes(query);
        if (!row.hidden) count++;
      });
      document.querySelectorAll('.role-group').forEach(group => {
        group.hidden = ![...group.querySelectorAll('[data-role]')].some(row => !row.hidden);
      });
      status.textContent = en ? `${count} characters` : `共 ${count} 筆角色`;
      empty.hidden = count > 0;
    };
    search.addEventListener('input', filter);
    filter();
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = document.querySelectorAll('.service-reveal');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    cards.forEach(card => { card.classList.add('pending'); observer.observe(card); });
    document.addEventListener('focusin', event => {
      const card = event.target.closest('.service-reveal');
      if (card) { card.classList.add('visible'); observer.unobserve(card); }
    });
    motion.addEventListener('change', event => {
      if (event.matches) { cards.forEach(card => card.classList.add('visible')); observer.disconnect(); }
    });
  }
})();
