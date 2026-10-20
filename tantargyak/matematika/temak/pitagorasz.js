// Téma: Pitagorasz-tétel
'use strict';

(() => {
  // ---- Animáció: négyzetek a 3-4-5 oldalú háromszög oldalain ----
  // Saját koordináta-rendszer (1 egység = 20 px); a derékszög az origóban,
  // b = 4 a vízszintes, a = 3 a függőleges befogó.
  const U = 20;
  const X = (x) => (x + 4) * U;
  const Y = (y) => (8 - y) * U;
  const sokszog = (pontok, osztaly) =>
    `<polygon points="${pontok.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" class="${osztaly}"/>`;
  const szakasz = ([x1, y1], [x2, y2]) => `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" class="racs"/>`;
  const szoveg = (x, y, t, osztaly = '') =>
    `<text x="${X(x)}" y="${Y(y)}" text-anchor="middle" dominant-baseline="middle" class="${osztaly}">${t}</text>`;
  const csoport = (belso, uj) => `<g${uj ? ' class="uj"' : ''}>${belso}</g>`;
  const svg = (belso) => `<svg viewBox="0 0 240 260" class="abra" role="img" aria-label="Négyzetek a derékszögű háromszög oldalain">${belso}</svg>`;

  const haromszog =
    sokszog([[0, 0], [4, 0], [0, 3]], 'oldal haromszog-kitolt') +
    `<path d="M${X(0)} ${Y(0.6)} H${X(0.6)} V${Y(0)}" class="jelolo"/>` +
    szoveg(0.35, 1.5, 'a', 'cimke kicsi') +
    szoveg(2, 0.35, 'b', 'cimke kicsi') +
    szoveg(1.75, 1.15, 'c', 'cimke kicsi');

  function negyzetA(felirat) {
    let r = sokszog([[0, 0], [0, 3], [-3, 3], [-3, 0]], 'kitolt-a');
    for (const x of [-1, -2]) r += szakasz([x, 0], [x, 3]);
    for (const y of [1, 2]) r += szakasz([-3, y], [0, y]);
    return r + szoveg(-1.5, 1.5, felirat, 'nagy-szam');
  }

  function negyzetB(felirat) {
    let r = sokszog([[0, 0], [4, 0], [4, -4], [0, -4]], 'kitolt-b');
    for (const x of [1, 2, 3]) r += szakasz([x, 0], [x, -4]);
    for (const y of [-1, -2, -3]) r += szakasz([0, y], [4, y]);
    return r + szoveg(2, -2, felirat, 'nagy-szam');
  }

  function negyzetC(felirat) {
    // Az átfogó irányvektora (e1) és a rá merőleges, kifelé mutató vektor (e2), egységnyi hosszon.
    const e1 = [-0.8, 0.6];
    const e2 = [0.6, 0.8];
    const P = (i, j) => [4 + i * e1[0] + j * e2[0], i * e1[1] + j * e2[1]];
    let r = sokszog([P(0, 0), P(5, 0), P(5, 5), P(0, 5)], 'kitolt-c');
    for (let i = 1; i < 5; i++) r += szakasz(P(i, 0), P(i, 5)) + szakasz(P(0, i), P(5, i));
    return r + szoveg(3.5, 3.5, felirat, 'nagy-szam');
  }

  const animacio = [
    {
      felirat: 'Ez egy <b>derékszögű háromszög</b>. Az egyik sarka olyan, mint egy ajtó sarka. Ezt a kis négyzet jelöli. A sarok melletti két oldal neve <b>befogó</b> (a és b). A leghosszabb, ferde oldal neve <b>átfogó</b> (c).',
      rajz: () => svg(csoport(haromszog, true)),
    },
    {
      felirat: 'Az a oldal 3 egység hosszú. Rajzolunk rá egy négyzetet. Számold meg a kis kockákat: 3 · 3 = <b>9</b>.',
      rajz: () => svg(csoport(negyzetA('9'), true) + haromszog),
    },
    {
      felirat: 'A b oldal 4 egység. Erre is rajzolunk egy négyzetet: 4 · 4 = <b>16</b> kis kocka.',
      rajz: () => svg(negyzetA('9') + csoport(negyzetB('16'), true) + haromszog),
    },
    {
      felirat: 'A ferde oldal (c) 5 egység. Az erre rajzolt négyzetben 5 · 5 = <b>25</b> kis kocka van.',
      rajz: () => svg(negyzetA('9') + negyzetB('16') + csoport(negyzetC('25'), true) + haromszog),
    },
    {
      felirat: 'Figyelj: <b>9 + 16 = 25</b>! A két kis négyzet együtt pont akkora, mint a nagy.',
      rajz: () => svg(negyzetA('9') + negyzetB('16') + negyzetC('9 + 16') + haromszog),
    },
    {
      felirat: 'Ez <b>minden</b> derékszögű háromszögnél így van. Betűkkel leírva: <b>a² + b² = c²</b>. Ez a Pitagorasz-tétel.',
      rajz: () => svg(csoport(negyzetA('a²') + negyzetB('b²') + negyzetC('c²'), true) + haromszog),
    },
  ];

  // ---- Interaktív rész: a befogók húzhatók, az átfogó számolódik ----
  function interaktiv(el) {
    el.innerHTML = `<div class="interaktiv">
      <div class="rajz"></div>
      <div class="csuszkak">
        <label>a (rövidebb oldal): <output data-k="a"></output><input type="range" min="1" max="12" step="0.5" value="3" data-k="a"></label>
        <label>b (rövidebb oldal): <output data-k="b"></output><input type="range" min="1" max="12" step="0.5" value="4" data-k="b"></label>
        <p class="szamitas"></p>
      </div>
    </div>`;
    const csuszka = (k) => el.querySelector(`input[data-k="${k}"]`);
    function frissit() {
      const a = Number(csuszka('a').value);
      const b = Number(csuszka('b').value);
      const c = Math.hypot(a, b);
      const sz = Rajz.szam;
      el.querySelector('output[data-k="a"]').textContent = sz(a);
      el.querySelector('output[data-k="b"]').textContent = sz(b);
      el.querySelector('.rajz').innerHTML = Rajz.haromszog({ a, b, cimkek: { a: sz(a), b: sz(b), c: 'c ≈ ' + sz(c) }, kiemel: { c: 'zold' } });
      el.querySelector('.szamitas').innerHTML =
        `1. Önmagával szorzás: ${sz(a)} · ${sz(a)} = ${sz(a * a)} és ${sz(b)} · ${sz(b)} = ${sz(b * b)}<br>` +
        `2. Összeadás: ${sz(a * a)} + ${sz(b * b)} = ${sz(a * a + b * b)}<br>` +
        `3. √ gomb: √${sz(a * a + b * b)} ≈ <b>${sz(c)}</b> → ez a ferde oldal`;
    }
    el.querySelectorAll('input').forEach((i) => i.addEventListener('input', frissit));
    frissit();
  }

  // ---- Feladatok ----
  // Rajz egy derékszögű háromszögről; a „?”-lel jelölt oldal zölden kiemelve.
  const hsz = (a, b, cimkek) => () =>
    Rajz.haromszog({ a, b, cimkek, kiemel: { [Object.keys(cimkek).find((k) => cimkek[k].includes('?'))]: 'zold' } });

  const ATFOGO_TIPP = 'A ferde, leghosszabb oldalt (átfogót) keresed. 1) Szorozd meg mindkét számot önmagával. 2) Add össze. 3) Nyomd meg a √ gombot.';
  const BEFOGO_TIPP = 'Most NEM a leghosszabb oldalt keresed, ezért kivonás kell! 1) Szorozd meg mindkét számot önmagával. 2) A nagyobból vond ki a kisebbet. 3) Nyomd meg a √ gombot.';

  const feladatok = [
    ...Tananyag.szint(1, [
      {
        kerdes: 'Melyik oldal az <b>átfogó</b> (a leghosszabb, ferde oldal)?',
        abra: () => Rajz.haromszog({ a: 3, b: 4, cimkek: { a: 'x', b: 'y', c: 'z' } }),
        valasztas: ['x', 'y', 'z'],
        valasz: 'z',
        segitseg: 'Keresd meg a kis négyzetet a sarokban. Az átfogó vele szemben van.',
        megoldas: 'A z a leghosszabb oldal, és a kis négyzettel (a derékszöggel) szemben van. Ez az átfogó.',
      },
      {
        kerdes: 'Milyen háromszögre használhatod a Pitagorasz-tételt?',
        valasztas: ['Bármilyen háromszögre', 'Csak derékszögű háromszögre'],
        valasz: 'Csak derékszögű háromszögre',
        segitseg: 'Gondolj a kis négyzetre a sarokban.',
        megoldas: 'Csak derékszögű háromszögre. Ennek az egyik sarka 90°-os, mint egy ajtó sarka.',
      },
      {
        kerdes: 'Mennyi 6²?',
        valasz: 36,
        segitseg: 'A kis 2-es azt jelenti: szorozd meg a számot önmagával. 6 · 6 = ?',
        megoldas: '6² = 6 · 6 = 36. (Nem 6 · 2!)',
      },
      {
        kerdes: 'Mennyi √49?',
        valasz: 7,
        segitseg: 'Melyik számot kell önmagával megszorozni, hogy 49 legyen? Vagy nyomd meg a számológépen: √ 49 =',
        megoldas: '√49 = 7, mert 7 · 7 = 49.',
      },
      {
        kerdes: 'Egy derékszögű háromszög két rövidebb oldala 3 cm és 4 cm. Milyen hosszú a ferde oldal (átfogó)?',
        abra: hsz(3, 4, { a: '3 cm', b: '4 cm', c: '?' }),
        valasz: 5,
        egyseg: 'cm',
        segitseg: ATFOGO_TIPP,
        megoldas: '1) 3 · 3 = 9 és 4 · 4 = 16<br>2) 9 + 16 = 25<br>3) √25 = 5<br>A ferde oldal 5 cm.',
      },
      {
        kerdes: 'A két rövidebb oldal 6 cm és 8 cm. Milyen hosszú a ferde oldal?',
        abra: hsz(6, 8, { a: '6 cm', b: '8 cm', c: '?' }),
        valasz: 10,
        egyseg: 'cm',
        segitseg: ATFOGO_TIPP,
        megoldas: '1) 6 · 6 = 36 és 8 · 8 = 64<br>2) 36 + 64 = 100<br>3) √100 = 10<br>A ferde oldal 10 cm.',
      },
      {
        kerdes: 'A két rövidebb oldal 5 cm és 12 cm. Milyen hosszú a ferde oldal?',
        abra: hsz(5, 12, { a: '5 cm', b: '12 cm', c: '?' }),
        valasz: 13,
        egyseg: 'cm',
        segitseg: ATFOGO_TIPP,
        megoldas: '1) 5 · 5 = 25 és 12 · 12 = 144<br>2) 25 + 144 = 169<br>3) √169 = 13<br>A ferde oldal 13 cm.',
      },
      {
        kerdes: 'A ház sarkát zsinórral jelölöd ki. A saroktól az egyik zsinóron 3 m-t, a másikon 4 m-t mérsz, és bejelölöd. Mekkora legyen a két jel távolsága, hogy a sarok pontosan derékszögű legyen?',
        szakma: SZAKMAK.KOMUVES,
        valasz: 5,
        egyseg: 'm',
        segitseg: 'Ez a 3-4-5 szabály. A 3 m és a 4 m a két rövidebb oldal, a két jel távolsága a ferde oldal.',
        megoldas: '√(3 · 3 + 4 · 4) = √(9 + 16) = √25 = 5 m.',
      },
      {
        kerdes: 'A gerendák sarkát ellenőrzöd. Az egyik gerendán 60 cm-t, a másikon 80 cm-t mérsz a saroktól. Mekkora legyen a két jel távolsága, ha a sarok derékszögű?',
        szakma: SZAKMAK.ACS,
        valasz: 100,
        egyseg: 'cm',
        segitseg: 'Ez is a 3-4-5 szabály, csak 20-szor nagyobban: 60 = 3 · 20, 80 = 4 · 20.',
        megoldas: '√(60 · 60 + 80 · 80) = √(3600 + 6400) = √10000 = 100 cm.',
      },
      {
        kerdes: 'A létra teteje a falon 4 m magasan van. A létra alja 3 m-re van a faltól. Milyen hosszú a létra?',
        szakma: SZAKMAK.FESTO,
        abra: hsz(4, 3, { a: '4 m', b: '3 m', c: 'létra = ?' }),
        valasz: 5,
        egyseg: 'm',
        segitseg: 'A fal és a padló derékszöget zár be. A létra a ferde oldal.',
        megoldas: '√(4 · 4 + 3 · 3) = √(16 + 9) = √25 = 5 m.',
      },
      {
        kerdes: 'A két rövidebb oldal 8 cm és 15 cm. Milyen hosszú a ferde oldal?',
        abra: hsz(8, 15, { a: '8 cm', b: '15 cm', c: '?' }),
        valasz: 17,
        egyseg: 'cm',
        segitseg: ATFOGO_TIPP,
        megoldas: '1) 8 · 8 = 64 és 15 · 15 = 225<br>2) 64 + 225 = 289<br>3) √289 = 17<br>A ferde oldal 17 cm.',
      },
    ]),
    ...Tananyag.szint(2, [
      {
        kerdes: 'A ferde oldal 10 cm, az egyik rövidebb oldal 6 cm. Milyen hosszú a másik rövidebb oldal?',
        abra: hsz(6, 8, { a: '6 cm', b: '?', c: '10 cm' }),
        valasz: 8,
        egyseg: 'cm',
        segitseg: BEFOGO_TIPP,
        megoldas: '1) 10 · 10 = 100 és 6 · 6 = 36<br>2) 100 − 36 = 64 (kivonás!)<br>3) √64 = 8<br>A keresett oldal 8 cm.',
      },
      {
        kerdes: 'A ferde oldal 13 cm, az egyik rövidebb oldal 5 cm. Milyen hosszú a másik?',
        abra: hsz(5, 12, { a: '5 cm', b: '?', c: '13 cm' }),
        valasz: 12,
        egyseg: 'cm',
        segitseg: BEFOGO_TIPP,
        megoldas: '1) 13 · 13 = 169 és 5 · 5 = 25<br>2) 169 − 25 = 144<br>3) √144 = 12<br>A keresett oldal 12 cm.',
      },
      {
        kerdes: 'A két rövidebb oldal 2 cm és 3 cm. Milyen hosszú a ferde oldal?',
        abra: hsz(2, 3, { a: '2 cm', b: '3 cm', c: '?' }),
        valasz: Math.sqrt(13),
        tizedes: 2,
        egyseg: 'cm',
        segitseg: ATFOGO_TIPP + ' Az eredmény most nem kerek szám, ezért kerekíts!',
        megoldas: '1) 2 · 2 = 4 és 3 · 3 = 9<br>2) 4 + 9 = 13<br>3) √13 ≈ 3,6056 → kerekítve 3,61<br>A ferde oldal kb. 3,61 cm.',
      },
      {
        kerdes: 'A létra 5 m hosszú. Az alja 1,4 m-re van a faltól. Milyen magasan ér a falhoz?',
        szakma: SZAKMAK.FESTO,
        abra: hsz(4.8, 1.4, { a: '?', b: '1,4 m', c: '5 m' }),
        valasz: 4.8,
        egyseg: 'm',
        segitseg: 'A létra a ferde oldal. Most a falon lévő magasságot keresed, ami NEM a ferde oldal. Kivonás kell!',
        megoldas: '1) 5 · 5 = 25 és 1,4 · 1,4 = 1,96<br>2) 25 − 1,96 = 23,04<br>3) √23,04 = 4,8<br>A létra 4,8 m magasan ér a falhoz.',
      },
      {
        kerdes: 'A szoba alaprajza egy 6 m × 8 m-es téglalap. Mennyinek kell lennie a szoba átlójának (sarokból a szemközti sarokig), ha a sarkok derékszögűek?',
        szakma: SZAKMAK.KOMUVES,
        valasz: 10,
        egyseg: 'm',
        segitseg: 'Az átló két háromszögre vágja a szobát. A két fal a két rövidebb oldal, az átló a ferde oldal.',
        megoldas: '√(6 · 6 + 8 · 8) = √(36 + 64) = √100 = 10 m. Ha a mérésnél nem 10 m jön ki, a sarkok nem derékszögűek.',
      },
      {
        kerdes: 'A gerendákon 60 cm-t és 80 cm-t mértél a saroktól. A két jel távolsága 102 cm lett. Derékszögű a sarok?',
        szakma: SZAKMAK.ACS,
        valasztas: ['Igen', 'Nem, túl nyitott (90°-nál nagyobb)', 'Nem, túl zárt (90°-nál kisebb)'],
        valasz: 'Nem, túl nyitott (90°-nál nagyobb)',
        segitseg: 'Derékszögnél 100 cm kellene. Ha a sarkot kinyitod, a jelek távolabb kerülnek egymástól.',
        megoldas: 'Derékszögnél 100 cm lenne. A 102 cm több ennél, tehát a sarok túl nyitott. Kicsit össze kell húzni.',
      },
      {
        kerdes: 'Egy szekrényajtó 45 cm széles és 200 cm magas. Milyen hosszú az átlója?',
        szakma: SZAKMAK.ASZTALOS,
        valasz: 205,
        egyseg: 'cm',
        segitseg: 'Az ajtó szélessége és magassága a két rövidebb oldal. Az átló a ferde oldal.',
        megoldas: '√(45 · 45 + 200 · 200) = √(2025 + 40000) = √42025 = 205 cm.',
      },
      {
        kerdes: 'A csempét átlósan (sarokkal felfelé) rakod le. A csempe 30 cm × 30 cm-es. Milyen hosszú az átlója?',
        szakma: SZAKMAK.BURKOLO,
        valasz: Math.sqrt(1800),
        tizedes: 1,
        egyseg: 'cm',
        segitseg: 'A csempe két oldala (30 és 30) a két rövidebb oldal, az átló a ferde oldal.',
        megoldas: '√(30 · 30 + 30 · 30) = √(900 + 900) = √1800 ≈ 42,4 cm.',
      },
      {
        kerdes: 'A tető felénél a vízszintes távolság 4 m, a tető magassága 3 m. Milyen hosszú a szarufa?',
        szakma: SZAKMAK.ACS,
        abra: () => Rajz.nyeregteto({ felfesztav: '4 m', magassag: '3 m', szarufa: 'szarufa = ?' }),
        valasz: 5,
        egyseg: 'm',
        segitseg: 'A szarufa a ferde oldal. A 4 m és a 3 m a két rövidebb oldal.',
        megoldas: '√(4 · 4 + 3 · 3) = √(16 + 9) = √25 = 5 m.',
      },
      {
        kerdes: 'Az ajtónyílás 80 cm széles és 200 cm magas. Legfeljebb milyen hosszú lapot (pl. kanapé oldallapját) tudsz átlósan bevinni rajta?',
        szakma: SZAKMAK.KARPITOS,
        valasz: Math.sqrt(46400),
        tizedes: 0,
        egyseg: 'cm',
        segitseg: 'A lap az ajtó átlójában fér be a legjobban. Az ajtó szélessége és magassága a két rövidebb oldal.',
        megoldas: '√(80 · 80 + 200 · 200) = √(6400 + 40000) = √46400 ≈ 215 cm. Ennél hosszabb lap átlósan sem fér be.',
      },
      {
        kerdes: 'Egy oszlopot ferde dúccal támasztasz ki. A dúc az oszlopon 2,4 m magasan, a földön az oszloptól 1,8 m-re van. Milyen hosszú a dúc?',
        szakma: SZAKMAK.ACS,
        valasz: 3,
        egyseg: 'm',
        segitseg: 'Az oszlop és a föld derékszöget zár be. A dúc a ferde oldal.',
        megoldas: '√(2,4 · 2,4 + 1,8 · 1,8) = √(5,76 + 3,24) = √9 = 3 m.',
      },
      {
        kerdes: 'Egy háromszög oldalai 7 cm, 24 cm és 25 cm. Derékszögű ez a háromszög?',
        valasztas: ['Igen', 'Nem'],
        valasz: 'Igen',
        segitseg: 'Szorozd meg önmagával a két rövidebbet, és add össze. Ugyanannyi, mint a leghosszabb önmagával szorozva?',
        megoldas: '7 · 7 + 24 · 24 = 49 + 576 = 625, és 25 · 25 = 625. Ugyanannyi, tehát derékszögű.',
      },
      {
        kerdes: 'Egy háromszög oldalai 6 cm, 7 cm és 9 cm. Derékszögű ez a háromszög?',
        valasztas: ['Igen', 'Nem'],
        valasz: 'Nem',
        segitseg: 'Szorozd meg önmagával a két rövidebbet, és add össze. Ugyanannyi, mint a leghosszabb önmagával szorozva?',
        megoldas: '6 · 6 + 7 · 7 = 36 + 49 = 85, de 9 · 9 = 81. Nem ugyanannyi, tehát nem derékszögű.',
      },
    ]),
    ...Tananyag.szint(3, [
      {
        kerdes: 'Az oromfal (a ház végén lévő háromszög alakú fal) alja 8 m széles, a két ferde széle 5-5 m. Milyen magas az oromfal középen?',
        szakma: SZAKMAK.KOMUVES,
        valasz: 3,
        egyseg: 'm',
        segitseg: 'Vágd ketté az oromfalat középen! Az egyik fele egy derékszögű háromszög: alja 4 m (a 8 m fele), ferde oldala 5 m. A magasságot keresed, ez nem a ferde oldal → kivonás.',
        megoldas: 'Az alj fele: 8 : 2 = 4 m.<br>√(5 · 5 − 4 · 4) = √(25 − 16) = √9 = 3 m.',
      },
      {
        kerdes: 'Egy téglalap alakú terasz egyik oldala 6 m, az átlója 10 m. Hány m² burkolat kell rá?',
        szakma: SZAKMAK.BURKOLO,
        valasz: 48,
        egyseg: 'm²',
        segitseg: 'Két lépés! 1) Pitagorasszal számold ki a másik oldalt (az átló a ferde oldal → kivonás). 2) Szorozd össze a két oldalt.',
        megoldas: '1) Másik oldal: √(10 · 10 − 6 · 6) = √(100 − 36) = √64 = 8 m.<br>2) Terület: 6 · 8 = 48 m².',
      },
      {
        kerdes: 'A ház 9 m széles, a tető magassága 2 m. Milyen hosszú a szarufa (ereszt nem számolva)?',
        szakma: SZAKMAK.ACS,
        abra: () => Rajz.nyeregteto({ felfesztav: '4,5 m', magassag: '2 m', szarufa: 'szarufa = ?' }),
        valasz: Math.sqrt(4.5 ** 2 + 2 ** 2),
        tizedes: 2,
        egyseg: 'm',
        segitseg: 'Vigyázz: a háromszögben a ház szélességének csak a FELE van benne (9 : 2 = 4,5 m).',
        megoldas: 'Fele: 9 : 2 = 4,5 m.<br>√(4,5 · 4,5 + 2 · 2) = √(20,25 + 4) = √24,25 ≈ 4,92 m.',
      },
      {
        kerdes: 'Egy lépcső 2,8 m magasra visz fel, és vízszintesen 3,6 m hosszú. Milyen hosszú a lépcső ferde oldaldeszkája (pofafája)?',
        szakma: SZAKMAK.ASZTALOS,
        valasz: Math.sqrt(2.8 ** 2 + 3.6 ** 2),
        tizedes: 2,
        egyseg: 'm',
        segitseg: 'A magasság és a vízszintes hossz a két rövidebb oldal. A pofafa a ferde oldal.',
        megoldas: '√(2,8 · 2,8 + 3,6 · 3,6) = √(7,84 + 12,96) = √20,8 ≈ 4,56 m.',
      },
      {
        kerdes: 'Egy rámpa vízszintesen 6 m hosszú, és 0,5 m-t emelkedik. Milyen hosszú a rámpa ferde felülete?',
        szakma: SZAKMAK.MAGASEPITO,
        valasz: Math.sqrt(36.25),
        tizedes: 2,
        egyseg: 'm',
        segitseg: 'A vízszintes hossz és az emelkedés a két rövidebb oldal.',
        megoldas: '√(6 · 6 + 0,5 · 0,5) = √(36 + 0,25) = √36,25 ≈ 6,02 m.',
      },
      {
        kerdes: 'Egy 40 cm átmérőjű, kerek rönkből négyzet keresztmetszetű gerendát vágnak. Legfeljebb mekkora lehet a négyzet oldala?',
        szakma: SZAKMAK.FAIPARI,
        valasz: 40 / Math.SQRT2,
        tizedes: 1,
        egyseg: 'cm',
        segitseg: 'Rajzold le! A négyzet átlója pont a kör átmérője (40 cm). A négyzet két oldala egyenlő: x és x. Tehát x · x + x · x = 40 · 40.',
        megoldas: 'x · x + x · x = 1600 → 2 · x · x = 1600 → x · x = 800 → x = √800 ≈ 28,3 cm.',
      },
      {
        kerdes: 'Egy 4 m × 4 m-es szobában a burkoló sarokból sarokba átlós díszcsíkot rak le. Milyen hosszú a csík?',
        szakma: SZAKMAK.BURKOLO,
        valasz: 4 * Math.SQRT2,
        tizedes: 2,
        egyseg: 'm',
        segitseg: 'A szoba két fala (4 m és 4 m) a két rövidebb oldal, a csík a ferde oldal.',
        megoldas: '√(4 · 4 + 4 · 4) = √(16 + 16) = √32 ≈ 5,66 m.',
      },
      {
        kerdes: 'Egy fotel háttámlája 60 cm magas, és a teteje 11 cm-rel hátrébb dől, mint az alja. Milyen hosszú a háttámla ferde éle (ennyi kárpitanyag kell rá hosszában)?',
        szakma: SZAKMAK.KARPITOS,
        valasz: 61,
        egyseg: 'cm',
        segitseg: 'A 60 cm magasság és a 11 cm hátradőlés a két rövidebb oldal.',
        megoldas: '√(60 · 60 + 11 · 11) = √(3600 + 121) = √3721 = 61 cm.',
      },
      {
        kerdes: 'Egy egyenlő szárú háromszög alja 10 cm, a két ferde oldala 13-13 cm. Milyen magas a háromszög?',
        valasz: 12,
        egyseg: 'cm',
        segitseg: 'Vágd ketté középen! Kapsz egy derékszögű háromszöget: alja 5 cm (a 10 fele), ferde oldala 13 cm.',
        megoldas: 'Az alj fele: 10 : 2 = 5 cm.<br>√(13 · 13 − 5 · 5) = √(169 − 25) = √144 = 12 cm.',
      },
      {
        kerdes: 'A ház 8 m széles, a tető 3 m magas. A szarufa az eresznél még 0,6 m-rel túlnyúlik a falon (a szarufa irányában mérve). Milyen hosszú szarufát kell levágnod?',
        szakma: SZAKMAK.ACS,
        abra: () => Rajz.nyeregteto({ felfesztav: '4 m', magassag: '3 m', szarufa: 'szarufa = ?' }),
        valasz: 5.6,
        egyseg: 'm',
        segitseg: '1) A háromszögben a ház szélességének csak a FELE van (8 : 2 = 4 m). 2) Pitagorasszal a szarufa a faltól a gerincig. 3) Add hozzá az eresz 0,6 m-ét.',
        megoldas: 'Fele: 8 : 2 = 4 m.<br>√(4 · 4 + 3 · 3) = √(16 + 9) = √25 = 5 m.<br>Ereszszel: 5 + 0,6 = 5,6 m.',
      },
      {
        kerdes: 'A ház 7,2 m széles, a tető 2,7 m magas. A szarufára 30 cm-enként tetőlécet szegezel, az eresznél és a gerincnél is van léc. Hány léc kerül egy tetőoldalra (egy szarufasorra)?',
        szakma: SZAKMAK.ACS,
        abra: () => Rajz.nyeregteto({ felfesztav: '3,6 m', magassag: '2,7 m', szarufa: 'szarufa = ?' }),
        valasz: 16,
        egyseg: 'db',
        segitseg: '1) A szarufa hossza Pitagorasszal (a szélesség fele: 3,6 m). 2) Hány 30 cm-es köz fér rá? 3) Vigyázz: a léc mindig eggyel több, mint a köz (mint a kerítésoszlopoknál)!',
        megoldas: 'Fele: 7,2 : 2 = 3,6 m.<br>Szarufa: √(3,6 · 3,6 + 2,7 · 2,7) = √(12,96 + 7,29) = √20,25 = 4,5 m.<br>Közök: 4,5 : 0,3 = 15. Lécek: 15 + 1 = 16 db.',
      },
      {
        kerdes: 'Egy 10 m hosszú, 6 m széles házra 2 m magas nyeregtető kerül (eresz nélkül). Hány m² a két tetőoldal együtt? Ennyi tetőfedő anyag kell.',
        szakma: SZAKMAK.ACS,
        abra: () => Rajz.nyeregteto({ felfesztav: '3 m', magassag: '2 m', szarufa: 'szarufa = ?' }),
        valasz: 20 * Math.sqrt(13),
        tizedes: 0,
        egyseg: 'm²',
        segitseg: '1) Szarufa Pitagorasszal (a szélesség fele: 3 m). 2) Egy tetőoldal téglalap: 10 m × szarufa. 3) Két oldal van!',
        megoldas: '1) Szarufa: √(3 · 3 + 2 · 2) = √13 ≈ 3,61 m.<br>2) Egy oldal: 10 · 3,61 ≈ 36,1 m².<br>3) Két oldal: 2 · 36,1 ≈ 72 m².',
      },
      {
        kerdes: 'Egy fedett terasz 6 oszlopának mindegyikére 2 ferde dúc (könyökfa) kerül. Egy dúc az oszlopon és a gerendán is 80 cm-re ér a saroktól. Hány méter léc kell az összes dúchoz?',
        szakma: SZAKMAK.ACS,
        valasz: 12 * Math.hypot(0.8, 0.8),
        tizedes: 1,
        egyseg: 'm',
        segitseg: '1) Egy dúc: a 0,8 m és a 0,8 m a két rövidebb oldal, a dúc a ferde oldal. 2) Hány dúc van összesen? 6 · 2.',
        megoldas: '1) Egy dúc: √(0,8 · 0,8 + 0,8 · 0,8) = √1,28 ≈ 1,13 m.<br>2) Dúcok: 6 · 2 = 12 db.<br>3) Összesen: 12 · 1,131 ≈ 13,6 m.',
      },
      {
        kerdes: 'Egy 7,5 m × 4 m-es alap zsaluzatát ellenőrzöd. Az egyik átlót 8,4 m-nek mérted. Hány cm-rel rövidebb ez annál, amennyinek derékszögű sarkoknál lennie kellene?',
        szakma: SZAKMAK.KOMUVES,
        valasz: 10,
        egyseg: 'cm',
        segitseg: '1) Számold ki, mennyi lenne a helyes átló (Pitagorasz). 2) Vond ki belőle a mért 8,4 m-t. 3) Váltsd cm-re.',
        megoldas: '1) Helyes átló: √(7,5 · 7,5 + 4 · 4) = √(56,25 + 16) = √72,25 = 8,5 m.<br>2) 8,5 − 8,4 = 0,1 m = 10 cm. A sarkok nem derékszögűek!',
      },
      {
        kerdes: 'Az eresz 5,4 m magasan van. A létra teteje legalább 1 m-rel nyúljon az eresz fölé. A létra alja 1,6 m-re lesz a faltól. Legalább milyen hosszú létra kell?',
        szakma: SZAKMAK.FESTO,
        abra: hsz(6.4, 1.6, { a: '5,4 m + 1 m', b: '1,6 m', c: 'létra = ?' }),
        valasz: Math.hypot(6.4, 1.6),
        tizedes: 2,
        egyseg: 'm',
        segitseg: '1) Milyen magasra kell érnie a létrának? 5,4 + 1. 2) Ez és a faltól mért 1,6 m a két rövidebb oldal, a létra a ferde oldal.',
        megoldas: '1) Magasság: 5,4 + 1 = 6,4 m.<br>2) √(6,4 · 6,4 + 1,6 · 1,6) = √(40,96 + 2,56) = √43,52 ≈ 6,60 m.',
      },
      {
        kerdes: 'Egy szekrény 60 cm mély és 230 cm magas. Fektetve hozzák be a szobába, ott fel kell billenteni. A szoba belmagassága 240 cm. Felállítható-e a szekrény?',
        szakma: SZAKMAK.ASZTALOS,
        valasztas: ['Igen, mert az oldallap átlója kisebb, mint 240 cm', 'Nem, mert az oldallap átlója nagyobb, mint 240 cm', 'Igen, mert 230 cm kisebb, mint 240 cm'],
        valasz: 'Igen, mert az oldallap átlója kisebb, mint 240 cm',
        segitseg: 'Billentés közben a szekrény oldallapjának átlója áll a legmagasabbra. Számold ki az átlót: a 60 és a 230 a két rövidebb oldal.',
        megoldas: 'Átló: √(60 · 60 + 230 · 230) = √(3600 + 52 900) = √56 500 ≈ 237,7 cm. Ez kisebb, mint 240 cm, tehát felállítható (de csak 2,3 cm marad!).',
      },
      {
        kerdes: '40 cm × 40 cm-es lapokat átlósan (sarokkal előre) raksz le egy 4 m hosszú fal mentén, úgy, hogy a lapok sarka egymáshoz ér. Hány egész lap fér el egy sorban?',
        szakma: SZAKMAK.BURKOLO,
        valasz: 7,
        egyseg: 'db',
        segitseg: '1) Átlósan rakva egy lap a fal mentén az átlója hosszában foglal helyet. Az átló Pitagorasszal: 40 és 40 a két rövidebb oldal. 2) 4 m = 400 cm, oszd el az átlóval. 3) Egész lap kell: lefelé kerekíts.',
        megoldas: '1) Átló: √(40 · 40 + 40 · 40) = √3200 ≈ 56,6 cm.<br>2) 400 : 56,6 ≈ 7,07.<br>3) 7 egész lap fér el.',
      },
    ]),
  ];

  Tananyag.tema('matematika', {
    azon: 'pitagorasz',
    ikon: 'a²+b²',
    animacio,
    interaktiv,
    feladatok,
    magyarazat: `
      <div class="doboz cel">
        <b>Mire jó ez neked?</b>
        <p>A munkában sokszor kell olyan hosszt tudnod, amit nem tudsz könnyen lemérni. Például:</p>
        <ul>
          <li>Milyen hosszú legyen a <b>szarufa</b> vagy a <b>létra</b>?</li>
          <li>Tényleg <b>derékszögű</b> a sarok?</li>
          <li>Befér-e a bútor <b>átlósan</b> az ajtón?</li>
        </ul>
        <p>Ebben segít a Pitagorasz-tétel. Ha megtanulod, ilyen feladatokat egy számológéppel pár perc alatt megoldasz.</p>
      </div>

      <h3>Előtte ismételjünk!</h3>
      <div class="doboz ismetles">
        <p><b>1. A kis 2-es a szám mellett (négyzetre emelés)</b></p>
        <p>Azt jelenti: a számot <b>szorozd meg önmagával</b>.</p>
        <p class="pelda">3² = 3 · 3 = 9 &nbsp;&nbsp;|&nbsp;&nbsp; 5² = 5 · 5 = 25 &nbsp;&nbsp;|&nbsp;&nbsp; 10² = 10 · 10 = 100</p>
        <p>⚠️ Vigyázz: 3² <b>nem</b> 3 · 2 = 6! Hanem 3 · 3 = 9.</p>
        <p><b>2. A gyökjel (√)</b></p>
        <p>Ez a „visszafelé” művelet. Azt kérdezi: <b>melyik számot kell önmagával szorozni</b>, hogy ezt kapd?</p>
        <p class="pelda">√25 = 5, mert 5 · 5 = 25 &nbsp;&nbsp;|&nbsp;&nbsp; √100 = 10, mert 10 · 10 = 100</p>
        <p><b>3. Számológépen</b></p>
        <ul>
          <li>Önmagával szorzás: <b>x²</b> gomb (vagy egyszerűen: 3 × 3 =).</li>
          <li>Gyökvonás: <b>√</b> gomb. A legtöbb gépen előbb a √ gombot nyomod, utána a számot, végül az = jelet.</li>
        </ul>
      </div>

      <h3>Mi az a derékszögű háromszög?</h3>
      <p>Olyan háromszög, aminek az egyik sarka <b>derékszög (90°)</b>. Olyan, mint egy ajtó sarka, vagy ahol a fal a padlóval találkozik. A rajzon egy <b>kis négyzet</b> jelöli.</p>
      <p>Az oldalainak nevük is van:</p>
      <ul>
        <li><b>Befogó</b> (a és b): a két rövidebb oldal. Ezek a derékszögű sarok mellett vannak.</li>
        <li><b>Átfogó</b> (c): a <b>leghosszabb, ferde</b> oldal. A kis négyzettel szemben van.</li>
      </ul>
      <p>💡 <b>Ha bizonytalan vagy:</b> keresd meg a kis négyzetet. Ami vele szemben van, az az átfogó.</p>

      <h3>Nézd meg lépésről lépésre!</h3>
      <p>Nyomd meg a ▶ Lejátszás gombot, vagy lépkedj a nyilakkal.</p>
      <div data-animacio></div>

      <div class="tetel">
        <b>A Pitagorasz-tétel</b>
        <p class="keplet">a² + b² = c²</p>
        <p><b>Szavakkal:</b> szorozd meg önmagával a két rövidebb oldalt, és add össze. Ez ugyanannyi, mint a leghosszabb oldal önmagával szorozva.</p>
      </div>

      <h3>Próbáld ki!</h3>
      <p>Húzd a csúszkákat. A program megmutatja, hogyan kell számolni.</p>
      <div data-interaktiv></div>

      <h3>1. eset: a leghosszabb, ferde oldalt keresed</h3>
      <p>A két rövidebb oldalt ismered. Például: szarufa, létra, átló.</p>
      <ol class="lepesek">
        <li>Mindkét számot <b>szorozd meg önmagával</b>.</li>
        <li>A két eredményt <b>add össze</b>.</li>
        <li>Nyomd meg a <b>√</b> gombot.</li>
      </ol>
      <div class="pelda"><b>Példa:</b> A két rövidebb oldal 6 m és 8 m. Milyen hosszú a ferde oldal?
        <ol>
          <li>6 · 6 = 36 &nbsp;és&nbsp; 8 · 8 = 64</li>
          <li>36 + 64 = 100</li>
          <li>√100 = 10 → <b>a ferde oldal 10 m</b></li>
        </ol>
      </div>

      <h3>2. eset: az egyik rövidebb oldalt keresed</h3>
      <p>A ferde oldalt és az egyik rövidebbet ismered. Például: milyen magasan ér a létra a falhoz?</p>
      <ol class="lepesek">
        <li>Mindkét számot <b>szorozd meg önmagával</b>.</li>
        <li>A nagyobból <b>vond ki</b> a kisebbet.</li>
        <li>Nyomd meg a <b>√</b> gombot.</li>
      </ol>
      <div class="pelda"><b>Példa:</b> A létra 5 m hosszú, az alja 3 m-re van a faltól. Milyen magasan ér a falhoz?
        <ol>
          <li>5 · 5 = 25 &nbsp;és&nbsp; 3 · 3 = 9</li>
          <li>25 − 9 = 16</li>
          <li>√16 = 4 → <b>4 m magasan ér a falhoz</b></li>
        </ol>
      </div>

      <div class="doboz jegyezd">
        <b>Összeadás vagy kivonás?</b>
        <ul>
          <li>A <b>ferde, leghosszabb</b> oldalt keresed → <b>összeadás</b>.</li>
          <li>Egy <b>rövidebb</b> oldalt keresed → <b>kivonás</b>.</li>
        </ul>
        <b>Ellenőrzés:</b> a ferde oldal mindig a leghosszabb. Ha nem így jött ki, nézd át újra!
      </div>

      <h3>Derékszögű-e a sarok? (a 3-4-5 szabály)</h3>
      <p>Ha a háromszög oldalai <b>3, 4 és 5</b> (vagy ezek többszörösei: 6-8-10, 30-40-50, 60-80-100), akkor a háromszög biztosan derékszögű. Ezt a trükköt évszázadok óta használják az építkezéseken.</p>
      <ol class="lepesek">
        <li>A saroktól mérj ki az egyik irányba <b>3 egységet</b> (pl. 3 m vagy 60 cm), és jelöld be.</li>
        <li>A másik irányba mérj ki <b>4 egységet</b> (pl. 4 m vagy 80 cm), és jelöld be.</li>
        <li>Mérd meg a két jel távolságát. Ha pontosan <b>5 egység</b> (5 m vagy 100 cm), a sarok derékszögű. ✔</li>
      </ol>
      <p>Ha <b>több</b> jött ki, a sarok túl nyitott. Ha <b>kevesebb</b>, túl zárt.</p>

      <h3>A szakmában</h3>
      <div class="doboz szakma">
        <p><b>${SZAKMAK.ACS}</b></p>
        <p>A tető felénél a vízszintes távolság (a ház szélességének <b>fele</b>) és a tető magassága a két rövidebb oldal. A <b>szarufa</b> a ferde oldal.</p>
        ${Rajz.nyeregteto({ szarufa: 'szarufa = ?', magassag: '3 m', felfesztav: '4 m' })}
        <p class="pelda">A ház 8 m széles → a fele 4 m. A tető 3 m magas.<br>Szarufa = √(4 · 4 + 3 · 3) = √25 = <b>5 m</b> (plusz az eresz).</p>
        <p>Gerendák sarkának ellenőrzése: 60 cm és 80 cm → a két jel távolsága 100 cm legyen.</p>

        <p><b>${SZAKMAK.KOMUVES}</b></p>
        <p>Az alap vagy a fal sarkát zsinórral jelölöd ki: 3 m – 4 m – 5 m. A szoba sarkait az átlóval is ellenőrizheted: egy 6 m × 8 m-es szoba átlója 10 m kell legyen.</p>

        <p><b>${SZAKMAK.BURKOLO}</b></p>
        <p>Átlós lerakásnál tudnod kell a lap átlóját. Egy 30 × 30 cm-es lap átlója: √(900 + 900) ≈ 42,4 cm. A helyiség derékszögét is ellenőrizheted a 3-4-5 szabállyal, mielőtt elkezded a sorokat.</p>

        <p><b>${SZAKMAK.FESTO}</b></p>
        <p>Milyen hosszú létra kell? A fal magassága és a létra talpának távolsága a faltól a két rövidebb oldal, a létra a ferde oldal.</p>

        <p><b>${SZAKMAK.ASZTALOS} és ${SZAKMAK.FAIPARI}</b></p>
        <p>Egy keret vagy szekrény akkor derékszögű, ha a <b>két átlója egyenlő</b>. Hogy mennyi legyen, azt Pitagorasszal számolod: egy 60 × 80 cm-es keret átlója 100 cm. Lépcsőnél a pofafa hossza a magasságból és a vízszintes hosszból jön ki.</p>

        <p><b>${SZAKMAK.KARPITOS}</b></p>
        <p>Befér-e a bútor az ajtón? Átlósan a leghosszabb tárgy fér be: egy 80 × 200 cm-es ajtón kb. 215 cm. A ferde háttámla hosszát is így számolod.</p>

        <p><b>${SZAKMAK.MAGASEPITO}</b></p>
        <p>Rámpák és lépcsők ferde hossza, ferde merevítések, tetőszerkezetek: mindenhol, ahol egy derékszögű háromszög „elbújik” a rajzban.</p>
      </div>

      <h3>Gyakori hibák</h3>
      <ul>
        <li>❌ <b>3² = 6.</b> Nem! 3² = 3 · 3 = 9.</li>
        <li>❌ <b>Elfelejted a √ gombot.</b> Az összeadás után még gyököt kell vonni!</li>
        <li>❌ <b>Kivonás helyett összeadsz.</b> Ha nem a ferde oldalt keresed, kivonni kell.</li>
        <li>❌ <b>A tetőnél a teljes szélességgel számolsz.</b> A háromszögben a szélesség <b>fele</b> van.</li>
        <li>❌ <b>Keversz cm-t és m-t.</b> Minden hossz legyen ugyanabban a mértékegységben!</li>
      </ul>

      <div class="doboz jegyezd">
        <b>Jegyezd meg!</b>
        <ul>
          <li>Csak <b>derékszögű</b> háromszögre működik.</li>
          <li>Ferde oldalt keresel: <b>szorzás önmagával → összeadás → √</b></li>
          <li>Rövidebb oldalt keresel: <b>szorzás önmagával → kivonás → √</b></li>
          <li>3 – 4 – 5: így ellenőrzöd a derékszöget.</li>
        </ul>
      </div>`,
  });
})();
