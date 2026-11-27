/**
 * Recreates the behaviour of the original Webflow site with plain TypeScript (no Webflow runtime, no jQuery):
 * navigation, dropdown, scroll animations ("grow big in", "slide in right", card stack), icon wheel,
 * product hover, phone Lottie animation, image lightbox, catalogue pagination and the contact form.
 * Timings and easings are taken from the original Webflow interactions.
 */

const EASE = {
  outQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  inOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

const tabletDolu = window.matchMedia('(max-width: 991px)');
const odTabletu = window.matchMedia('(min-width: 768px)');
const omezenyPohyb = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] => Array.from(root.querySelectorAll<T>(sel));

/** Runs a Web Animation and keeps the final state as inline style. */
function animuj(el: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions): Promise<void> {
  const posledni = keyframes[keyframes.length - 1] ?? {};
  if (omezenyPohyb) {
    Object.assign(el.style, posledni);
    return Promise.resolve();
  }
  const anim = el.animate(keyframes, { fill: 'forwards', ...options });
  return anim.finished
    .then(() => {
      Object.assign(el.style, posledni);
      anim.cancel();
    })
    .catch(() => undefined);
}

/* ---------- Footer year (the original used document.write) ---------- */
$$('[data-rok]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

/* ---------- Phone icon Lottie animation ---------- */
const lottieEl = $('[data-lottie]');
if (lottieEl) {
  void import('lottie-web/build/player/lottie_light').then(({ default: lottie }) => {
    lottie.loadAnimation({
      container: lottieEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: lottieEl.dataset.lottie ?? '',
    });
  });
}

/* ---------- Navigation (Webflow navbar, collapses at ≤ 991 px) ---------- */
const nav = $('[data-nav]');
const navMenu = $('[data-nav-menu]');
const navButton = $('[data-nav-button]');
const navOverlay = $('[data-nav-overlay]');
const menuMisto = navMenu?.parentElement ?? null;
const menuSoused = navMenu?.nextElementSibling ?? null;
let menuOtevrene = false;

function animujBurger(otevrit: boolean): void {
  if (!navButton) return;
  const opts = { duration: 400, easing: EASE.inOutQuint };
  const horni = $('.menu-icon2_line-top', navButton);
  const prostredni = $('.menu-icon2_line-middle', navButton);
  const dolni = $('.menu-icon2_line-bottom', navButton);
  if (horni) void animuj(horni, [{ transform: otevrit ? 'translateY(8px) rotate(45deg)' : 'translateY(0px) rotate(0deg)' }], opts);
  if (dolni) void animuj(dolni, [{ transform: otevrit ? 'translateY(-8px) rotate(-45deg)' : 'translateY(0px) rotate(0deg)' }], opts);
  if (prostredni) void animuj(prostredni, [{ opacity: otevrit ? '0' : '1' }], opts);
}

function nastavTridyMenu(otevrit: boolean): void {
  if (!navMenu) return;
  $$('.w-nav-link', navMenu).forEach((a) => a.classList.toggle('w--nav-link-open', otevrit));
  $$('.w-dropdown', navMenu).forEach((d) => d.classList.toggle('w--nav-dropdown-open', otevrit));
  $$('.w-dropdown-toggle', navMenu).forEach((d) => d.classList.toggle('w--nav-dropdown-toggle-open', otevrit));
  $$('.w-dropdown-list', navMenu).forEach((d) => d.classList.toggle('w--nav-dropdown-list-open', otevrit));
}

function otevriMenu(): void {
  if (!navMenu || !navButton || !navOverlay || menuOtevrene) return;
  menuOtevrene = true;
  navButton.classList.add('w--open');
  navButton.setAttribute('aria-expanded', 'true');
  navMenu.setAttribute('data-nav-menu-open', '');
  nastavTridyMenu(true);
  navOverlay.appendChild(navMenu);
  navOverlay.style.display = 'block';
  const vyska = navMenu.offsetHeight;
  void animuj(navOverlay, [{ height: '0px' }, { height: `${vyska}px` }], { duration: 400, easing: EASE.ease });
  void animuj(navMenu, [{ transform: `translateY(-${vyska}px)` }, { transform: 'translateY(0px)' }], { duration: 400, easing: EASE.ease });
  animujBurger(true);
}

function zavriMenu(okamzite = false): void {
  if (!navMenu || !navButton || !navOverlay || !menuOtevrene) return;
  menuOtevrene = false;
  navButton.classList.remove('w--open');
  navButton.setAttribute('aria-expanded', 'false');
  const vratit = (): void => {
    navMenu.removeAttribute('data-nav-menu-open');
    nastavTridyMenu(false);
    navMenu.style.transform = '';
    navOverlay.style.display = 'none';
    navOverlay.style.height = '';
    if (menuMisto) menuMisto.insertBefore(navMenu, menuSoused);
  };
  animujBurger(false);
  if (okamzite) {
    vratit();
    return;
  }
  const vyska = navMenu.offsetHeight;
  void animuj(navMenu, [{ transform: 'translateY(0px)' }, { transform: `translateY(-${vyska}px)` }], { duration: 400, easing: EASE.ease });
  void animuj(navOverlay, [{ height: `${vyska}px` }, { height: '0px' }], { duration: 400, easing: EASE.ease }).then(vratit);
}

navButton?.addEventListener('click', () => (menuOtevrene ? zavriMenu() : otevriMenu()));
navButton?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (menuOtevrene) zavriMenu();
    else otevriMenu();
  }
});
tabletDolu.addEventListener('change', (e) => {
  if (!e.matches) zavriMenu(true);
});
document.addEventListener('click', (e) => {
  if (menuOtevrene && nav && !nav.contains(e.target as Node)) zavriMenu();
});

