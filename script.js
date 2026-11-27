(function(){
  var $ = function(id){return document.getElementById(id)};
  var x3d = $('x3d'), tr = $('tablilla'), nav = $('nav');
  var rotar = true, ang = 0, esc = 1, luz = true;

  function aplicar(){
    tr.setAttribute('rotation', '0 1 0 ' + ang);
    tr.setAttribute('scale', esc + ' ' + esc + ' ' + esc);
  }
  (function bucle(){
    if (rotar) { ang = (ang + 0.004) % (Math.PI * 2); aplicar(); }
    requestAnimationFrame(bucle);
  })();

  // Centra giro y zoom en el centro real del modelo cuando termina de cargar
  $('inl').addEventListener('load', function(){
    try {
      var b = x3d.runtime.getSceneBBox();
      tr.setAttribute('center', [(b.min.x+b.max.x)/2, (b.min.y+b.max.y)/2, (b.min.z+b.max.z)/2].join(' '));
    } catch(e) {}
  });

  function alternar(btn, estado){ btn.setAttribute('aria-pressed', estado); }

  $('bRotar').onclick = function(){ rotar = !rotar; alternar(this, rotar); };
  $('bMalla').onclick = function(){
    try { x3d.runtime.togglePoints(true); } catch(e) {}
    alternar(this, this.getAttribute('aria-pressed') !== 'true');
  };
  $('bLuz').onclick = function(){ luz = !luz; nav.setAttribute('headlight', luz); };
  $('bReset').onclick = function(){
    esc = 1; ang = 0; $('zoom').value = 1; aplicar();
    try { x3d.runtime.reset(); } catch(e) {}
  };
  $('bFull').onclick = function(){
    var el = $('modelo');
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen();
  };

  function zoom(v){ esc = Math.min(3, Math.max(0.5, v)); $('zoom').value = esc; aplicar(); }
  $('zoom').oninput = function(){ zoom(parseFloat(this.value)); };
  $('zMas').onclick = function(){ zoom(esc + 0.2); };
  $('zMenos').onclick = function(){ zoom(esc - 0.2); };
})();