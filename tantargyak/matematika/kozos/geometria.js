// Közös rajzolók, interaktív elemek és magyarázó dobozok a matematika témáihoz
// (síkidomok, szögek, törtek). A pontok „valós” koordinátákban (y felfelé) adhatók meg;
// az illeszt() alakítja őket SVG-koordinátákká.
'use strict';

const Geo = (() => {
  const sz = (x, t = 2) => Rajz.szam(x, t);
  const kerek = (v) => +v.toFixed(1);
  const egys = ([x, y]) => {
    const d = Math.hypot(x, y) || 1;
    return [x / d, y / d];
  };

  // A pontokat (és a később rajzolandó segédpontokat) a keretbe illeszti.
  // fix: a keret mérete rögzített (interaktív rajzoknál, hogy ne „ugráljon”).
  function illeszt(pontok, { keret = [300, 210], margo = 40, fix = false } = {}) {
    const xs = pontok.map((p) => p[0]);
    const ys = pontok.map((p) => p[1]);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const s = Math.min((keret[0] - 2 * margo) / (maxX - minX || 1), (keret[1] - 2 * margo) / (maxY - minY || 1));
    const W = fix ? keret[0] : (maxX - minX) * s + 2 * margo;
    const H = fix ? keret[1] : (maxY - minY) * s + 2 * margo;
    const dx = (W - (maxX - minX) * s) / 2;
    const dy = (H - (maxY - minY) * s) / 2;
    const T = ([x, y]) => [dx + (x - minX) * s, H - dy - (y - minY) * s];
    return { T, W, H, s };
  }

  const svg = (W, H, belso, cimke = 'Ábra') =>
    `<svg viewBox="0 0 ${kerek(W)} ${kerek(H)}" class="abra" style="max-width:${Math.round(W)}px" role="img" aria-label="${cimke}">${belso}</svg>`;
  const sokszog = (P, o = '') => `<polygon points="${P.map((p) => p.map(kerek).join(',')).join(' ')}" class="${o}"/>`;
  const szakasz = (P, Q, o = '') =>
    `<line x1="${kerek(P[0])}" y1="${kerek(P[1])}" x2="${kerek(Q[0])}" y2="${kerek(Q[1])}" class="${o}"/>`;
  const szoveg = (x, y, t, o = '', h = 'middle') =>
    `<text x="${kerek(x)}" y="${kerek(y)}" text-anchor="${h}" dominant-baseline="middle" class="cimke ${o}">${t}</text>`;
  const kozeppont = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
  const csoport = (belso, uj) => `<g${uj ? ' class="uj"' : ''}>${belso}</g>`;

  // Felirat egy szakasz mellé, a K ponttól (pl. a sokszög közepétől) elfelé.
  function oldalCimke(P, Q, K, t, o = '') {
    const M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
    let n = egys([-(Q[1] - P[1]), Q[0] - P[0]]);
    if (n[0] * (M[0] - K[0]) + n[1] * (M[1] - K[1]) < 0) n = [-n[0], -n[1]];
    // Ferde oldalnál a szöveg vízszintesen is elfelé „lóg”, hogy ne takarja az oldalt.
    const h = n[0] > 0.3 ? 'start' : n[0] < -0.3 ? 'end' : 'middle';
    const tav = h === 'middle' ? 14 : 8;
    return szoveg(M[0] + n[0] * tav, M[1] + n[1] * (h === 'middle' ? tav : tav + 6), t, o, h);
  }

  // Derékszög jele a P csúcsnál, az A és B felé mutató szárak között.
  function derekszogJel(P, A, B, meret = 11) {
    const u = egys([A[0] - P[0], A[1] - P[1]]).map((v) => v * meret);
    const w = egys([B[0] - P[0], B[1] - P[1]]).map((v) => v * meret);
    return `<path d="M${kerek(P[0] + u[0])} ${kerek(P[1] + u[1])} L${kerek(P[0] + u[0] + w[0])} ${kerek(P[1] + u[1] + w[1])} L${kerek(P[0] + w[0])} ${kerek(P[1] + w[1])}" class="jelolo"/>`;
  }

  // Szögív és felirat a P csúcsnál (A és B a két szár irányában), mindig a kisebbik szögre.
  function szogIv(P, A, B, felirat, o = '', r = 24) {
    const u = egys([A[0] - P[0], A[1] - P[1]]);
    const w = egys([B[0] - P[0], B[1] - P[1]]);
    const sweep = u[0] * w[1] - u[1] * w[0] > 0 ? 1 : 0;
    return Rajz.iv(P, A, B, r, sweep, felirat, o);
  }

  // Szaggatott magasságvonal a „felso” ponttól a „talp” pontig, derékszögjellel és felirattal.
  function magassag(F, G, felirat, alapIrany, o = 'piros') {
    let b = szakasz(F, G, `oldal szaggatott vekony ${o}`);
    b += derekszogJel(G, F, [G[0] + alapIrany[0], G[1] + alapIrany[1]], 9);
    if (felirat) b += szoveg((F[0] + G[0]) / 2 + 6, (F[1] + G[1]) / 2, felirat, o, 'start');
    return b;
  }

  // Egységnégyzet-rács egy tengelypárhuzamos téglalapon belül (valós koordinátákban).
  function racs(T, x0, y0, nx, ny) {
    let b = '';
    for (let i = 1; i < nx; i++) b += szakasz(T([x0 + i, y0]), T([x0 + i, y0 + ny]), 'racs');
    for (let j = 1; j < ny; j++) b += szakasz(T([x0, y0 + j]), T([x0 + nx, y0 + j]), 'racs');
    return b;
  }

  // Általános sokszög oldal- és szögfeliratokkal.
  // oldalak[i]: az i. csúcstól az (i+1).-ig tartó oldal felirata; szogek[i]: az i. csúcs szögének felirata.
  // derek: azon csúcsok sorszáma, ahol derékszögjelet rajzolunk. extra(T): további elemek.
  function idom(pontok, { oldalak = [], kiemel = [], szogek = [], derek = [], extra, extraPontok = [], keret, kitolt = 'idom-kitolt', cimke } = {}) {
    const { T, W, H } = illeszt(pontok.concat(extraPontok), { keret });
    const P = pontok.map(T);
    const n = P.length;
    const K = kozeppont(P);
    let b = sokszog(P, `oldal ${kitolt}`);
    P.forEach((p, i) => {
      const q = P[(i + 1) % n];
      if (kiemel[i]) b += szakasz(p, q, `oldal ${kiemel[i]}`);
      if (oldalak[i] != null) b += oldalCimke(p, q, K, oldalak[i], kiemel[i] || '');
    });
    derek.forEach((i) => (b += derekszogJel(P[i], P[(i + 1) % n], P[(i - 1 + n) % n])));
    szogek.forEach((t, i) => {
      if (t != null) b += szogIv(P[i], P[(i + 1) % n], P[(i - 1 + n) % n], t, 'kek');
    });
    if (extra) b += extra(T, P);
    return svg(W, H, b, cimke);
  }

  // ---- Kész síkidom-rajzok ----
  // cimkek: a feliratok; amelyik hiányzik, az nem jelenik meg.

  function teglalap(a, b, { cimkek = {}, kiemel = {}, racsos = false, keret } = {}) {
    const pontok = [[0, 0], [a, 0], [a, b], [0, b]];
    return idom(pontok, {
      oldalak: [cimkek.a, cimkek.b, cimkek.c, cimkek.d],
      kiemel: [kiemel.a, kiemel.b],
      derek: [0, 1, 2, 3],
      keret,
      cimke: 'Téglalap',
      extra: (T) =>
        (racsos ? racs(T, 0, 0, a, b) : '') +
        (cimkek.atlo ? szakasz(T([0, 0]), T([a, b]), 'oldal szaggatott zold') + szoveg(...T([a / 2, b / 2]), cimkek.atlo, 'zold', 'end') : ''),
    });
  }

  function paralelogramma(a, m, x, { cimkek = {}, keret } = {}) {
    const pontok = [[0, 0], [a, 0], [a + x, m], [x, m]];
    return idom(pontok, {
      oldalak: [cimkek.a, cimkek.b],
      keret,
      cimke: 'Paralelogramma',
      extra: (T) => (cimkek.m ? magassag(T([x, m]), T([x, 0]), cimkek.m, [1, 0]) : ''),
    });
  }

  function trapez(a, c, m, x, { cimkek = {}, keret } = {}) {
    const pontok = [[0, 0], [a, 0], [x + c, m], [x, m]];
    return idom(pontok, {
      oldalak: [cimkek.a, cimkek.b, cimkek.c, cimkek.d],
      keret,
      cimke: 'Trapéz',
      extra: (T) => (cimkek.m ? magassag(T([x, m]), T([x, 0]), cimkek.m, [1, 0]) : ''),
    });
  }

  // Rombusz és deltoid az átlóival: e vízszintes átló, f1 felfelé, f2 lefelé a vízszintes átlótól.
  function atlosNegyszog(e, f1, f2, { cimkek = {}, keret, cimke } = {}) {
    const pontok = [[-e / 2, 0], [0, -f2], [e / 2, 0], [0, f1]];
    return idom(pontok, {
      oldalak: [cimkek.a, cimkek.b, cimkek.c, cimkek.d],
      keret,
      cimke,
      extra: (T) => {
        let b = '';
        // Az e felirata a vízszintes átló alá (jobbra), az f felirata a függőleges átló felső felére kerül.
        if (cimkek.e !== undefined) b += szakasz(T([-e / 2, 0]), T([e / 2, 0]), 'oldal szaggatott vekony kek') + (cimkek.e ? szoveg(T([e / 4, 0])[0], T([0, 0])[1] + 13, cimkek.e, 'kek') : '');
        if (cimkek.f !== undefined) b += szakasz(T([0, f1]), T([0, -f2]), 'oldal szaggatott vekony piros') + (cimkek.f ? szoveg(T([0, 0])[0] - 6, T([0, f1 / 2])[1], cimkek.f, 'piros', 'end') : '');
        return b;
      },
    });
  }
  const rombusz = (e, f, opc = {}) => atlosNegyszog(e, f / 2, f / 2, { cimke: 'Rombusz', ...opc });
  const deltoid = (e, f1, f2, opc = {}) => atlosNegyszog(e, f1, f2, { cimke: 'Deltoid', ...opc });

  // Háromszög: a alap vízszintesen, a csúcs (x; m) pontban.
  function haromszog(a, m, x, { cimkek = {}, szogek = [], derek = [], keret } = {}) {
    const pontok = [[0, 0], [a, 0], [x, m]];
    return idom(pontok, {
      oldalak: [cimkek.a, cimkek.b, cimkek.c],
      szogek,
      derek,
      keret,
      cimke: 'Háromszög',
      extra: (T) => (cimkek.m && x > 0 && x < a ? magassag(T([x, m]), T([x, 0]), cimkek.m, [1, 0]) : ''),
    });
  }

  function kor(r, { cimkek = {}, keret = [220, 220] } = {}) {
    const { T, s, W, H } = illeszt([[-r, -r], [r, r]], { keret });
    const O = T([0, 0]);
    let b = `<circle cx="${kerek(O[0])}" cy="${kerek(O[1])}" r="${kerek(r * s)}" class="oldal idom-kitolt"/>`;
    b += `<circle cx="${kerek(O[0])}" cy="${kerek(O[1])}" r="3" class="pont"/>`;
    if (cimkek.r) b += szakasz(O, T([r, 0]), 'oldal piros') + szoveg(...T([r / 2, 0]).map((v, i) => v - (i ? 10 : 0)), cimkek.r, 'piros');
    if (cimkek.d) b += szakasz(T([-r, 0]), T([r, 0]), 'oldal kek') + szoveg(...T([0, 0]).map((v, i) => v + (i ? 14 : 0)), cimkek.d, 'kek');
    if (cimkek.k) b += szoveg(...T([0.72 * r, 0.72 * r]).map((v, i) => v + (i ? -8 : 8)), cimkek.k, 'zold', 'start');
    return svg(W, H, b, 'Kör');
  }

  // Törtsáv: egy léc n egyenlő részre osztva, ebből sz rész színezve.
  function tortSav(szamlalo, nevezo, { szel = 280, mag = 44, cimke } = {}) {
    const d = szel / nevezo;
    let b = '';
    for (let i = 0; i < nevezo; i++) {
      b += `<rect x="${kerek(10 + i * d)}" y="10" width="${kerek(d)}" height="${mag}" class="${i < szamlalo ? 'tort-teli' : 'tort-ures'}"/>`;
    }
    if (cimke) b += szoveg(10 + szel / 2, mag + 28, cimke);
    return svg(szel + 20, mag + (cimke ? 44 : 20), b, 'Törtsáv');
  }

  // Számegyenes beosztással. jelek: [{ v, t, o }] pontok felirattal; ugras: { tol, ig, t } ív nyíllal.
  function szamegyenes(min, max, { lepes = 1, cimkeLepes = lepes, jelek = [], ugras, szel = 340 } = {}) {
    const m = 22;
    const X = (v) => m + ((v - min) / (max - min)) * (szel - 2 * m);
    const y = 62;
    let b = `<path d="M${m - 10} ${y} H${szel - m + 12} m-7 -5 l7 5 l-7 5" class="oldal vekony" fill="none"/>`;
    const n = Math.round((max - min) / lepes);
    for (let i = 0; i <= n; i++) {
      const v = Number((min + i * lepes).toPrecision(10));
      const nagy = Math.abs(v / cimkeLepes - Math.round(v / cimkeLepes)) < 1e-6;
      b += `<line x1="${kerek(X(v))}" y1="${y - (nagy ? 7 : 4)}" x2="${kerek(X(v))}" y2="${y + (nagy ? 7 : 4)}" class="oldal ${v === 0 ? '' : 'vekony'}"/>`;
      if (nagy) b += szoveg(X(v), y + 20, sz(v, 2), v === 0 ? '' : 'kicsi');
    }
    if (ugras) {
      const [x1, x2] = [X(ugras.tol), X(ugras.ig)];
      const ir = x2 > x1 ? 1 : -1;
      b += `<path d="M${kerek(x1)} ${y - 6} Q${kerek((x1 + x2) / 2)} ${y - 46} ${kerek(x2)} ${y - 6}" class="lepcso-nyil ${ir > 0 ? 'kek-nyil' : 'piros-nyil'}"/>`;
      b += `<path d="M${kerek(x2 - ir * 8)} ${y - 13} L${kerek(x2)} ${y - 6} L${kerek(x2 - ir * 1)} ${y - 16}" class="lepcso-nyil ${ir > 0 ? 'kek-nyil' : 'piros-nyil'}"/>`;
      if (ugras.t) b += szoveg((x1 + x2) / 2, y - 34, ugras.t, ir > 0 ? 'kek' : 'piros');
    }
    jelek.forEach(({ v, t, o = 'piros' }) => {
      b += `<circle cx="${kerek(X(v))}" cy="${y}" r="5" class="jel-pont ${o}"/>`;
      if (t) b += szoveg(X(v), y - 14, t, o);
    });
    return `<svg viewBox="0 0 ${szel} 92" class="abra szeles" role="img" aria-label="Számegyenes">${b}</svg>`;
  }

  // Tört megjelenítése a szövegben (számláló a vonal fölött, nevező alatta).
  const tort = (szamlalo, nevezo) => `<span class="tort"><span>${szamlalo}</span><span>${nevezo}</span></span>`;

  // ---- Interaktív rész csúszkákkal ----
  // csuszkak: [{ k, cim, min, max, lepes, ertek, egyseg }]; frissit(ertekek) → { rajz, szamitas }
  // A csúszka min/max határa függvény is lehet, amely a többi csúszka értékéből számol
  // (pl. a számláló legfeljebb a nevező: max: (v) => v.n). Ilyenkor minden mozdításkor
  // a határ és szükség esetén az érték is igazodik, így nem lehet értelmetlen értéket beállítani.
  function interaktiv({ csuszkak, frissit }) {
    const hatar = (h, v) => (typeof h === 'function' ? h(v) : h);
    const fuggo = csuszkak.filter((c) => typeof c.min === 'function' || typeof c.max === 'function');
    return (el) => {
      const kezdo = Object.fromEntries(csuszkak.map((c) => [c.k, c.ertek]));
      el.innerHTML = `<div class="interaktiv">
        <div class="rajz"></div>
        <div class="csuszkak">${csuszkak
          .map(
            (c) => `<label>${c.cim}: <output data-k="${c.k}"></output> ${c.egyseg || ''}
              <input type="range" min="${hatar(c.min, kezdo)}" max="${hatar(c.max, kezdo)}" step="${c.lepes}" value="${c.ertek}" data-k="${c.k}"></label>`,
          )
          .join('')}<p class="szamitas"></p></div>
      </div>`;
      const csuszka = (k) => el.querySelector(`input[data-k="${k}"]`);
      const ertekek = () => Object.fromEntries(csuszkak.map((c) => [c.k, Number(csuszka(c.k).value)]));
      // Kétszer igazítunk, hogy az egymástól kölcsönösen függő határok is beálljanak.
      const igazit = () => {
        for (let kor = 0; kor < 2; kor++) {
          const v = ertekek();
          fuggo.forEach((c) => {
            const mezo = csuszka(c.k);
            mezo.min = hatar(c.min, v);
            mezo.max = hatar(c.max, v);
            mezo.value = Math.min(Math.max(Number(mezo.value), Number(mezo.min)), Number(mezo.max));
          });
        }
      };
      const fr = () => {
        igazit();
        const v = ertekek();
        csuszkak.forEach((c) => (el.querySelector(`output[data-k="${c.k}"]`).textContent = sz(v[c.k])));
        const { rajz, szamitas } = frissit(v);
        el.querySelector('.rajz').innerHTML = rajz;
        el.querySelector('.szamitas').innerHTML = szamitas;
      };
      el.querySelectorAll('input').forEach((i) => i.addEventListener('input', fr));
      fr();
    };
  }

  // ---- Közös magyarázó dobozok ----

  const KERULET_TERULET = `
    <div class="doboz jegyezd">
      <b>Kerület vagy terület?</b> Ez a legfontosabb kérdés minden síkidomos feladatnál!
      <div class="tabla-keret"><table>
        <thead><tr><th></th><th>Kerület</th><th>Terület</th></tr></thead>
        <tbody>
          <tr><th>Mit jelent?</th><td>Körbemérve, a széle mentén</td><td>A felület nagysága, ami „belül” van</td></tr>
          <tr><th>Mértékegység</th><td>m, cm, mm</td><td>m², cm² (négyzetméter)</td></tr>
          <tr><th>Mikor kell?</th><td>szegélyléc, élzáró, kerítés, maszkolószalag, paszpól, zsalu</td><td>csempe, festék, tapéta, parketta, kárpitanyag, cserép</td></tr>
        </tbody>
      </table></div>
    </div>`;

  const MERTEKEGYSEG = `
    <div class="doboz ismetles">
      <p><b>Hosszúság</b>: 1 m = 10 dm = 100 cm = 1000 mm</p>
      <p><b>Terület</b>: 1 m² = 100 dm² = <b>10 000 cm²</b></p>
      <p>⚠️ Területnél nem 100 a váltószám, hanem 100 · 100 = 10 000! Egy 1 m × 1 m-es négyzet 100 cm × 100 cm = 10 000 cm².</p>
      <p class="pelda">Tipp: ha m²-ben kell az eredmény, <b>már az elején váltsd át a hosszakat méterre</b>: 30 cm = 0,3 m. Így 0,3 · 0,3 = 0,09 m².</p>
    </div>`;

  const ANYAG = `
    <div class="doboz szakma">
      <p><b>Anyagszükséglet kiszámolása (minden szakmában így megy):</b></p>
      <ol class="lepesek">
        <li>Számold ki a <b>területet</b> (vagy a kerületet).</li>
        <li>Vonj le, amit nem kell burkolni, festeni (ajtó, ablak).</li>
        <li>Adj hozzá <b>ráhagyást</b> a vágás, törés miatt (pl. 10%: szorozd 1,1-gyel).</li>
        <li>Festéknél: hány réteg? Szorozd meg a rétegek számával, majd oszd el a kiadóssággal (pl. 1 liter 10 m²-re elég).</li>
        <li>Csomag, doboz, vödör: <b>mindig felfelé kerekíts</b>! 2,3 doboz → 3 doboz.</li>
      </ol>
    </div>`;

  return {
    sz, illeszt, svg, sokszog, szakasz, szoveg, csoport, oldalCimke, derekszogJel, szogIv, magassag, racs, idom,
    teglalap, paralelogramma, trapez, rombusz, deltoid, haromszog, kor, tortSav, tort, szamegyenes, interaktiv,
    KERULET_TERULET, MERTEKEGYSEG, ANYAG,
  };
})();