/* ---------- Dropdown "katalog produktů" ---------- */
$$('[data-dropdown]').forEach((dropdown) => {
  const toggle = $('[data-dropdown-toggle]', dropdown);
  const list = $('[data-dropdown-list]', dropdown);
  const chevron = $('.dropdown-chevron', dropdown);
  if (!toggle || !list) return;
  let otevreno = false;
  let casovac: number | undefined;

  const otevri = (): void => {
    if (otevreno) return;
    otevreno = true;
    toggle.classList.add('w--open');
    list.classList.add('w--open');
    toggle.setAttribute('aria-expanded', 'true');
    if (tabletDolu.matches) {
      const vyska = list.scrollHeight;
      void animuj(list, [{ height: '0px' }, { height: `${vyska}px` }], { duration: 300, easing: EASE.ease }).then(() => {
        list.style.height = '';
      });
    } else {
      void animuj(list, [
        { transform: 'translateY(3rem)', opacity: '0' },
        { transform: 'translateY(0rem)', opacity: '1' },
      ], { duration: 300, easing: EASE.ease });
    }
    if (chevron) void animuj(chevron, [{ transform: 'rotate(180deg)' }], { duration: 300, easing: EASE.ease });
  };

  const zavri = (): void => {
    if (!otevreno) return;
    otevreno = false;
    toggle.setAttribute('aria-expanded', 'false');
    const skryj = (): void => {
      if (otevreno) return;
      toggle.classList.remove('w--open');
      list.classList.remove('w--open');
      list.style.height = '';
      list.style.opacity = '';
      list.style.transform = '';
    };
    if (chevron) void animuj(chevron, [{ transform: 'rotate(0deg)' }], { duration: 300, easing: EASE.ease });
    if (tabletDolu.matches) {
      void animuj(list, [{ height: `${list.offsetHeight}px` }, { height: '0px' }], { duration: 200, easing: EASE.ease }).then(skryj);
    } else {
      void animuj(list, [{ opacity: '0' }], { duration: 200, easing: EASE.ease }).then(skryj);
    }
  };

  // Desktop: opens on hover, closes 200 ms after leaving (data-delay="200").
  dropdown.addEventListener('mouseenter', () => {
    if (tabletDolu.matches) return;
    window.clearTimeout(casovac);
    otevri();
  });
  dropdown.addEventListener('mouseleave', () => {
    if (tabletDolu.matches) return;
    casovac = window.setTimeout(zavri, 200);
  });
  // Tablet/phone (and keyboard): the toggle opens/closes on click; the "katalog produktů" link still navigates.
  toggle.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) return;
    if (otevreno) zavri();
    else otevri();
  });
  dropdown.addEventListener('focusin', () => {
    if (!tabletDolu.matches) otevri();
  });
  dropdown.addEventListener('focusout', (e) => {
    if (!dropdown.contains(e.relatedTarget as Node | null) && !tabletDolu.matches) zavri();
  });
});

