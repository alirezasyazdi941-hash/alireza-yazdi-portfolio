/* DocScan hardening shim (Alireza Yazdi build).
   Phone cameras give 12-48 MP photos; OpenCV (WASM) on the main thread then
   freezes or runs out of memory on phones. This shrinks any picture whose
   longest side exceeds MAX before the app sees it. Text stays sharp at 2600px. */
(function () {
  'use strict';
  var MAX = 2600, FLAG = '__ayShrunk';
  function shrink(file) {
    return new Promise(function (resolve) {
      if (!/^image\/(jpeg|png|webp|bmp)$/.test(file.type)) return resolve(file);
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var w = img.naturalWidth, h = img.naturalHeight, m = Math.max(w, h);
        if (m <= MAX) return resolve(file);
        var s = MAX / m, c = document.createElement('canvas');
        c.width = Math.round(w * s); c.height = Math.round(h * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(function (b) {
          if (!b) return resolve(file);
          resolve(new File([b], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg', lastModified: Date.now() }));
        }, 'image/jpeg', 0.92);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el || el.type !== 'file' || el[FLAG] || !el.files || !el.files.length) return;
    e.stopImmediatePropagation();
    Promise.all(Array.prototype.map.call(el.files, shrink)).then(function (out) {
      try {
        var dt = new DataTransfer();
        out.forEach(function (f) { dt.items.add(f); });
        el.files = dt.files;
      } catch (err) { /* keep originals */ }
      el[FLAG] = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el[FLAG] = false;
    });
  }, true);
})();
