(async () => {
  await window.COZ_ROLES_READY;
  const track = document.getElementById('service-photo-track');
  if (track && window.COZ_CONTENT) {
    const tiles = window.COZ_CONTENT.serviceBackgroundPhotos || [];
    track.innerHTML = [0,1,2,3].map(column => {
      const photos = tiles.filter((number,index) => index%4 === column);
      const group = '<div class="photo-group">' + photos.map(path => '<img src="' + path + '" alt="" width="640" height="640" decoding="async">').join('') + '</div>';
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
  document.querySelectorAll('details.role-group').forEach(group => {
    const desktopHover = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
    const close = () => {
      if (!search?.value.trim() && !group.contains(document.activeElement)) group.open = false;
    };
    group.addEventListener('pointerenter', () => { if (desktopHover()) group.open = true; });
    group.addEventListener('pointerleave', () => { if (desktopHover()) close(); });
    group.addEventListener('focusout', event => {
      if (!group.contains(event.relatedTarget) && !group.matches(':hover')) close();
    });
    group.addEventListener('keydown', event => {
      if (event.key === 'Escape' && group.open) {
        group.querySelector('summary').focus();
        group.open = false;
        event.preventDefault();
      }
    });
  });
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
        const matches = [...group.querySelectorAll('[data-role]')].filter(row => !row.hidden).length;
        group.hidden = matches === 0;
        if (group.tagName === 'DETAILS') group.open = !!query && matches > 0;
        const countLabel = group.querySelector('.work-count');
        if (countLabel) countLabel.textContent = en ? `${matches} characters` : `${matches} 位角色`;
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