/* ---------- Scroll-into-view effects: "grow big in" and "slide in right" ---------- */
const efekty = $$('[data-ix]');
efekty.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = el.dataset.ix === 'slide-right' ? 'translateX(100px)' : 'scale(0)';
});

// Faster than the original Webflow timings (the original felt too late while scrolling):
// elements visible on page load keep the intro order at ~40 % of the original delays,
// elements further down start as soon as they begin to enter the screen, with a short delay.
const DELKA_ANIMACE = 700;
const vyskaOkna = window.innerHeight;
const viditelneHned = new Set(efekty.filter((el) => el.getBoundingClientRect().top < vyskaOkna));

function spustEfekt(el: HTMLElement): void {
  const puvodniDelay = Number(el.dataset.ixDelay ?? '0');
  const delay = viditelneHned.has(el) ? Math.round(puvodniDelay * 0.4) : Math.min(puvodniDelay, 150);
  const zacatek = el.dataset.ix === 'slide-right' ? 'translateX(100px)' : 'scale(0)';
  const konec = el.dataset.ix === 'slide-right' ? 'translateX(0px)' : 'scale(1)';
  void animuj(el, [
    { opacity: '0', transform: zacatek },
    { opacity: '1', transform: konec },
  ], { duration: DELKA_ANIMACE, delay, easing: EASE.outQuart });
}

// Trigger slightly before the element reaches the screen (10 % of the viewport below it).
const pozorovatel = new IntersectionObserver(
  (zaznamy, obs) => {
    zaznamy.forEach((z) => {
      if (z.isIntersecting) {
        obs.unobserve(z.target);
        spustEfekt(z.target as HTMLElement);
      }
    });
  },
  { rootMargin: '0px 0px 10% 0px', threshold: 0 },
);
efekty.forEach((el) => pozorovatel.observe(el));

/* ---------- Homepage card stack: cards shrink to 70 % while scrolling (≥ 768 px) ---------- */
const kartyObal = $('[data-ix-karty]');
if (kartyObal && !omezenyPohyb) {
  const karty = [1, 2, 3, 4].map((n) => $(`.layout408_card.card-${n}`, kartyObal));
  // [start %, end %] of the scroll progress during which each card goes from scale 1 to 0.7
  const useky: [number, number][] = [
    [0, 20],
    [20, 40],
    [40, 60],
    [60, 100],
  ];
  const aktualni = [1, 1, 1, 1];
  let bezi = false;

  const cil = (progres: number, [od, do_]: [number, number]): number => {
    if (progres <= od) return 1;
    if (progres >= do_) return 0.7;
    return 1 - (0.3 * (progres - od)) / (do_ - od);
  };

  const krok = (): void => {
    if (!odTabletu.matches) {
      karty.forEach((k) => k && (k.style.transform = ''));
      bezi = false;
      return;
    }
    const r = kartyObal.getBoundingClientRect();
    const vh = window.innerHeight;
    const progres = Math.min(100, Math.max(0, ((vh - r.top) / (vh + r.height)) * 100));
    let pohyb = false;
    karty.forEach((k, i) => {
      const usek = useky[i];
      if (!k || !usek) return;
      const c = cil(progres, usek);
      const a = aktualni[i] ?? 1;
      // smoothing 50 (as in the original interaction)
      const n = a + (c - a) * 0.5;
      aktualni[i] = Math.abs(c - n) < 0.0005 ? c : n;
      if (aktualni[i] !== c) pohyb = true;
      k.style.transform = `scale(${aktualni[i]})`;
    });
    if (pohyb) window.requestAnimationFrame(krok);
    else bezi = false;
  };

  const naplanuj = (): void => {
    if (bezi) return;
    bezi = true;
    window.requestAnimationFrame(krok);
  };
  window.addEventListener('scroll', naplanuj, { passive: true });
  window.addEventListener('resize', naplanuj);
  naplanuj();
}

