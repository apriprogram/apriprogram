/**
 * Apriprogram i18n Translation Plugin
 * Universal Multi-Language Engine (Indonesian <-> English)
 * Powered by Google Website Translator API with seamless state persistence.
 */

(function () {
  const STORAGE_KEY = 'apriprogram_lang';
  const COOKIE_KEY = 'googtrans';

  function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function getActiveLanguage() {
    const cookieVal = getCookie(COOKIE_KEY);
    if (cookieVal && cookieVal.includes('/id/en')) {
      return 'en';
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en') return 'en';
    return 'id';
  }

  function clearTranslateCookie() {
    const host = window.location.hostname;
    const parts = host.split('.');
    const domains = ['', host, '.' + host];
    if (parts.length > 1) {
      domains.push('.' + parts.slice(-2).join('.'));
    }

    const paths = ['/', window.location.pathname];

    domains.forEach(d => {
      paths.forEach(p => {
        const dStr = d ? '; domain=' + d : '';
        document.cookie = COOKIE_KEY + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=' + p + dStr + ';';
      });
    });

    localStorage.setItem(STORAGE_KEY, 'id');
  }

  function setTranslateCookie(lang) {
    if (lang === 'en') {
      const host = window.location.hostname;
      const parts = host.split('.');
      const domains = ['', host];
      if (parts.length > 1) {
        domains.push('.' + parts.slice(-2).join('.'));
      }
      const val = '/id/en';
      domains.forEach(d => {
        const dStr = d ? '; domain=' + d : '';
        document.cookie = COOKIE_KEY + '=' + val + '; path=/' + dStr;
      });
      document.cookie = COOKIE_KEY + '=' + val + '; path=/';
      localStorage.setItem(STORAGE_KEY, 'en');
    } else {
      clearTranslateCookie();
    }
  }

  // Pre-set or clear cookie on initialization
  const initialLang = getActiveLanguage();
  if (initialLang === 'en') {
    if (!document.cookie.includes('/id/en')) {
      setTranslateCookie('en');
    }
  } else {
    // If in Indonesian mode, ensure NO googtrans cookie is active so native text is displayed untouched!
    if (document.cookie.includes('googtrans')) {
      clearTranslateCookie();
    }
  }

  function injectStyles() {
    if (document.getElementById('apriprogram-i18n-styles')) return;
    const style = document.createElement('style');
    style.id = 'apriprogram-i18n-styles';
    style.textContent = `
      .goog-te-banner-frame,
      iframe.goog-te-banner-frame,
      iframe.skiptranslate,
      .goog-te-balloon-frame,
      #goog-gt-tt {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
        width: 0 !important;
      }
      body {
        top: 0px !important;
        position: static !important;
      }
      .goog-text-highlight {
        background: transparent !important;
        background-color: transparent !important;
        box-shadow: none !important;
      }
      #google_translate_element {
        display: none !important;
      }
      .goog-te-gadget {
        display: none !important;
      }
      #languageToggle,
      .language-toggle-btn {
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function updateUI(lang) {
    document.documentElement.lang = lang;
    const isEn = lang === 'en';

    const buttons = document.querySelectorAll('#languageToggle, .language-toggle-btn, [data-lang-toggle]');
    buttons.forEach(btn => {
      const codeEl = btn.querySelector('.lang-code');
      const textEl = btn.querySelector('.lang-text');
      const flagEl = btn.querySelector('.lang-flag');

      if (codeEl) {
        codeEl.textContent = isEn ? 'EN' : 'ID';
      }
      if (textEl) {
        textEl.textContent = isEn ? 'English' : 'Indonesia';
      }
      if (flagEl) {
        flagEl.className = 'lang-code inline-flex items-center justify-center font-bold text-xs uppercase leading-none select-none';
        flagEl.textContent = isEn ? 'EN' : 'ID';
      }

      btn.setAttribute('title', isEn ? 'Ganti ke Bahasa Indonesia' : 'Switch to English');
      btn.setAttribute('aria-label', isEn ? 'Switch to Bahasa Indonesia' : 'Switch to English');

      if (!codeEl && !textEl && !flagEl) {
        btn.innerHTML = `
          <svg class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          <span class="lang-code inline-flex items-center justify-center font-bold text-xs uppercase leading-none select-none">${isEn ? 'EN' : 'ID'}</span>
          <span class="lang-text text-xs font-semibold tracking-wide">${isEn ? 'English' : 'Indonesia'}</span>
          <svg class="h-3 w-3 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        `;
      }
    });

    document.querySelectorAll('.lang-mobile-label').forEach(el => {
      el.textContent = isEn ? 'Language' : 'Bahasa';
    });
  }

  window.setLanguage = function (targetLang) {
    if (targetLang === 'id') {
      clearTranslateCookie();
      updateUI('id');
      window.location.reload();
    } else {
      setTranslateCookie('en');
      updateUI('en');
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    }
  };

  let isToggling = false;
  window.toggleLanguage = function () {
    if (isToggling) return;
    isToggling = true;
    setTimeout(() => { isToggling = false; }, 500);

    const current = getActiveLanguage();
    const next = current === 'en' ? 'id' : 'en';
    window.setLanguage(next);
  };

  window.googleTranslateElementInit = function () {
    if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
      return;
    }
    new google.translate.TranslateElement(
      {
        pageLanguage: 'id',
        includedLanguages: 'id,en',
        autoDisplay: false
      },
      'google_translate_element'
    );

    const checkComboInterval = setInterval(() => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        clearInterval(checkComboInterval);
        const current = getActiveLanguage();
        if (current === 'en' && combo.value !== 'en') {
          combo.value = 'en';
          combo.dispatchEvent(new Event('change'));
        }
      }
    }, 100);

    setTimeout(() => clearInterval(checkComboInterval), 5000);
  };

  function init() {
    injectStyles();

    if (!document.getElementById('google_translate_element')) {
      const el = document.createElement('div');
      el.id = 'google_translate_element';
      el.className = 'hidden';
      el.style.display = 'none';
      document.body.appendChild(el);
    }

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    const current = getActiveLanguage();
    updateUI(current);

    document.addEventListener('click', function (e) {
      const toggle = e.target.closest('#languageToggle, .language-toggle-btn, [data-lang-toggle]');
      if (toggle) {
        e.preventDefault();
        window.toggleLanguage();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
