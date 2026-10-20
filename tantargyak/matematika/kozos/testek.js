// Térbeli testek rajza (ferde vetület): hasáb, téglatest, henger, gúla, kúp.
// A takart élek szaggatottak. A pontok (x; y; z): x jobbra, y hátrafelé (mélység), z felfelé.
'use strict';

const Test = (() => {
  const SZOG = (35 * Math.PI) / 180;
  const MELYSEG = 0.5; // a hátrafelé futó élek rövidülése
  const D = [Math.cos(SZOG), Math.sin(SZOG)]; // a mélység iránya a képen
  const vetit = ([x, y, z]) => [x + MELYSEG * y * D[0], z + MELYSEG * y * D[1]];
  const kp = (P) => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];

  // Hasáb: az elülső lap (alaplap) az x–z síkban van, csúcsai az óramutatóval ellentétes sorrendben; mélysége „hossz”.
  // cimkek: [{ p, q, t, o }] – felirat a p–q él mellé (3D pontok).
  // vonalak: [{ p, q, t, o }] – szaggatott segédvonal (pl. magasság) felirattal.
  // racs(P): további elemek (P a 3D → képpont leképezés).
  function hasab(alap, hossz, { cimkek = [], vonalak = [], keret = [300, 230], margo = 40, kitolt = 'idom-kitolt', elolKitolt, racs, cimke = 'Hasáb' } = {}) {
    const n = alap.length;
    const elol = alap.map(([x, z]) => [x, 0, z]);
    const hatul = alap.map(([x, z]) => [x, hossz, z]);
    const { T, W, H } = Geo.illeszt([...elol, ...hatul].map(vetit), { keret, margo });
    const P = (p) => T(vetit(p));
    // Az i. oldallap (az i. és az i+1. alapcsúcs között) akkor látszik, ha kifelé a mélység irányába néz.
    const lathato = alap.map((p, i) => {
      const q = alap[(i + 1) % n];
      return (q[1] - p[1]) * D[0] - (q[0] - p[0]) * D[1] > 1e-9;
    });
    let b = '';
    for (let i = 0; i < n; i++) {
      if (!lathato[i]) b += Geo.szakasz(P(hatul[i]), P(hatul[(i + 1) % n]), 'oldal szaggatott vekony rejtett');
      if (!lathato[i] && !lathato[(i - 1 + n) % n]) b += Geo.szakasz(P(elol[i]), P(hatul[i]), 'oldal szaggatott vekony rejtett');
    }
    for (let i = 0; i < n; i++) {
      if (lathato[i]) b += Geo.sokszog([elol[i], elol[(i + 1) % n], hatul[(i + 1) % n], hatul[i]].map(P), `oldal ${kitolt} oldallap`);
    }
    b += Geo.sokszog(elol.map(P), `oldal ${elolKitolt || kitolt}`);
    if (racs) b += racs(P);
    // Az elülső lap éleinek felirata az elülső lap közepétől kifelé kerül, a többié az egész test közepétől.
    const Kelol = kp(elol.map(P));
    const Kegesz = kp([...elol, ...hatul].map(P));
    vonalak.forEach(({ p, q, t, o = 'piros' }) => {
      const [A, B] = [P(p), P(q)];
      b += Geo.szakasz(A, B, `oldal szaggatott vekony ${o}`);
      if (t) b += Geo.szoveg((A[0] + B[0]) / 2 - 5, (A[1] + B[1]) / 2, t, o, 'end');
    });
    cimkek.forEach(({ p, q, t, o = '' }) => (b += Geo.oldalCimke(P(p), P(q), p[1] === 0 && q[1] === 0 ? Kelol : Kegesz, t, o)));
    return Geo.svg(W, H, b, cimke);
  }

  // Téglatest: a szélesség (x), b mélység (y), c magasság (z). Egész méreteknél rácsot is rajzolhat.
  function teglatest(a, b, c, { cimkek = {}, racsos = false, keret, margo } = {}) {
    const racs = (P) => {
      let r = '';
      const vonal = (p, q) => (r += Geo.szakasz(P(p), P(q), 'racs'));
      for (let i = 1; i < a; i++) vonal([i, 0, 0], [i, 0, c]), vonal([i, 0, c], [i, b, c]);
      for (let k = 1; k < c; k++) vonal([0, 0, k], [a, 0, k]), vonal([a, 0, k], [a, b, k]);
      for (let j = 1; j < b; j++) vonal([0, j, c], [a, j, c]), vonal([a, j, 0], [a, j, c]);
      return r;
    };
    return hasab([[0, 0], [a, 0], [a, c], [0, c]], b, {
      keret,
      margo,
      cimke: 'Téglatest',
      racs: racsos ? racs : null,
      cimkek: [
        cimkek.a && { p: [0, 0, 0], q: [a, 0, 0], t: cimkek.a },
        cimkek.b && { p: [a, 0, 0], q: [a, b, 0], t: cimkek.b },
        cimkek.c && { p: [0, 0, 0], q: [0, 0, c], t: cimkek.c },
      ].filter(Boolean),
    });
  }

  // Háromszög alapú hasáb (pl. padlástér): alul w széles, h magas, „hossz” mély.
  function haromszogHasab(w, h, hossz, { cimkek = {}, keret } = {}) {
    return hasab([[0, 0], [w, 0], [w / 2, h]], hossz, {
      keret,
      cimke: 'Háromszög alapú hasáb',
      elolKitolt: 'kitolt-sarga',
      vonalak: cimkek.h ? [{ p: [w / 2, 0, h], q: [w / 2, 0, 0], t: cimkek.h }] : [],
      cimkek: [
        cimkek.w && { p: [0, 0, 0], q: [w, 0, 0], t: cimkek.w },
        cimkek.hossz && { p: [w, 0, 0], q: [w, hossz, 0], t: cimkek.hossz },
      ].filter(Boolean),
    });
  }

  // Trapéz alapú hasáb (pl. árok, támfal): alul c, felül a széles, h magas, „hossz” hosszú.
  // forditott: az árok fent szélesebb (true), a támfal lent (false).
  function trapezHasab(a, c, h, hossz, { cimkek = {}, keret, forditott = true } = {}) {
    const [also, felso] = forditott ? [c, a] : [a, c];
    const x = (Math.max(a, c) - Math.min(a, c)) / 2;
    const alap = forditott ? [[x, 0], [x + also, 0], [felso, h], [0, h]] : [[0, 0], [also, 0], [x + felso, h], [x, h]];
    return hasab(alap, hossz, {
      keret,
      cimke: 'Trapéz alapú hasáb',
      elolKitolt: 'kitolt-sarga',
      vonalak: cimkek.h ? [{ p: [x, 0, h], q: [x, 0, 0], t: cimkek.h }] : [],
      cimkek: [
        cimkek.also && { p: [alap[0][0], 0, 0], q: [alap[1][0], 0, 0], t: cimkek.also },
        cimkek.felso && { p: [alap[2][0], 0, h], q: [alap[3][0], 0, h], t: cimkek.felso },
        cimkek.hossz && { p: [alap[1][0], 0, 0], q: [alap[1][0], hossz, 0], t: cimkek.hossz },
      ].filter(Boolean),
    });
  }

  // Álló henger: r sugár, h magasság. A hátsó alsó ív szaggatott.
  function henger(r, h, { cimkek = {}, keret = [220, 240] } = {}) {
    const ry = r * 0.32;
    const { T, W, H, s } = Geo.illeszt([[-r, -ry], [r, h + ry]], { keret });
    const [cx, alul] = T([0, 0]);
    const fent = T([0, h])[1];
    const [RX, RY] = [r * s, ry * s];
    let b = `<path d="M${cx - RX} ${fent} L${cx - RX} ${alul} A${RX} ${RY} 0 0 0 ${cx + RX} ${alul} L${cx + RX} ${fent} Z" class="oldal oldallap"/>`;
    b += `<path d="M${cx - RX} ${alul} A${RX} ${RY} 0 0 1 ${cx + RX} ${alul}" class="oldal szaggatott vekony rejtett"/>`;
    b += `<ellipse cx="${cx}" cy="${fent}" rx="${RX}" ry="${RY}" class="oldal idom-kitolt"/>`;
    if (cimkek.r) b += Geo.szakasz([cx, fent], [cx + RX, fent], 'oldal piros') + Geo.szoveg(cx + RX / 2, fent - RY - 8, cimkek.r, 'piros');
    if (cimkek.d) b += Geo.szakasz([cx - RX, fent], [cx + RX, fent], 'oldal kek') + Geo.szoveg(cx, fent - RY - 8, cimkek.d, 'kek');
    if (cimkek.h) b += Geo.szoveg(cx + RX + 8, (fent + alul) / 2, cimkek.h, '', 'start');
    return Geo.svg(W, H, b, 'Henger');
  }

  // Kúp: r alapkör-sugár, m magasság.
  function kup(r, m, { cimkek = {}, keret = [220, 240] } = {}) {
    const ry = r * 0.32;
    const { T, W, H, s } = Geo.illeszt([[-r, -ry], [r, m]], { keret });
    const [cx, alul] = T([0, 0]);
    const csucs = T([0, m]);
    const [RX, RY] = [r * s, ry * s];
    let b = `<path d="M${cx - RX} ${alul} L${csucs[0]} ${csucs[1]} L${cx + RX} ${alul} A${RX} ${RY} 0 0 1 ${cx - RX} ${alul} Z" class="oldal oldallap"/>`;
    b += `<path d="M${cx - RX} ${alul} A${RX} ${RY} 0 0 1 ${cx + RX} ${alul}" class="oldal szaggatott vekony rejtett"/>`;
    if (cimkek.m) b += Geo.szakasz(csucs, [cx, alul], 'oldal szaggatott vekony piros') + Geo.szoveg(cx + 6, (csucs[1] + alul) / 2, cimkek.m, 'piros', 'start');
    if (cimkek.r) b += Geo.szakasz([cx, alul], [cx + RX, alul], 'oldal kek') + Geo.szoveg(cx + RX / 2, alul + RY + 12, cimkek.r, 'kek');
    if (cimkek.a) b += Geo.oldalCimke([cx + RX, alul], csucs, [cx, (alul + csucs[1]) / 2], cimkek.a, 'zold');
    return Geo.svg(W, H, b, 'Kúp');
  }

  // Négyzet alapú gúla: a alapél, m magasság. A hátsó bal alsó csúcshoz futó élek szaggatottak.
  function gula(a, m, { cimkek = {}, keret = [260, 240] } = {}) {
    const A = [0, 0, 0];
    const B = [a, 0, 0];
    const C = [a, a, 0];
    const Dc = [0, a, 0];
    const E = [a / 2, a / 2, m];
    const O = [a / 2, a / 2, 0];
    const { T, W, H } = Geo.illeszt([A, B, C, Dc, E].map(vetit), { keret });
    const P = (p) => T(vetit(p));
    let b = [[A, Dc], [Dc, C], [Dc, E]].map(([p, q]) => Geo.szakasz(P(p), P(q), 'oldal szaggatott vekony rejtett')).join('');
    b += Geo.sokszog([A, B, E].map(P), 'oldal idom-kitolt');
    b += Geo.sokszog([B, C, E].map(P), 'oldal idom-kitolt oldallap');
    if (cimkek.m) b += Geo.szakasz(P(E), P(O), 'oldal szaggatott vekony piros') + Geo.szoveg(P(O)[0] + 6, (P(E)[1] + P(O)[1]) / 2, cimkek.m, 'piros', 'start');
    if (cimkek.a) b += Geo.oldalCimke(P(A), P(B), P(E), cimkek.a);
    return Geo.svg(W, H, b, 'Gúla');
  }

  return { vetit, hasab, teglatest, haromszogHasab, trapezHasab, henger, kup, gula };
})();