/* ---------- Homepage icon wheel (same logic as the original custom script) ---------- */
const kolo = $('[data-kolo]');
if (kolo) {
  const ikony = $$('.icon-item', kolo);
  const stredText = $('.center-text.main-text', kolo);
  if (stredText) {
    const polomer = 280;
    const stredX = 350;
    const stredY = 350;
    const krokUhlu = (2 * Math.PI) / ikony.length;
    ikony.forEach((ikona, i) => {
      const uhel = i * krokUhlu + Math.PI / 2;
      ikona.style.left = `${stredX + polomer * Math.cos(uhel) - 55}px`;
      ikona.style.top = `${stredY + polomer * Math.sin(uhel) - 50}px`;
    });

    let aktivni = 0;
    let automaticky = true;
    let interval: number | undefined;
    const zobrazText = (ikona: HTMLElement): void => {
      const trida = ikona.classList[1];
      const blok = trida ? $(`.center-text.${trida}`, kolo) : null;
      if (blok) stredText.innerHTML = blok.innerHTML;
    };
    const startAutomaticky = (): void => {
      interval = window.setInterval(() => {
        if (!automaticky) return;
        ikony.forEach((i) => i.classList.remove('active'));
        const ikona = ikony[aktivni];
        if (ikona) {
          ikona.classList.add('active');
          zobrazText(ikona);
        }
        aktivni = (aktivni + 1) % ikony.length;
      }, 2000);
    };
    window.setTimeout(startAutomaticky, 1000);

    ikony.forEach((ikona) => {
      ikona.addEventListener('mouseenter', () => {
        automaticky = false;
        window.clearInterval(interval);
        ikony.forEach((i) => i.classList.remove('active'));
        ikona.classList.add('active');
        zobrazText(ikona);
      });
      ikona.addEventListener('mouseleave', () => {
        automaticky = true;
        stredText.innerHTML = 'Vyberte, co vás zajímá';
        startAutomaticky();
      });
    });
  }
}

/* ---------- Product cards: title turns yellow on hover ---------- */
$$('.product-archive').forEach((karta) => {
  karta.addEventListener('mouseenter', () => {
    karta.style.color = '#ffe000';
  });
  karta.addEventListener('mouseleave', () => {
    karta.style.color = '#000';
  });
});

/* ---------- Product image lightbox ---------- */
$$<HTMLAnchorElement>('[data-lightbox]').forEach((odkaz) => {
  odkaz.addEventListener('click', (e) => {
    e.preventDefault();
    const backdrop = document.createElement('div');
    backdrop.className = 'w-lightbox-backdrop';
    backdrop.tabIndex = 0;
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-label', 'Zvětšený obrázek');
    backdrop.innerHTML = `<div class="w-lightbox-container"><div class="w-lightbox-content"><div class="w-lightbox-view" style="opacity:1"><div class="w-lightbox-frame"><figure class="w-lightbox-figure"><img class="w-lightbox-img w-lightbox-image" alt=""></figure></div></div><div class="w-lightbox-control w-lightbox-left w-lightbox-inactive"></div><div class="w-lightbox-control w-lightbox-right w-lightbox-inactive"></div><div class="w-lightbox-control w-lightbox-close" role="button" aria-label="Zavřít" tabindex="0"></div></div></div>`;
    const img = $<HTMLImageElement>('img', backdrop);
    if (img) {
      img.src = odkaz.href;
      img.alt = $<HTMLImageElement>('img', odkaz)?.alt ?? '';
    }
    document.body.appendChild(backdrop);
    document.documentElement.classList.add('w-lightbox-noscroll');
    requestAnimationFrame(() => backdrop.classList.add('is-open'));
    backdrop.focus();

    const zavrit = (): void => {
      backdrop.classList.remove('is-open');
      document.documentElement.classList.remove('w-lightbox-noscroll');
      window.setTimeout(() => backdrop.remove(), 300);
      document.removeEventListener('keydown', klavesa);
      odkaz.focus();
    };
    const klavesa = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') zavrit();
    };
    document.addEventListener('keydown', klavesa);
    backdrop.addEventListener('click', (ev) => {
      if ((ev.target as HTMLElement).tagName !== 'IMG') zavrit();
    });
  });
});

