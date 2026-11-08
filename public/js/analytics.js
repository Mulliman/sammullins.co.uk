// Ticket 703: starts GoatCounter only where it should count. Not bundled, so it stays readable.
// count.js (vendored, see _docs/analytics.md) loads just before this with no_onload, so it never
// counts on its own. No cookies are set; GoatCounter is cookieless.
(function () {
  'use strict';
  var me = document.currentScript;
  var gc = window.goatcounter;
  if (!me || !gc || typeof gc.count !== 'function') return;

  // Production only: not deploy previews, branch deploys or *.netlify.app. (count.js skips localhost itself.)
  if (location.hostname !== me.dataset.host) return;

  // Respect Do Not Track and Global Privacy Control.
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  // The 404 page's canonical URL is /404/, so count the address that was actually asked for instead.
  var vars = me.hasAttribute('data-not-found')
    ? { path: '404: ' + location.pathname + location.search, title: 'Not found: ' + location.pathname }
    : undefined;

  var count = function () {
    try {
      gc.count(vars);
    } catch (e) {
      // Blocked storage or an old browser: not counting is fine.
    }
  };

  // Don't count prerendered pages until they're actually shown (as count.js does by default).
  if (!('visibilityState' in document) || document.visibilityState === 'visible') {
    count();
  } else {
    var onVisible = function () {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', onVisible);
      count();
    };
    document.addEventListener('visibilitychange', onVisible);
  }
})();
