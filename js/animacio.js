// Lépésenkénti animáció feliratokkal.
// lepesek: [{ felirat: 'HTML szöveg', rajz: () => '<svg>…</svg>' }, …]
// Az újonnan megjelenő SVG-elemekre tett `uj` osztály beúszó animációt kap (lásd style.css).
'use strict';

function animacioLejatszo(lepesek, { idokoz = 5500 } = {}) {
  const gyoker = document.createElement('figure');
  gyoker.className = 'animacio';
  gyoker.innerHTML = `
    <div class="anim-vaszon"></div>
    <figcaption class="anim-felirat" aria-live="polite"></figcaption>
    <div class="anim-vezerlok">
      <button type="button" class="gomb masodlagos" data-m="elozo" aria-label="Előző lépés">◀</button>
      <button type="button" class="gomb" data-m="lejatszas">▶ Lejátszás</button>
      <button type="button" class="gomb masodlagos" data-m="kovetkezo" aria-label="Következő lépés">▶</button>
      <span class="anim-szamlalo"></span>
    </div>`;
  const vaszon = gyoker.querySelector('.anim-vaszon');
  const felirat = gyoker.querySelector('.anim-felirat');
  const szamlalo = gyoker.querySelector('.anim-szamlalo');
  const lejatszoGomb = gyoker.querySelector('[data-m="lejatszas"]');
  const utolso = lepesek.length - 1;
  let i = 0;
  let idozito = null;

  function mutat(n) {
    i = Math.max(0, Math.min(utolso, n));
    vaszon.innerHTML = lepesek[i].rajz();
    felirat.innerHTML = lepesek[i].felirat;
    szamlalo.textContent = `${i + 1} / ${lepesek.length}`;
  }

  function megallit() {
    clearInterval(idozito);
    idozito = null;
    lejatszoGomb.textContent = i === utolso ? '↺ Újra' : '▶ Lejátszás';
  }

  function lejatszas() {
    if (idozito) return megallit();
    if (i === utolso) mutat(0);
    lejatszoGomb.textContent = '⏸ Szünet';
    idozito = setInterval(() => {
      // Ha közben elnavigáltak az oldalról, ne fusson tovább a háttérben.
      if (!gyoker.isConnected || i >= utolso) return megallit();
      mutat(i + 1);
      if (i === utolso) megallit();
    }, idokoz);
  }

  gyoker.querySelector('[data-m="elozo"]').addEventListener('click', () => {
    mutat(i - 1);
    megallit();
  });
  gyoker.querySelector('[data-m="kovetkezo"]').addEventListener('click', () => {
    mutat(i + 1);
    megallit();
  });
  lejatszoGomb.addEventListener('click', lejatszas);

  mutat(0);
  return gyoker;
}