/* ---------- Catalogue pagination: 16 per page, same URL parameter as the original ---------- */
const PARAMETR = '54e12fa5_page';
const mrizka = $('[data-strankovani]');
const strankovani = $('[data-strankovani-nav]');
if (mrizka && strankovani) {
  const naStranku = Number(mrizka.dataset.strankovani ?? '16');
  const polozky = $$(':scope > [role="listitem"]', mrizka);
  const pocetStran = Math.max(1, Math.ceil(polozky.length / naStranku));
  const pozadovana = Number(new URLSearchParams(location.search).get(PARAMETR) ?? '1');
  const strana = Number.isInteger(pozadovana) ? Math.min(Math.max(pozadovana, 1), pocetStran) : 1;
  polozky.forEach((p, i) => {
    p.hidden = Math.floor(i / naStranku) + 1 !== strana;
  });
  const predchozi = $<HTMLAnchorElement>('[data-predchozi]', strankovani);
  const dalsi = $<HTMLAnchorElement>('[data-dalsi]', strankovani);
  if (predchozi) {
    predchozi.href = `?${PARAMETR}=${strana - 1}`;
    if (strana <= 1) predchozi.remove();
  }
  if (dalsi) {
    dalsi.href = `?${PARAMETR}=${strana + 1}`;
    if (strana >= pocetStran) dalsi.remove();
  }
}

/* ---------- Contact form ---------- */
const formular = $<HTMLFormElement>('[data-formular]');
if (formular) {
  const blokFormulare = formular.parentElement;
  const ok = $('[data-ok]', blokFormulare ?? document);
  const chyba = $('[data-chyba]', blokFormulare ?? document);
  const odeslat = $<HTMLInputElement>('input[type="submit"]', formular);

  // Custom checkbox look (Webflow toggles these classes on the icon)
  const checkbox = $<HTMLInputElement>('input[type="checkbox"]', formular);
  const ikona = $('[data-checkbox-ikona]', formular);
  if (checkbox && ikona) {
    checkbox.addEventListener('change', () => ikona.classList.toggle('w--redirected-checked', checkbox.checked));
    checkbox.addEventListener('focus', () => ikona.classList.add('w--redirected-focus'));
    checkbox.addEventListener('blur', () => ikona.classList.remove('w--redirected-focus'));
  }

  formular.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!formular.reportValidity()) return;
    if (chyba) chyba.style.display = 'none';
    const puvodni = odeslat?.value ?? '';
    if (odeslat) odeslat.value = odeslat.dataset.wait ?? puvodni;
    try {
      const res = await fetch(formular.action, { method: 'POST', body: new FormData(formular) });
      if (!res.ok) throw new Error(String(res.status));
      formular.style.display = 'none';
      if (ok) ok.style.display = 'block';
      // Conversion event for Google Tag Manager (trigger: Custom Event "formular_odeslan").
      const w = window as Window & { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer ?? [];
      w.dataLayer.push({ event: 'formular_odeslan' });
    } catch {
      if (chyba) chyba.style.display = 'block';
    } finally {
      if (odeslat) odeslat.value = puvodni;
    }
  });
}
