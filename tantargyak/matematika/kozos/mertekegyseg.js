// Mértékegységek: váltószámok, átváltó feladatok gyártása, „váltólépcső” rajz.
'use strict';

const Mertek = (() => {
  const sz = (x) => Rajz.szam(x, 6);
  // Lebegőpontos zaj eltüntetése (pl. 2,35 · 100 = 235,00000000000003).
  const tisztit = (x) => Number(x.toPrecision(12));

  // Minden egység az alapegységben kifejezve (m, m², m³, kg, másodperc).
  const EGYSEGEK = {
    hossz: { km: 1000, m: 1, dm: 0.1, cm: 0.01, mm: 0.001 },
    terulet: { ha: 10000, 'm²': 1, 'dm²': 0.01, 'cm²': 0.0001, 'mm²': 0.000001 },
    terfogat: { 'm³': 1, hl: 0.1, 'dm³': 0.001, l: 0.001, dl: 0.0001, cl: 0.00001, 'cm³': 0.000001, ml: 0.000001 },
    tomeg: { t: 1000, q: 100, kg: 1, dkg: 0.01, g: 0.001 },
    ido: { nap: 86400, óra: 3600, perc: 60, mp: 1 },
  };
  const fajta = (e) => Object.keys(EGYSEGEK).find((k) => e in EGYSEGEK[k]);

  // Hányszorosa az egyik egység a másiknak (pl. m → cm: 100).
  const szorzo = (honnan, hova) => tisztit(EGYSEGEK[fajta(honnan)][honnan] / EGYSEGEK[fajta(hova)][hova]);

  // Átváltó feladat: a kérdést, a választ, a segítséget és a megoldás menetét is a váltószámból számolja.
  function valtas(ertek, honnan, hova, extra = {}) {
    const f = szorzo(honnan, hova);
    const eredmeny = tisztit(ertek * f);
    const nagyobbrol = f >= 1;
    const v = nagyobbrol ? f : tisztit(1 / f);
    return {
      kerdes: `Váltsd át: ${sz(ertek)} ${honnan} = ? ${hova}`,
      valasz: eredmeny,
      egyseg: hova,
      segitseg: nagyobbrol
        ? `Nagyobb egységről kisebbre váltasz, így több lesz belőle: <b>szorzás</b>. 1 ${honnan} = ${sz(v)} ${hova}.`
        : `Kisebb egységről nagyobbra váltasz, így kevesebb lesz belőle: <b>osztás</b>. 1 ${hova} = ${sz(v)} ${honnan}.`,
      megoldas: nagyobbrol
        ? `1 ${honnan} = ${sz(v)} ${hova}, ezért szorzunk: ${sz(ertek)} · ${sz(v)} = ${sz(eredmeny)} ${hova}`
        : `1 ${hova} = ${sz(v)} ${honnan}, ezért osztunk: ${sz(ertek)} : ${sz(v)} = ${sz(eredmeny)} ${hova}`,
      ...extra,
    };
  }

  // „Váltólépcső”: az egységek sorban, nagyobbtól a kisebbig. Fölöttük jobbra (· váltószám),
  // alattuk balra (: váltószám) mutató nyíl.
  function lepcso(egysegek, valtoszamok, { kiemel = [] } = {}) {
    const doboz = 56;
    const koz = 72;
    let b = '';
    egysegek.forEach((e, i) => {
      const x = 10 + i * (doboz + koz);
      b += `<rect x="${x}" y="34" width="${doboz}" height="32" rx="6" class="${kiemel.includes(e) ? 'lepcso-kiemelt' : 'lepcso-doboz'}"/>`;
      b += Geo.szoveg(x + doboz / 2, 50, e, 'nagy-szam');
      if (i < valtoszamok.length) {
        const [x1, x2] = [x + doboz + 6, x + doboz + koz - 6];
        b += `<path d="M${x1} 42 H${x2} m-6 -4 l6 4 l-6 4" class="lepcso-nyil kek-nyil"/>`;
        b += Geo.szoveg((x1 + x2) / 2, 26, `· ${valtoszamok[i]}`, 'kek');
        b += `<path d="M${x2} 58 H${x1} m6 -4 l-6 4 l6 4" class="lepcso-nyil piros-nyil"/>`;
        b += Geo.szoveg((x1 + x2) / 2, 80, `: ${valtoszamok[i]}`, 'piros');
      }
    });
    const W = 20 + egysegek.length * doboz + (egysegek.length - 1) * koz;
    return `<svg viewBox="0 0 ${W} 96" class="abra lepcso" role="img" aria-label="Váltószámok">${b}</svg>`;
  }

  return { EGYSEGEK, szorzo, valtas, lepcso, tisztit };
})();
