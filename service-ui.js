(async () => {
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('is-page-hidden', document.hidden);
  });
  let navigationTimer;
  const resetNavigation = () => {
    clearTimeout(navigationTimer);
    document.body.classList.remove('is-navigating');
  };
  window.addEventListener('pageshow', resetNavigation);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button !== undefined && event.button !== 0)) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || (destination.pathname === location.pathname && destination.search === location.search)) return;
    document.body.classList.add('is-navigating');
    clearTimeout(navigationTimer);
    navigationTimer = setTimeout(resetNavigation, 15000);
  });
  const header = document.querySelector('.header');
  const actions = header?.querySelector('.header-actions');
  if (actions) {
    const english = document.documentElement.lang === 'en';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'language-toggle mobile-nav-toggle';
    toggle.textContent = english ? 'Menu' : '選單';
    actions.id = 'header-navigation';
    toggle.setAttribute('aria-controls', actions.id);
    toggle.setAttribute('aria-expanded', 'false');
    header.classList.add('has-mobile-nav');
    const controls = document.createElement('div');
    controls.className = 'header-controls';
    const language = actions.querySelector(':scope > .language-toggle:not(.news-nav)');
    header.insertBefore(controls, actions);
    controls.append(toggle, actions);
    if (language) {
      language.classList.add('header-language');
      language.classList.toggle('is-english', english);
      language.innerHTML = '<span class="language-option language-zh" aria-hidden="true">中</span><span class="language-option language-en" aria-hidden="true">EN</span>';
      language.setAttribute('aria-label', english ? '切換為中文' : 'Switch to English');
      language.title = english ? '切換為中文' : 'Switch to English';
      let switching = false;
      language.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button !== undefined && event.button !== 0)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (language.id === 'language-toggle' && window.COZ_SWITCH_LANGUAGE) {
          window.COZ_SWITCH_LANGUAGE();
          closeNavigation();
          return;
        }
        if (switching) return;
        switching = true;
        language.classList.toggle('is-english', !english);
        language.classList.add('is-switching');
        const destination = language.getAttribute('href') || (english ? '/' : '/en.html');
        setTimeout(() => location.assign(destination), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
      }, { capture: true });
      controls.append(language);
      window.addEventListener('pageshow', () => {
        switching = false;
        language.classList.remove('is-switching');
        language.classList.toggle('is-english', document.documentElement.lang === 'en');
      });
    }
    const closeNavigation = () => {
      header.classList.remove('mobile-nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      const services = actions.querySelector('.service-menu-panel');
      if (services) services.hidden = true;
      actions.querySelector('.service-menu-toggle')?.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      if (header.classList.contains('mobile-nav-open')) {
        closeNavigation();
      } else {
        header.classList.add('mobile-nav-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) closeNavigation();
    });
    header.addEventListener('keydown', event => {
      if (event.key === 'Escape' && header.classList.contains('mobile-nav-open')) {
        closeNavigation();
        toggle.focus();
      }
    });
    header.addEventListener('focusout', event => {
      if (!header.contains(event.relatedTarget)) closeNavigation();
    });
    matchMedia('(max-width: 720px)').addEventListener('change', event => {
      if (event.matches && actions.contains(document.activeElement)) toggle.focus();
      if (!event.matches && document.activeElement === toggle) (language || header.querySelector('.info-home'))?.focus();
      closeNavigation();
    });
  }
  const track = document.getElementById('service-photo-track');
  if (track && window.COZ_CONTENT) {
    const tiles = window.COZ_CONTENT.serviceBackgroundPhotos || [];
    track.innerHTML = [0,1,2,3].map(column => {
      const photos = tiles.filter((number,index) => index%4 === column);
      const group = '<div class="photo-group">' + photos.map(path => '<img src="' + path + '" alt="" width="640" height="640" decoding="async">').join('') + '</div>';
      return '<div class="photo-column" style="--photo-count:' + photos.length + '"><div class="photo-column-track ' + (column%2?'drift-down':'drift-up') + '">' + group + group + '</div></div>';
    }).join('');
  }
  // Align both buttons after header reparenting; hovering never pauses their clocks.
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => {
    const start = document.timeline.currentTime;
    document.querySelectorAll('.news-nav,.service-menu-toggle').forEach(element => {
      element.getAnimations().filter(animation => animation.animationName === 'nav-green-cycle').forEach(animation => { animation.startTime = start; });
    });
  });
  const menu = document.querySelector('.service-menu');
  const button = menu?.querySelector('button');
  const panel = menu?.querySelector('.service-menu-panel');
  if (button && panel) {
    let closeTimer;
    const open = () => { clearTimeout(closeTimer); panel.hidden = false; button.setAttribute('aria-expanded', 'true'); };
    const close = () => { clearTimeout(closeTimer); panel.hidden = true; button.setAttribute('aria-expanded', 'false'); };
    button.addEventListener('click', event => {
      if (event.detail > 0 && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        open();
      } else if (panel.hidden) { open(); }
      else close();
    });
    menu.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && matchMedia('(hover: hover) and (pointer: fine)').matches) open();
    });
    menu.addEventListener('pointerleave', () => {
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) closeTimer = setTimeout(close, 180);
    });
    document.addEventListener('click', event => { if (!menu.contains(event.target)) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) { close(); button.focus(); }
    });
    menu.addEventListener('focusout', event => { if (!menu.contains(event.relatedTarget)) close(); });
  }
  const search = document.getElementById('role-search');
  document.querySelectorAll('details.role-group').forEach(group => {
    // Native summary clicks control expansion, avoiding layout shifts on hover.
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
    const status = document.getElementById('role-count');
    const empty = document.getElementById('role-empty');
    const filter = event => {
      const rows = [...document.querySelectorAll('[data-role]')];
      const query = search.value.trim().toLocaleLowerCase().normalize('NFKC');
      let count = 0;
      rows.forEach(row => {
        const text = row.dataset.searchText || (row.dataset.searchText = row.textContent.toLocaleLowerCase().normalize('NFKC'));
        row.hidden = !text.includes(query);
        if (!row.hidden) count++;
      });
      document.querySelectorAll('.role-group').forEach(group => {
        const matches = [...group.querySelectorAll('[data-role]')].filter(row => !row.hidden).length;
        group.hidden = matches === 0;
        if (group.tagName === 'DETAILS' && (query || event?.type === 'input')) group.open = !!query && matches > 0;
        const countLabel = group.querySelector('.work-count');
        if (countLabel) countLabel.textContent = en ? `${matches} characters` : `${matches} 位角色`;
      });
      status.textContent = en ? `${count} characters` : `共 ${count} 筆角色`;
      empty.hidden = count > 0;
    };
    search.addEventListener('input', filter);
    window.COZ_ROLES_READY?.then(filter);
    filter();
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    window.COZ_OBSERVE_REVEALS = () => {
      if (motion.matches) return;
      document.querySelectorAll('.service-reveal').forEach(card => {
        if (card.classList.contains('pending') || card.classList.contains('visible')) return;
        card.classList.add('pending'); observer.observe(card);
      });
    };
    window.COZ_OBSERVE_REVEALS();
    document.addEventListener('focusin', event => {
      const card = event.target.closest('.service-reveal');
      if (card) { card.classList.add('visible'); observer.unobserve(card); }
    });
    motion.addEventListener('change', event => {
      if (event.matches) { document.querySelectorAll('.service-reveal').forEach(card => card.classList.add('visible')); observer.disconnect(); }
    });
  }
})();
