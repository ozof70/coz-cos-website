(() => {
  const config = window.COZ_ANALYTICS;
  const id = config?.measurementId;
  const production = location.protocol === 'https:' &&
    ['cozcos.com', 'www.cozcos.com'].includes(location.hostname);
  if (!production || !config?.enabled || !/^G-[A-Z0-9]+$/.test(id || '')) return;

  const key = 'coz-analytics-choice';
  const en = document.documentElement.lang === 'en';
  let loaded = false;
  const readChoice = () => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const saveChoice = value => {
    try { localStorage.setItem(key, value); } catch { /* Session choice still works. */ }
  };
  const cleanURL = value => {
    try { const url = new URL(value); return url.origin + url.pathname; } catch { return ''; }
  };
  function start() {
    window['ga-disable-' + id] = false;
    if (loaded) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    // config emits one page_view. Do not send another manual page_view.
    window.gtag('config', id, {
      page_location: cleanURL(location.href),
      page_referrer: cleanURL(document.referrer),
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  function choose(value) {
    saveChoice(value);
    banner?.remove();
    if (value === 'accepted') start();
    else {
      window['ga-disable-' + id] = true;
      if (loaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      // Remove only this site's Analytics cookies, preserving unrelated cookies.
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (name !== '_ga' && !name.startsWith('_ga_')) continue;
        for (const domain of ['', ';domain=cozcos.com', ';domain=.cozcos.com', ';domain=' + location.hostname]) {
          document.cookie = name + '=;max-age=0;path=/' + domain + ';SameSite=Lax;Secure';
        }
      }
    }
  }
  let banner;
  const choice = readChoice();
  const currentStatus = document.getElementById('analytics-status');
  if (currentStatus) currentStatus.textContent = choice === 'accepted'
    ? '已允許流量統計 / Analytics allowed.' : choice === 'declined'
      ? '已停用流量統計 / Analytics disabled.' : '請選擇是否允許流量統計 / Choose whether to allow analytics.';
  if (choice === 'accepted') start();
  else if (choice !== 'declined') {
    banner = document.createElement('aside');
    banner.className = 'analytics-choice';
    banner.setAttribute('aria-label', en ? 'Website analytics choice' : '網站流量統計選擇');
    const text = document.createElement('p');
    text.textContent = en ? 'May we use Google Analytics cookies to understand visits to COz Cos?' : '允許 COz Cos 使用 Google Analytics Cookie 統計網站瀏覽嗎？';
    const details = document.createElement('a');
    details.href = '/privacy.html';
    details.textContent = en ? 'Learn more' : '了解詳情';
    banner.append(text, details);
    for (const [value, label] of [['declined', en ? 'Decline' : '不允許'], ['accepted', en ? 'Allow' : '允許']]) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = label;
      button.addEventListener('click', () => choose(value));
      banner.append(button);
    }
    document.body.append(banner);
  }
  document.querySelectorAll('[data-analytics-choice]').forEach(button => {
    button.addEventListener('click', () => {
      choose(button.dataset.analyticsChoice);
      const status = document.getElementById('analytics-status');
      if (status) status.textContent = button.dataset.analyticsChoice === 'accepted'
        ? '已允許流量統計 / Analytics allowed.' : '已停用流量統計 / Analytics disabled.';
    });
  });
})();
