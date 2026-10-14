/*
 * site.js - shared head, navbar and scripts for every page.
 *
 * Usage: one tag in <head>, after the <title>/<meta> tags:
 *     <script src="site.js"></script>
 * Optional: <script src="site.js" data-nav="false"></script> to skip the navbar.
 *
 * What it does:
 *   - loads Bootstrap CSS, then site.css (order matters: site.css overrides Bootstrap)
 *   - builds the navbar from the MENU array below
 *   - loads the Bootstrap JS bundle (includes Popper; no jQuery needed)
 *
 * Edit MENU to change the navbar on every page. Library versions and SRI hashes live in LIBS.
 * Titles, descriptions and social tags are written directly into each page's <head>,
 * because crawlers and link previews do not run JavaScript.
 */
(function () {
  'use strict';

  // Base URL of this script, so links work from any page depth.
  var self = document.currentScript;
  var base = self.src.slice(0, self.src.lastIndexOf('/') + 1);
  var withNav = self.getAttribute('data-nav') !== 'false';

  // ---------------------------------------------------------------- libraries
  var BOOTSTRAP = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/';
  var LIBS = {
    css: [
      {
        href: BOOTSTRAP + 'css/bootstrap.min.css',
        integrity: 'sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB'
      },
      { href: base + 'site.css' }
    ],
    js: [
      {
        src: BOOTSTRAP + 'js/bootstrap.bundle.min.js',
        integrity: 'sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI'
      }
    ]
  };

  // --------------------------------------------------------------------- menu
  var BRAND = { text: 'Hail Duckfather?', href: '/', icon: 'favicon.ico' };
  var TAGLINE = '(The official webbed-site of the Duckfather)';
  var ITEM_ICON = 'Referenced_Media/Feather.ico';

  var MENU = [
    { label: '(Home)', href: 'index.html' },
    {
      label: '(Feathers Descended From Some Passing Duck)',
      items: [
        { label: 'The Silly Song', href: 'SillySong.html' },
        { label: 'The Pen', href: 'ThePen.html' },
        { label: 'The Spyglass', href: 'TheSpyglass.html' },
        { label: 'Fun and Games', href: 'DatabaseTesting.html' },
        { label: 'Duck Scratch (like chicken scratch but with ducks)', href: 'DuckScribbles.html' }
      ]
    },
    {
      label: '(The Great Quack)',
      items: [
        { label: 'The 1st Great Quack', href: 'GreatQuack1.html' },
        { label: 'The Origin of The Duckfather', href: 'GreatQuack2.html' },
        { label: "The Duckfather's Hat", href: 'GreatQuack3.html' }
      ]
    }
  ];

  // ------------------------------------------------------------------ helpers
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // "/ThePen" (extensionless URLs on GitHub Pages) and "/ThePen.html" both map to "ThePen.html".
  function currentPage() {
    var p = location.pathname.split('/').pop();
    if (p === '') return 'index.html';
    return p.indexOf('.') === -1 ? p + '.html' : p;
  }

  function buildNav() {
    var here = currentPage();
    var html = '<div class="container-fluid">';

    html += '<a class="navbar-brand" href="' + esc(BRAND.href) + '">' +
      '<img src="' + base + BRAND.icon + '" class="d-inline-block align-top" ' +
      'style="width: 34px; height: 34px;" alt=""> ' + esc(BRAND.text) + '</a>';

    html += '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" ' +
      'data-bs-target="#siteNavbar" aria-controls="siteNavbar" aria-expanded="false" ' +
      'aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>';

    html += '<div class="collapse navbar-collapse" id="siteNavbar">' +
      '<ul class="navbar-nav me-auto mb-2 mb-md-0">';

    MENU.forEach(function (entry, i) {
      if (entry.items) {
        var open = entry.items.some(function (it) { return it.href === here; });
        html += '<li class="nav-item dropdown">' +
          '<a class="nav-link dropdown-toggle' + (open ? ' active' : '') + '" href="#" ' +
          'id="siteDropdown' + i + '" role="button" data-bs-toggle="dropdown" ' +
          'aria-expanded="false">' + esc(entry.label) + '</a>' +
          '<ul class="dropdown-menu" aria-labelledby="siteDropdown' + i + '">';
        entry.items.forEach(function (it) {
          var cur = it.href === here;
          html += '<li><a class="dropdown-item' + (cur ? ' active' : '') + '"' +
            (cur ? ' aria-current="page"' : '') + ' href="' + base + esc(it.href) + '">' +
            '<img src="' + base + ITEM_ICON + '" class="d-inline-block align-top" ' +
            'style="width: 16px; height: 16px;" alt=""> &emsp; ' + esc(it.label) + '</a></li>';
        });
        html += '</ul></li>';
      } else {
        var isHere = entry.href === here;
        html += '<li class="nav-item"><a class="nav-link' + (isHere ? ' active' : '') + '"' +
          (isHere ? ' aria-current="page"' : '') + ' href="' + base + esc(entry.href) + '">' +
          esc(entry.label) + '</a></li>';
      }
    });

    html += '</ul><span class="navbar-text small">' + esc(TAGLINE) + '</span></div></div>';
    return html;
  }

  function loadScripts(list) {
    list.forEach(function (cfg) {
      var s = document.createElement('script');
      s.src = cfg.src;
      s.integrity = cfg.integrity;
      s.crossOrigin = 'anonymous';
      s.onerror = function () { console.error('site.js: failed to load ' + cfg.src); };
      document.body.appendChild(s);
    });
  }

  // Keep --site-nav-h equal to the real navbar height so page content never hides under it.
  function trackHeight(nav) {
    function sync() {
      document.documentElement.style.setProperty('--site-nav-h', nav.offsetHeight + 'px');
    }
    sync();
    if (window.ResizeObserver) new ResizeObserver(sync).observe(nav);
    else window.addEventListener('resize', sync);
  }

  // On mobile the menu is a floating panel, so close it when the user taps elsewhere.
  function closeOnOutsideClick(nav) {
    document.addEventListener('click', function (e) {
      var panel = document.getElementById('siteNavbar');
      if (!panel || !panel.classList.contains('show') || nav.contains(e.target)) return;
      if (window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false }).hide();
    });
  }

  // ------------------------------------------------------------------- styles
  // Inserted synchronously from <head>, in order, and marked render-blocking so the
  // page does not flash unstyled. Anything in the page's own <style> loads after these.
  LIBS.css.forEach(function (cfg) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cfg.href;
    if (cfg.integrity) {
      link.integrity = cfg.integrity;
      link.crossOrigin = 'anonymous';
    }
    link.setAttribute('blocking', 'render');
    document.head.appendChild(link);
  });

  // Reserve space for the fixed navbar before the first paint (see site.css).
  if (withNav) document.documentElement.classList.add('has-site-nav');

  // --------------------------------------------------------------------- init
  function init() {
    if (withNav) {
      var nav = document.createElement('nav');
      nav.id = 'site-nav';
      nav.className = 'navbar navbar-expand-md bg-body fixed-top shadow-sm';
      nav.setAttribute('aria-label', 'Main');
      nav.innerHTML = buildNav();
      document.body.insertBefore(nav, document.body.firstChild);
      trackHeight(nav);
      closeOnOutsideClick(nav);
    }
    loadScripts(LIBS.js);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
