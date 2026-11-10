// Composes a booking message in the browser. Nothing is sent or stored.
(() => {
  const form = document.querySelector('#inquiry-builder');
  if (!form) return;
  const preview = form.querySelector('.inquiry-preview');
  const status = form.querySelector('.inquiry-status');
  // Only the action name is counted; field values are never sent.
  const track = name => window.COZ_TRACK?.(name);

  const render = () => {
    const lines = [...form.querySelectorAll('[data-label]')]
      .filter(field => field.value.trim())
      .map(field => field.dataset.label + form.dataset.separator + field.value.trim());
    preview.value = [form.dataset.intro, ...lines].join('\n');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
      return true;
    } catch {
      preview.select();
      try { return document.execCommand('copy'); } catch { return false; }
    }
  };

  form.addEventListener('input', () => { status.textContent = ''; render(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.elements.character.value.trim()) {
      status.textContent = form.dataset.empty;
      form.elements.character.focus();
      return;
    }
    const copied = await copy();
    status.textContent = copied ? form.dataset.copied : form.dataset.failed;
    if (copied) track('inquiry_copy');
  });
  document.querySelector('.cosplay-guide .service-cta[target="_blank"]')
    ?.addEventListener('click', () => track('inquiry_open_instagram'));

  // The plain checklist stays in the HTML for readers without JavaScript.
  document.querySelector('.inquiry-list').hidden = true;
  form.hidden = false;
  render();
})();
