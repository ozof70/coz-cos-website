(() => {
  const content = window.COZ_CONTENT;
  const tiles = content.backgroundPhotos;
  document.querySelector('#photo-track').innerHTML = [0,1,2,3].map(column => {
    const photos = tiles.filter((number,index) => index % 4 === column);
    const group = '<div class="photo-group">' + photos.map(number => '<img src="assets/clients/client-' + String(number).padStart(2,'0') + '.jpg" alt="" width="640" height="640" decoding="async">').join('') + '</div>';
    return '<div class="photo-column" style="--photo-count:' + photos.length + '"><div class="photo-column-track ' + (column%2 ? 'drift-down' : 'drift-up') + '">' + group + group + '</div></div>';
  }).join('');
  const entries = [{key:'instagram',name:'Instagram',file:'instagram.svg'},{key:'facebook',name:'Facebook',file:'facebook.png'},{key:'threads',name:'Threads',file:'threads.webp'},{key:'closet',file:'closet.png'},{key:'shop',file:'myship.svg'},{key:'wig',file:'wig-avatar.jpg'}];
  const socialLinks = document.querySelector('#social-links');
  socialLinks.innerHTML = entries.map((item,index) => '<a class="icon-link icon-' + item.key + ' icon-enter" href="' + content.links[item.key] + '" target="_blank" rel="noopener noreferrer" style="--delay:' + index*150 + 'ms;--label-direction:' + (index%2?24:-24) + 'px;--label-delay:' + index*90 + 'ms"><span class="icon-visual"><img src="assets/' + item.file + '" alt="" class="brand-icon"></span><span class="icon-label" aria-hidden="true"></span></a>').join('');
  let language = document.documentElement.lang === 'zh-Hant' ? 'zh' : 'en';
  const toggle = document.querySelector('#language-toggle');
  function updateLabels() {
    const copy = content.languages[language];
    socialLinks.querySelectorAll('a').forEach((anchor,index) => {
      const name = entries[index].name || copy[entries[index].key];
      anchor.title = name;
      anchor.querySelector('.icon-label').textContent = name;
      anchor.setAttribute('aria-label',name + ', ' + copy.open);
    });
  }
  function renderLanguage() {
    const copy = content.languages[language];
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant';
    document.title = copy.title;
    document.querySelector('.intro').innerHTML = copy.intro;
    document.querySelector('#about-title').innerHTML = copy.aboutTitle;
    document.querySelector('.about > p:not(.locations)').innerHTML = copy.about;
    document.querySelector('.locations').textContent = copy.locations;
    document.querySelector('#contact-title').textContent = copy.contact;
    document.querySelector('.contact-note').innerHTML = copy.note;
    document.querySelector('footer > span:last-child').textContent = copy.credit;
    if (!toggle.classList.contains('header-language')) toggle.textContent = copy.toggle;
    toggle.setAttribute('aria-label',copy.toggleLabel);
    toggle.title = copy.toggleLabel;
    toggle.classList.toggle('is-english', language === 'en');
    const english = language === 'en';
    const suffix = english ? '' : '-zh';
    const news = document.querySelector('.news-nav');
    news.textContent = english ? 'News' : '最新消息';
    news.href = `/news${suffix}.html`;
    const menu = document.querySelector('.service-menu');
    menu.setAttribute('aria-label', english ? 'Services' : '服務資訊');
    menu.querySelector('.service-menu-toggle').textContent = english ? 'Services' : '服務';
    const mobileMenu = document.querySelector('.mobile-nav-toggle');
    if (mobileMenu) mobileMenu.textContent = english ? 'Menu' : '選單';
    const serviceNames = english ? ['Service prices', 'Character list', 'Events & bookings'] : ['服務價目表', '圓夢角色列表', '場次資訊及預訂'];
    menu.querySelectorAll('.service-menu-panel a').forEach((link, index) => {
      link.textContent = serviceNames[index];
      link.href = `/${['pricing', 'characters', 'events'][index]}${suffix}.html`;
    });
    const footer = document.querySelector('.footer-links');
    footer.setAttribute('aria-label', english ? 'Site information' : '網站資訊');
    footer.querySelectorAll('a').forEach((link, index) => {
      link.textContent = (english ? ['About Us', 'FAQ', 'Privacy & analytics', 'First-time cosplay'] : ['關於我們', '常見問題', '隱私與流量', '第一次 Cosplay'])[index];
      link.href = index === 3 ? `/cosplay-experience${suffix}.html` : index === 2 ? '/privacy.html' : `/${['about', 'faq'][index]}${suffix}.html`;
    });
    const canonical = `https://cozcos.com/${english ? 'en.html' : ''}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.title);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', english ? 'en_US' : 'zh_TW');
    socialLinks.setAttribute('aria-label',copy.linksLabel);
    updateLabels();
  }
  window.COZ_SWITCH_LANGUAGE = () => {
    language = language === 'en' ? 'zh' : 'en';
    history.pushState(null, '', language === 'en' ? '/en.html' : '/');
    renderLanguage();
  };
  toggle.addEventListener('click', () => window.COZ_SWITCH_LANGUAGE());
  window.addEventListener('popstate', () => {
    language = location.pathname === '/en.html' ? 'en' : 'zh';
    renderLanguage();
  });
  renderLanguage();
  document.querySelector('#year').textContent = new Date().getFullYear();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const blocks = document.querySelectorAll('.reveal');
  if(!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(items => items.forEach(item => {
      if(item.isIntersecting) { item.target.classList.add('visible'); observer.unobserve(item.target); }
    }), {threshold:.18});
    blocks.forEach((element,index) => { element.style.setProperty('--delay',index*180+'ms'); element.classList.add('pending'); observer.observe(element); });
    document.addEventListener('focusin',event => { const block = event.target.closest('.reveal'); if(block) { block.classList.add('visible'); observer.unobserve(block); } });
    motion.addEventListener('change',event => { if(event.matches) { blocks.forEach(element => element.classList.add('visible')); observer.disconnect(); } });
  }
  // Icons stay hidden on entry, even on tall screens, until the visitor scrolls.
  const icons = [...socialLinks.querySelectorAll('.icon-enter')];
  icons.forEach(icon => icon.classList.add('waiting-for-scroll'));
  let hasScrolled = false;
  let frame = null;
  function revealIcons() {
    frame = null;
    if(!hasScrolled) return;
    icons.forEach(icon => {
      const box = icon.getBoundingClientRect();
      if(box.top < innerHeight - 20 && box.bottom > 0) icon.classList.add('icon-visible');
    });
    if(icons.every(icon => icon.classList.contains('icon-visible'))) window.removeEventListener('scroll',onScroll);
  }
  function onScroll() {
    if(window.scrollY > 8 || document.documentElement.scrollHeight <= innerHeight) hasScrolled = true;
    if(frame === null) frame = requestAnimationFrame(revealIcons);
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('pageshow',onScroll);
  window.addEventListener('resize',onScroll,{passive:true});
  onScroll();
  socialLinks.addEventListener('focusin',event => { const icon = event.target.closest('.icon-enter'); if(icon) icon.classList.add('icon-visible'); });
})();
