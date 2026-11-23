/*
  Photo + PDF slots for each project.

  To fill a slot, upload a file to assets/projects/ with the matching name:
    wallet.jpg / wallet.pdf
    cuda.jpg / cuda.pdf
    simulation.jpg / simulation.pdf
    moe.jpg / moe.pdf

  Empty slots are hidden from visitors. Add ?edit to the address
  (e.g. https://gracelyr06.github.io/?edit) to see where each file goes.
*/
(function () {
  var edit = /[?&]edit\b/.test(location.search);
  if (edit) document.documentElement.classList.add('edit');

  function placeholder(el, kind, file) {
    el.classList.add('empty');
    var p = document.createElement('div');
    p.className = 'ph';
    p.innerHTML = '<span class="hand">' + kind + ' goes here</span><code>' + file + '</code>';
    el.appendChild(p);
  }

  function settle(project) {
    var media = project.querySelector('.media');
    var filled = media.querySelectorAll('.filled').length;
    if (filled) project.classList.add('has-media');
    else if (!edit) project.classList.add('no-media');
  }

  document.querySelectorAll('.project').forEach(function (project) {
    var pending = 2;
    function done() { if (--pending === 0) settle(project); }

    // photo
    var fig = project.querySelector('.slot-photo');
    var img = fig.querySelector('img');
    var file = img.getAttribute('src');
    function photoOk() { fig.classList.add('filled'); done(); }
    function photoMissing() { img.remove(); placeholder(fig, 'photo', file); done(); }
    if (img.complete) { img.naturalWidth ? photoOk() : photoMissing(); }
    else { img.addEventListener('load', photoOk); img.addEventListener('error', photoMissing); }

    // pdf
    var box = project.querySelector('.slot-pdf');
    var pdf = box.getAttribute('data-pdf');
    var title = box.getAttribute('data-title') || 'PDF';
    fetch(pdf, { method: 'HEAD' }).then(function (r) {
      if (!r.ok) throw 0;
      box.classList.add('filled');
      box.innerHTML =
        '<object data="' + pdf + '#view=FitH&toolbar=0" type="application/pdf" aria-label="' + title + '">' +
        '<a href="' + pdf + '">Open ' + title + '</a></object>' +
        '<a class="open" href="' + pdf + '" target="_blank" rel="noopener">Open ' + title + ' ↗</a>';
    }).catch(function () {
      placeholder(box, 'PDF', pdf);
    }).then(done);
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
