/* ============================================================
   COOKIE BANNER — Interrogalabolletta
   Compliant Provv. Garante Privacy 10/06/2021 n. 231
   ============================================================
   Regole implementate:
   - Nessun cookie non tecnico prima del consenso
   - 3 scelte equivalenti graficamente: Accetta / Rifiuta / Personalizza
   - Chiudere con "X" = rifiuto per i non tecnici
   - Consenso registrato con timestamp e versione policy
   - Re-prompt automatico dopo 6 mesi o al variare della versione
   - Attualmente il sito non usa cookie di profilazione/analytics:
     il banner registra la scelta anche per future implementazioni.
   ============================================================ */

(function() {
  'use strict';

  const CONSENT_VERSION = '1.0';
  const CONSENT_KEY = 'ilb_consent';
  const CONSENT_MAX_AGE_DAYS = 180;

  // ---------- STORAGE ----------
  function getConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.version !== CONSENT_VERSION) return null;
      const ageMs = Date.now() - data.timestamp;
      if (ageMs > CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(choices) {
    const data = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      choices: choices
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage bloccato: proseguiamo comunque
    }
    applyChoices(choices);
  }

  function applyChoices(choices) {
    // Hook per future integrazioni (Analytics, Marketing, ecc.)
    // Attualmente il sito non carica cookie non tecnici, ma qui
    // andranno inseriti gli attivatori condizionali quando serviranno.
    window.ilbConsent = choices;
    document.dispatchEvent(new CustomEvent('ilb:consent', { detail: choices }));
  }

  // ---------- UI ----------
  const STYLE = `
  .ilb-cookie-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 14, 26, 0.65);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 9998;
    display: none;
    animation: ilbFadeIn 0.25s ease-out;
  }
  .ilb-cookie-overlay.show { display: block; }

  .ilb-cookie-banner {
    position: fixed;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: 640px;
    margin: 0 auto;
    background: #1B2845;
    color: #E5E7EB;
    border: 1px solid rgba(244, 208, 63, 0.25);
    border-radius: 12px;
    padding: 1.5rem;
    z-index: 9999;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.55;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    display: none;
    animation: ilbSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ilb-cookie-banner.show { display: block; }

  .ilb-cookie-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    color: #9CA3AF;
    font-size: 18px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    transition: background 0.15s;
  }
  .ilb-cookie-close:hover { background: rgba(255,255,255,0.12); color: #E5E7EB; }

  .ilb-cookie-title {
    font-family: "Space Grotesk", system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.05rem;
    color: #F5F5F0;
    margin: 0 2rem 0.5rem 0;
  }
  .ilb-cookie-text { margin: 0 0 1rem; color: #E5E7EB; }
  .ilb-cookie-text a { color: #F4D03F; text-decoration: underline; text-decoration-color: rgba(244,208,63,0.4); }

  .ilb-cookie-actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  @media (max-width: 520px) {
    .ilb-cookie-actions { grid-template-columns: 1fr; }
  }

  .ilb-cookie-btn {
    padding: 0.75rem 0.5rem;
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: transform 0.15s, background 0.15s, border-color 0.15s;
    text-align: center;
  }
  .ilb-cookie-btn:hover { transform: translateY(-1px); }
  .ilb-cookie-btn-accept { background: #F4D03F; color: #0A0E1A; border-color: #F4D03F; }
  .ilb-cookie-btn-refuse { background: transparent; color: #E5E7EB; border-color: rgba(255,255,255,0.25); }
  .ilb-cookie-btn-refuse:hover { border-color: rgba(255,255,255,0.5); }
  .ilb-cookie-btn-custom { background: transparent; color: #F4D03F; border-color: rgba(244,208,63,0.4); }
  .ilb-cookie-btn-custom:hover { border-color: #F4D03F; background: rgba(244,208,63,0.08); }

  /* MODALE PERSONALIZZAZIONE */
  .ilb-cookie-modal {
    position: fixed;
    left: 1rem;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    max-width: 560px;
    margin: 0 auto;
    background: #1B2845;
    color: #E5E7EB;
    border: 1px solid rgba(244, 208, 63, 0.25);
    border-radius: 12px;
    padding: 1.5rem;
    z-index: 10000;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.55;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    display: none;
    max-height: 85vh;
    overflow-y: auto;
  }
  .ilb-cookie-modal.show { display: block; }
  .ilb-cookie-modal h3 {
    font-family: "Space Grotesk", system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.05rem;
    color: #F5F5F0;
    margin: 1.25rem 0 0.5rem;
  }
  .ilb-cookie-modal h3:first-of-type { margin-top: 0.5rem; }
  .ilb-cookie-cat {
    background: rgba(0,0,0,0.15);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.75rem;
  }
  .ilb-cookie-cat-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .ilb-cookie-cat-title {
    font-weight: 600;
    color: #F5F5F0;
    font-size: 0.95rem;
  }
  .ilb-cookie-cat-desc { font-size: 0.85rem; color: #9CA3AF; }
  .ilb-cookie-switch {
    position: relative;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
  }
  .ilb-cookie-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .ilb-cookie-switch-slider {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.15);
    border-radius: 24px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ilb-cookie-switch-slider::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    background: #E5E7EB;
    border-radius: 50%;
    transition: transform 0.2s;
  }
  .ilb-cookie-switch input:checked + .ilb-cookie-switch-slider { background: #F4D03F; }
  .ilb-cookie-switch input:checked + .ilb-cookie-switch-slider::before { transform: translateX(20px); background: #0A0E1A; }
  .ilb-cookie-switch input:disabled + .ilb-cookie-switch-slider { opacity: 0.55; cursor: not-allowed; }

  .ilb-cookie-modal-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  @keyframes ilbFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ilbSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `;

  function injectStyle() {
    if (document.getElementById('ilb-cookie-style')) return;
    const s = document.createElement('style');
    s.id = 'ilb-cookie-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function buildBanner() {
    const overlay = document.createElement('div');
    overlay.className = 'ilb-cookie-overlay';

    const banner = document.createElement('div');
    banner.className = 'ilb-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferenze cookie');
    banner.innerHTML = `
      <button class="ilb-cookie-close" aria-label="Chiudi (equivale a rifiuto)" data-action="close">×</button>
      <div class="ilb-cookie-title">Preferenze cookie</div>
      <p class="ilb-cookie-text">
        Utilizziamo cookie tecnici necessari al funzionamento del sito.
        Al momento non utilizziamo cookie di profilazione o analytics.
        Chiudere questo banner o cliccare "Rifiuta" equivale a non prestare consenso per eventuali cookie non tecnici in futuro.
        Per dettagli consulta la <a href="/cookie.html" target="_blank">Cookie Policy</a>.
      </p>
      <div class="ilb-cookie-actions">
        <button class="ilb-cookie-btn ilb-cookie-btn-refuse" data-action="refuse">Rifiuta tutti</button>
        <button class="ilb-cookie-btn ilb-cookie-btn-custom" data-action="customize">Personalizza</button>
        <button class="ilb-cookie-btn ilb-cookie-btn-accept" data-action="accept">Accetta tutti</button>
      </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'ilb-cookie-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Personalizza cookie');
    modal.innerHTML = `
      <button class="ilb-cookie-close" aria-label="Chiudi" data-action="close-modal">×</button>
      <h3>Personalizza le tue scelte</h3>
      <p style="font-size: 0.85rem; color: #9CA3AF; margin-bottom: 1rem;">
        Puoi modificare le preferenze in qualsiasi momento dalla <a href="/cookie.html" style="color: #F4D03F;">Cookie Policy</a>.
      </p>

      <div class="ilb-cookie-cat">
        <div class="ilb-cookie-cat-head">
          <div>
            <div class="ilb-cookie-cat-title">Cookie tecnici</div>
            <div class="ilb-cookie-cat-desc">Necessari al funzionamento del sito. Non richiedono consenso.</div>
          </div>
          <label class="ilb-cookie-switch">
            <input type="checkbox" checked disabled />
            <span class="ilb-cookie-switch-slider"></span>
          </label>
        </div>
      </div>

      <div class="ilb-cookie-cat">
        <div class="ilb-cookie-cat-head">
          <div>
            <div class="ilb-cookie-cat-title">Cookie analitici</div>
            <div class="ilb-cookie-cat-desc">Attualmente non utilizzati. La scelta verrà applicata a eventuali future implementazioni (es. statistiche di navigazione).</div>
          </div>
          <label class="ilb-cookie-switch">
            <input type="checkbox" data-category="analytics" />
            <span class="ilb-cookie-switch-slider"></span>
          </label>
        </div>
      </div>

      <div class="ilb-cookie-cat">
        <div class="ilb-cookie-cat-head">
          <div>
            <div class="ilb-cookie-cat-title">Cookie di marketing / profilazione</div>
            <div class="ilb-cookie-cat-desc">Attualmente non utilizzati. La scelta verrà applicata a eventuali future implementazioni pubblicitarie.</div>
          </div>
          <label class="ilb-cookie-switch">
            <input type="checkbox" data-category="marketing" />
            <span class="ilb-cookie-switch-slider"></span>
          </label>
        </div>
      </div>

      <div class="ilb-cookie-modal-actions">
        <button class="ilb-cookie-btn ilb-cookie-btn-refuse" data-action="cancel-modal">Annulla</button>
        <button class="ilb-cookie-btn ilb-cookie-btn-accept" data-action="save-modal">Salva preferenze</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(banner);
    document.body.appendChild(modal);

    return { overlay, banner, modal };
  }

  function showBanner(elements) {
    elements.overlay.classList.add('show');
    elements.banner.classList.add('show');
  }

  function hideBanner(elements) {
    elements.overlay.classList.remove('show');
    elements.banner.classList.remove('show');
    elements.modal.classList.remove('show');
  }

  function bindEvents(elements) {
    document.body.addEventListener('click', function(e) {
      const action = e.target.getAttribute('data-action');
      if (!action) return;

      if (action === 'accept') {
        saveConsent({ technical: true, analytics: true, marketing: true });
        hideBanner(elements);
      } else if (action === 'refuse' || action === 'close') {
        saveConsent({ technical: true, analytics: false, marketing: false });
        hideBanner(elements);
      } else if (action === 'customize') {
        elements.banner.classList.remove('show');
        elements.modal.classList.add('show');
      } else if (action === 'cancel-modal' || action === 'close-modal') {
        elements.modal.classList.remove('show');
        elements.banner.classList.add('show');
      } else if (action === 'save-modal') {
        const analytics = elements.modal.querySelector('input[data-category="analytics"]').checked;
        const marketing = elements.modal.querySelector('input[data-category="marketing"]').checked;
        saveConsent({ technical: true, analytics: analytics, marketing: marketing });
        hideBanner(elements);
      }
    });
  }

  // ---------- API pubblica per riaprire il banner ----------
  window.ilbReopenConsent = function() {
    const existing = document.querySelector('.ilb-cookie-banner');
    if (existing) {
      document.querySelector('.ilb-cookie-overlay').classList.add('show');
      existing.classList.add('show');
    } else {
      init(true);
    }
  };

  // ---------- INIT ----------
  function init(forceShow) {
    injectStyle();
    const elements = buildBanner();
    bindEvents(elements);

    const existing = getConsent();
    if (existing && !forceShow) {
      applyChoices(existing.choices);
    } else {
      showBanner(elements);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { init(false); });
  } else {
    init(false);
  }
})();
