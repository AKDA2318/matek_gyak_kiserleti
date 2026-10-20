// Közös SVG-rajzoló segédfüggvények a témákhoz.
'use strict';

const Rajz = {
  // Szám magyar formátumban (tizedesvessző), legfeljebb `tizedes` tizedesjeggyel.
  szam(x, tizedes = 2) {
    return Number(x.toFixed(tizedes)).toLocaleString('hu-HU', { maximumFractionDigits: tizedes });
  },

  egyseg(P, Q) {
    const d = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
    return [(Q[0] - P[0]) / d, (Q[1] - P[1]) / d];
  },

  // Szögív a P csúcsnál a Q1 és Q2 felé mutató szárak között, felirattal.
  // sweep: 1 = a képernyőn az óramutató járásával egyezően rajzol Q1-től Q2 felé.
  iv(P, Q1, Q2, r, sweep, felirat, osztaly = '') {
    const u1 = Rajz.egyseg(P, Q1);
    const u2 = Rajz.egyseg(P, Q2);
    const k = Rajz.egyseg([0, 0], [u1[0] + u2[0], u1[1] + u2[1]]);
    return (
      `<path d="M${P[0] + u1[0] * r} ${P[1] + u1[1] * r} A${r} ${r} 0 0 ${sweep} ${P[0] + u2[0] * r} ${P[1] + u2[1] * r}" class="iv ${osztaly}"/>` +
      `<text x="${P[0] + k[0] * (r + 13)}" y="${P[1] + k[1] * (r + 13)}" text-anchor="middle" dominant-baseline="middle" class="cimke ${osztaly}">${felirat}</text>`
    );
  },

  // Derékszögű háromszög. A derékszög (C) bal lent van, `a` a függőleges befogó,
  // `b` a vízszintes befogó, α a jobb alsó (B) csúcsnál, β a felső (A) csúcsnál.
  // cimkek: { a, b, c } feliratok; kiemel: { a: 'piros' | 'kek' | 'zold', ... }.
  // Ha `skala` meg van adva, a rajz a `keret` méretben, rögzített nagyítással készül
  // (így a méretváltozás is látszik); különben a háromszög kitölti a keretet.
  haromszog({ a, b, cimkek = {}, kiemel = {}, alfa, beta, skala, keret = [300, 220], margo = 44 } = {}) {
    const [kW, kH] = keret;
    const s = skala ?? Math.min((kW - 2 * margo) / b, (kH - 2 * margo) / a);
    const W = skala ? kW : b * s + 2 * margo;
    const H = skala ? kH : a * s + 2 * margo;
    const C = [margo, H - margo];
    const B = [margo + b * s, H - margo];
    const A = [margo, H - margo - a * s];
    const c = Math.hypot(a, b);
    const normalis = [a / c, -b / c]; // az átfogóra merőleges, kifelé mutató irány
    const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];

    const oldal = (P, Q, nev) =>
      `<line x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}" class="oldal ${kiemel[nev] || ''}"/>`;
    const felirat = (x, y, nev, horgony = 'middle') =>
      cimkek[nev] == null
        ? ''
        : `<text x="${x}" y="${y}" text-anchor="${horgony}" dominant-baseline="middle" class="cimke ${kiemel[nev] || ''}">${cimkek[nev]}</text>`;

    let belso = oldal(C, B, 'b') + oldal(C, A, 'a') + oldal(A, B, 'c');
    belso += `<path d="M${C[0]} ${C[1] - 12} h12 v12" class="jelolo"/>`;
    belso += felirat(C[0] - 10, (C[1] + A[1]) / 2, 'a', 'end');
    belso += felirat((C[0] + B[0]) / 2, C[1] + 20, 'b');
    belso += felirat(M[0] + normalis[0] * 16, M[1] + normalis[1] * 16, 'c', 'start');
    // Keskeny szögnél a felirat nem fér el a szögívben, ezért a háromszögön kívülre kerül.
    const kulso = (x, y, szoveg) => `<text x="${x}" y="${y}" dominant-baseline="middle" class="cimke">${szoveg}</text>`;
    if (alfa) {
      const felirat = alfa === true ? 'α' : alfa;
      const szuk = b * s < 70;
      belso += Rajz.iv(B, C, A, Math.min(30, b * s * 0.35), 1, szuk ? '' : felirat);
      if (szuk) belso += kulso(B[0] + 8, B[1] - 12, felirat);
    }
    if (beta) {
      const felirat = beta === true ? 'β' : beta;
      const szuk = a * s < 70;
      belso += Rajz.iv(A, C, B, Math.min(30, a * s * 0.35), 0, szuk ? '' : felirat);
      if (szuk) belso += kulso(A[0] + 10, A[1] - 12, felirat);
    }

    // A max-width miatt a kis rajzok nem nagyítódnak fel (különben a feliratok is óriásiak lennének).
    return `<svg viewBox="0 0 ${W} ${H}" class="abra" style="max-width:${Math.round(W)}px" role="img" aria-label="Derékszögű háromszög">${belso}</svg>`;
  },

  // Nyeregtető keresztmetszete (ácsfeladatokhoz). A bal oldali szarufa, a fél fesztáv
  // és a gerincmagasság egy derékszögű háromszöget alkot; ezek színnel kiemelve.
  // cimkek: { szarufa, magassag, felfesztav, alfa } – amelyik hiányzik, az nem jelenik meg.
  nyeregteto(cimkek = {}) {
    const felirat = (x, y, szoveg, horgony, osztaly) =>
      szoveg == null
        ? ''
        : `<text x="${x}" y="${y}" text-anchor="${horgony}" dominant-baseline="middle" class="cimke ${osztaly}">${szoveg}</text>`;
    const belso =
      `<rect x="40" y="170" width="280" height="40" class="oldal haromszog-kitolt"/>` +
      `<line x1="20" y1="185" x2="180" y2="60" class="oldal zold"/>` +
      `<line x1="340" y1="185" x2="180" y2="60" class="oldal"/>` +
      `<line x1="40" y1="170" x2="180" y2="170" class="oldal kek szaggatott"/>` +
      `<line x1="180" y1="170" x2="320" y2="170" class="oldal szaggatott"/>` +
      `<line x1="180" y1="60" x2="180" y2="170" class="oldal piros szaggatott"/>` +
      `<path d="M168 170 v-12 h12" class="jelolo"/>` +
      (cimkek.alfa ? Rajz.iv([40, 170], [180, 170], [180, 60], 24, 0, cimkek.alfa) : '') +
      felirat(100, 102, cimkek.szarufa, 'end', 'zold') +
      felirat(188, 130, cimkek.magassag, 'start', 'piros') +
      felirat(132, 156, cimkek.felfesztav, 'middle', 'kek');
    return `<svg viewBox="0 0 360 220" class="abra szeles" role="img" aria-label="Nyeregtető keresztmetszete">${belso}</svg>`;
  },
};
