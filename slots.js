/*
  Photo + PDF slots for each project.

  To fill a slot, upload a file to assets/projects/ with the matching name:
    wallet.jpg / wallet.pdf
    cuda.jpg / cuda.pdf
    moe.jpg / moe.pdf
    simulation.jpg / simulation.pdf

  Empty slots are hidden from visitors. Add ?edit to the address
  (e.g. https://gracelyr06.github.io/?edit) to see where each file goes.
*/
(function () {
  var edit = /[?&]edit\b/.test(location.search);

  function placeholder(el, kind, file) {
    if (!edit) { el.remove(); return; }
    el.classList.add('empty');
    el.innerHTML = '<span>' + kind + ' goes here</span><code>' + file + '</code>';
  }

  document.querySelectorAll('.slot-photo').forEach(function (fig) {
    var img = fig.querySelector('img');
    var file = img.getAttribute('src');
    function missing() { placeholder(fig, 'Photo', file); }
    if (img.complete) { if (!img.naturalWidth) missing(); }
    else img.addEventListener('error', missing);
  });

  document.querySelectorAll('.slot-pdf').forEach(function (box) {
    var pdf = box.getAttribute('data-pdf');
    var title = box.getAttribute('data-title') || 'PDF';
    fetch(pdf, { method: 'HEAD' }).then(function (r) {
      if (!r.ok) throw 0;
      box.innerHTML =
        '<details><summary>Preview ' + title + '</summary>' +
        '<object data="' + pdf + '#view=FitH" type="application/pdf" aria-label="' + title + '">' +
        '<a href="' + pdf + '">Open ' + title + '</a></object></details>' +
        '<a class="open" href="' + pdf + '" target="_blank" rel="noopener">Open ' + title + ' ↗</a>';
    }).catch(function () { placeholder(box, 'PDF', pdf); });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
