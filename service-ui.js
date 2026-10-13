(() => {
  const menu = document.querySelector('.service-menu');
  const button = menu?.querySelector('button');
  const panel = menu?.querySelector('.service-menu-panel');
  if (button && panel) {
    const close = () => { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); };
    button.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      button.setAttribute('aria-expanded', String(!panel.hidden));
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
