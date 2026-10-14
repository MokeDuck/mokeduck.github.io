/*
 * site.js - shared head, navbar and scripts for every page.
 *
 * Usage: put this as the only shared tag in <head>, after charset/viewport:
 *     <script src="site.js"></script>
 * Optional: <script src="site.js" data-nav="false"></script> to skip the navbar.
 *
 * Edit the MENU array below to change the navbar on all pages at once.
 * Library versions and SRI hashes live in LIBS.
 */
(function () {
  'use strict';

  // Base URL of this script, so links work from any page depth.
  var self = document.currentScript;
  var base = self.src.slice(0, self.src.lastIndexOf('/') + 1);

  // ---------------------------------------------------------------- libraries
  var LIBS = {
    css: {
      href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css',
      integrity: 'sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS'
    },
    // Order matters: jQuery, then Popper, then Bootstrap.
    js: [
      {
        src: 'https://code.jquery.com/jquery-3.3.1.slim.min.js',
        integrity: 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo'
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js',
        integrity: 'sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut'
      },
      {
        src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js',
        integrity: 'sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k'
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

  function currentPage() {
    var p = location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  function buildNav() {
    var here = currentPage();
    var html = '';

    html += '<a class="navbar-brand" href="' + esc(BRAND.href) + '">' +
      '<img src="' + base + BRAND.icon + '" class="d-inline-block align-top" ' +
      'style="width: 34px; height: 34px;" alt=""> ' + esc(BRAND.text) + '</a>';

    html += '<button class="navbar-toggler" type="button" data-toggle="collapse" ' +
      'data-target="#siteNavbar" aria-controls="siteNavbar" aria-expanded="false" ' +
      'aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>';

    html += '<div class="collapse navbar-collapse" id="siteNavbar"><ul class="navbar-nav mr-auto">';

    MENU.forEach(function (entry, i) {
      if (entry.items) {
        var open = entry.items.some(function (it) { return it.href === here; });
        var id = 'siteDropdown' + i;
        html += '<li class="nav-item dropdown' + (open ? ' active' : '') + '">' +
          '<a class="nav-link dropdown-toggle" href="#" id="' + id + '" data-toggle="dropdown" ' +
          'aria-haspopup="true" aria-expanded="false">' + esc(entry.label) + '</a>' +
          '<div class="dropdown-menu" aria-labelledby="' + id + '">';
        entry.items.forEach(function (it) {
          html += '<a class="dropdown-item' + (it.href === here ? ' active' : '') + '" href="' +
            base + esc(it.href) + '"><img src="' + base + ITEM_ICON +
            '" class="d-inline-block align-top" style="width: 16px; height: 16px;" alt=""> ' +
            '&emsp; ' + esc(it.label) + '</a>';
        });
        html += '</div></li>';
      } else {
        var cur = entry.href === here;
        html += '<li class="nav-item' + (cur ? ' active' : '') + '"><a class="nav-link" href="' +
          base + esc(entry.href) + '">' + esc(entry.label) +
          (cur ? ' <span class="sr-only">(current)</span>' : '') + '</a></li>';
      }
    });

    html += '</ul><h6 style="color:grey">' + esc(TAGLINE) + '</h6></div>';
    return html;
  }

  function loadScripts(list, done) {
    var i = 0;
    (function next() {
      if (i >= list.length) { if (done) done(); return; }
      var cfg = list[i++];
      var s = document.createElement('script');
      s.src = cfg.src;
      s.integrity = cfg.integrity;
      s.crossOrigin = 'anonymous';
      s.onload = next;
      s.onerror = function () { console.error('site.js: failed to load ' + cfg.src); next(); };
      document.body.appendChild(s);
    })();
  }

  // ---------------------------------------------------------------- bootstrap
  // Stylesheet is written synchronously so the page never renders unstyled.
  document.write(
    '<link rel="stylesheet" href="' + LIBS.css.href + '" integrity="' + LIBS.css.integrity +
    '" crossorigin="anonymous">'
  );

  function init() {
    if (self.getAttribute('data-nav') !== 'false') {
      var nav = document.getElementById('menu-placeholder') || document.createElement('nav');
      nav.id = 'menu-placeholder';
      nav.className = 'navbar navbar-expand-md navbar-light bg-white fixed-top';
      nav.innerHTML = buildNav();
      if (!nav.parentNode) document.body.insertBefore(nav, document.body.firstChild);
    }
    loadScripts(LIBS.js);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
