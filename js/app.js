// Oldalak (kezdőlap, tantárgy, témacsoport, téma) és a gyakorlás logikája.
//
// Útvonalak:
//   #/                                        tantárgyválasztó (egy tantárgynál rögtön annak menüje)
//   #/<tantárgy>                              a tantárgy témacsoportjai
//   #/<tantárgy>/<csoport>                    altémák (csak több altémás csoportnál)
//   #/<tantárgy>/<téma>/magyarazat|gyakorlas  egy téma két füle
'use strict';

const PARONKENT = 2; // egyszerre ennyi feladat látszik
const TAROLO_KULCS = 'tananyag-v3';
const OLDAL_NEV = document.title;
const SZINTEK = ['', 'Könnyű', 'Közepes', 'Nehéz'];
const tartalom = document.getElementById('tartalom');
const $ = (s, el = document) => el.querySelector(s);

function betoltes() {
  try {
    return JSON.parse(localStorage.getItem(TAROLO_KULCS)) || {};
  } catch {
    return {};
  }
}

function mentes() {
  try {
    localStorage.setItem(TAROLO_KULCS, JSON.stringify(tarolt));
  } catch {
    // Privát módban a mentés elmaradhat; a gyakorlás ettől működik.
  }
}

const tarolt = betoltes();
tarolt.temak = tarolt.temak || {};

// Témánként azoknak a feladatoknak a sorszáma, amelyeket a diák már legalább egyszer jól megoldott.
function haladas(tantargy, temaAzon) {
  const kulcs = `${tantargy.azon}/${temaAzon}`;
  if (!tarolt.temak[kulcs]) tarolt.temak[kulcs] = { helyes: [] };
  return tarolt.temak[kulcs];
}

function temakHaladasa(tantargy, temaBejegyzesek) {
  let kesz = 0;
  let osszes = 0;
  for (const { azon } of temaBejegyzesek) {
    const tema = tantargy.temak[azon];
    if (!tema) continue;
    kesz += haladas(tantargy, azon).helyes.length;
    osszes += tema.feladatok.length;
  }
  return { kesz, osszes };
}

function haladasSav(kesz, osszes) {
  if (!osszes) return '<span class="hamarosan">Hamarosan</span>';
  return `<span class="haladas"><span class="sav"><span style="width:${(kesz / osszes) * 100}%"></span></span>${kesz} / ${osszes} feladat kész</span>`;
}

function kartya({ href, ikon, cim, leiras, kesz, osszes }) {
  const belso = `<span class="ikon">${ikon}</span><span class="nev">${cim}</span>
    ${leiras ? `<span class="leiras">${leiras}</span>` : ''}${haladasSav(kesz, osszes)}`;
  return osszes ? `<a class="tema" href="${href}">${belso}</a>` : `<div class="tema zarolt">${belso}</div>`;
}

function csoportLink(tantargy, csoport) {
  return csoport.temak.length === 1 ? `#/${tantargy.azon}/${csoport.temak[0].azon}` : `#/${tantargy.azon}/${csoport.azon}`;
}

function cimBeallit(...reszek) {
  document.title = [...reszek, OLDAL_NEV].join(' – ');
}

// ---- Oldalak ----

function kezdolap() {
  if (Tananyag.tantargyak.length === 1) return tantargyOldal(Tananyag.tantargyak[0]);
  cimBeallit();
  tartalom.innerHTML = `<p class="bevezeto">Válassz tantárgyat!</p>
    <div class="temak">${Tananyag.tantargyak
      .map((t) => kartya({ href: `#/${t.azon}`, ...t, ...temakHaladasa(t, t.menu.flatMap((c) => c.temak)) }))
      .join('')}</div>`;
}

function tantargyOldal(tantargy) {
  const tobbTantargy = Tananyag.tantargyak.length > 1;
  cimBeallit(...(tobbTantargy ? [tantargy.cim] : []));
  tartalom.innerHTML = `${tobbTantargy ? `<a class="vissza" href="#/">← Tantárgyak</a><h2>${tantargy.cim}</h2>` : ''}
    <p class="bevezeto">Válassz témát! Minden témánál először elolvashatod a magyarázatot, utána gyakorolhatsz.</p>
    <div class="temak">${tantargy.menu
      .map((c) => kartya({ href: csoportLink(tantargy, c), ...c, ...temakHaladasa(tantargy, c.temak) }))
      .join('')}</div>`;
}

function csoportOldal(tantargy, csoport) {
  cimBeallit(csoport.cim);
  tartalom.innerHTML = `<a class="vissza" href="#/${tantargy.azon}">← Témák</a><h2>${csoport.cim}</h2>
    <div class="temak">${csoport.temak
      .map((t) => {
        const tema = tantargy.temak[t.azon];
        return kartya({
          href: `#/${tantargy.azon}/${t.azon}`,
          ikon: tema ? tema.ikon : csoport.ikon,
          cim: t.cim,
          leiras: t.leiras,
          ...temakHaladasa(tantargy, [t]),
        });
      })
      .join('')}</div>`;
}

function temaOldal(tantargy, tema, ful) {
  const csoport = tantargy.menu.find((c) => c.temak.some((t) => t.azon === tema.azon));
  const vissza =
    csoport && csoport.temak.length > 1
      ? { href: `#/${tantargy.azon}/${csoport.azon}`, cim: csoport.cim }
      : { href: `#/${tantargy.azon}`, cim: 'Témák' };
  const alap = `#/${tantargy.azon}/${tema.azon}`;
  cimBeallit(tema.cim);
  tartalom.innerHTML = `<a class="vissza" href="${vissza.href}">← ${vissza.cim}</a><h2>${tema.cim}</h2>
    <nav class="fulek" aria-label="Nézet">
      <a href="${alap}/magyarazat" ${ful === 'magyarazat' ? 'aria-current="page"' : ''}>📖 Magyarázat</a>
      <a href="${alap}/gyakorlas" ${ful === 'gyakorlas' ? 'aria-current="page"' : ''}>✏️ Gyakorlás</a>
    </nav>
    <div class="panel"></div>`;
  const panel = $('.panel');
  if (ful === 'gyakorlas') gyakorlasMegnyitas({ tantargy, tema, panel });
  else magyarazat(tema, panel, alap);
}

function magyarazat(tema, panel, alap) {
  panel.innerHTML = `<article class="magyarazat">${tema.magyarazat}</article>
    <a class="gomb" href="${alap}/gyakorlas">Tovább a gyakorláshoz →</a>`;
  panel.querySelectorAll('[data-animacio]').forEach((el) => el.replaceWith(animacioLejatszo(tema.animacio)));
  panel.querySelectorAll('[data-interaktiv]').forEach((el) => tema.interaktiv(el));
}

// ---- Gyakorlás ----

function szamma(szoveg) {
  const tiszta = szoveg.replace(/\s/g, '').replace(',', '.').replace('−', '-').replace(/°|%/g, '');
  if (tiszta === '' || isNaN(tiszta)) return null;
  return Number(tiszta);
}

function lnko(a, b) {
  return b ? lnko(b, a % b) : Math.abs(a);
}

// Tört alakú válasz: „3/4”, „1 1/2” (vegyes szám) vagy egész szám → [számláló, nevező]; egyébként null.
function tortte(szoveg) {
  const t = szoveg.trim().replace(/\s+/g, ' ').replace('−', '-');
  let m = t.match(/^(-?)(\d+) (\d+)\/(\d+)$/);
  if (m) return +m[4] ? [(m[1] ? -1 : 1) * (+m[2] * +m[4] + +m[3]), +m[4]] : null;
  m = t.match(/^(-?\d+)\/(\d+)$/);
  if (m) return +m[2] ? [+m[1], +m[2]] : null;
  return /^-?\d+$/.test(t) ? [+t, 1] : null;
}

// Kerekítendő feladatnál az utolsó jegyben 1 eltérést elfogadunk (eltérő kerekítés miatt).
// relTures: arányos tűrés, pl. π-s feladatoknál, hogy a 3,14-dal számolt eredmény is jó legyen.
function ertekel(f, valasz) {
  if (f.valasztas) return valasz === f.valasz;
  if (f.tort) {
    const t = tortte(valasz);
    // Ha nem kifejezetten tört alakot kérünk (egyszerűsítés), a tizedes alak is jó (pl. 0,75 = 3/4).
    if (!t) return !f.egyszerusitve && szamma(valasz) !== null && Math.abs(szamma(valasz) - f.tort[0] / f.tort[1]) < 1e-9;
    if (t[0] * f.tort[1] !== f.tort[0] * t[1]) return false;
    return !f.egyszerusitve || lnko(t[0], t[1]) === 1;
  }
  const szam = szamma(valasz);
  if (szam === null) return false;
  const tures = Math.max(f.tizedes != null ? 1.01 * 10 ** -f.tizedes : 1e-9, Math.abs(f.valasz) * (f.relTures || 0));
  return Math.abs(szam - f.valasz) <= tures;
}

function helyesValasz(f) {
  if (f.valasztas) return f.valasz;
  if (f.tort) return (f.tort[1] === 1 ? String(f.tort[0]) : `${f.tort[0]}/${f.tort[1]}`) + (f.egyseg ? ' ' + f.egyseg : '');
  return Rajz.szam(f.valasz, f.tizedes ?? 6) + (f.egyseg ? ' ' + f.egyseg : '');
}

function kerekitesSzoveg(tizedes) {
  if (tizedes == null) return '';
  const szoveg = tizedes === 0 ? 'Egész számra' : `${['', 'Egy', 'Két', 'Három'][tizedes]} tizedesjegyre`;
  return `<p class="kerekites">${szoveg} kerekíts.</p>`;
}

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// A megoldás szövegét lépésekre bontja: sortörésnél, illetve mondatonként (pont, szóköz,
// utána nagybetű, szám vagy jel). Rövidítés (kb., pl.) után nem bont; listát, táblázatot nem bont.
const ROVIDITES = /(?:^|[\s(])(?:kb|pl|stb|ill|ún|vö|ford)$/i;
function lepesekre(szoveg) {
  if (!szoveg) return [];
  if (/<(ol|ul|li|table)/i.test(szoveg)) return [szoveg];
  // „1) … <br>2) …” alakú megoldás: a saját sorszámát elhagyjuk, mert a lista úgyis számoz.
  if (/<br\s*\/?>/i.test(szoveg)) return szoveg.split(/<br\s*\/?>/i).map((x) => x.trim().replace(/^\d+\)\s*/, '')).filter(Boolean);
  const darabok = [];
  const re = /\.\s+(?=[A-ZÁÉÍÓÖŐÚÜŰ0-9(√−-])/g;
  let eleje = 0;
  let m;
  while ((m = re.exec(szoveg))) {
    if (ROVIDITES.test(szoveg.slice(eleje, m.index))) continue;
    darabok.push(szoveg.slice(eleje, m.index + 1).trim());
    eleje = m.index + m[0].length;
  }
  darabok.push(szoveg.slice(eleje).trim());
  return darabok.filter(Boolean);
}

// Egy lépésből elrejti a végeredményt („?”): ahol a helyes válasz eredményként szerepel
// (=, ≈, → után), és az utolsó előfordulását. Ha a válasz nincs a lépésben, null.
function ertekElrejtve(lepes, f) {
  if (f.tort || f.valasztas) return null;
  // A szám ezres tagolással vagy anélkül is szerepelhet (9900 / 9 900).
  const [, elojel, egesz, tort = ''] = Rajz.szam(f.valasz, f.tizedes ?? 6)
    .replace(/[\s ]/g, '')
    .match(/^([−-]?)(\d+)(,\d+)?$/) || [];
  if (!egesz) return null;
  const csoportok = egesz.replace(/\B(?=(\d{3})+$)/g, ' ').split(' ');
  const minta = (elojel ? '[−-]' : '') + csoportok.join('[\\s\\u00a0]?') + tort;
  const re = new RegExp(`(?<![\\d,]|\\d[\\s\\u00a0])${minta}(?![\\d]|,\\d|[\\s\\u00a0]\\d{3})`, 'g');
  const talalatok = [...lepes.matchAll(re)];
  if (!talalatok.length) return null;
  const utolso = talalatok[talalatok.length - 1];
  let ki = lepes;
  talalatok
    .filter((t) => t === utolso || /(=|≈|→)\s*(<b>)?\s*$/.test(lepes.slice(0, t.index)))
    .reverse()
    .forEach((t) => (ki = ki.slice(0, t.index) + '<b>?</b>' + ki.slice(t.index + t[0].length)));
  return ki;
}

// Ha a válasz nem található meg szó szerint: az utolsó „= szám” / „≈ szám” rész helyére „?”.
function egyenlosegElrejtve(lepes) {
  const m = [...lepes.matchAll(/(=|≈)\s*(?:<b>)?\s*[−-]?\d[\d  ]*(?:,\d+)?(?:<\/b>)?/g)].pop();
  if (!m) return null;
  return `${lepes.slice(0, m.index)}${m[1]} <b>?</b> ${lepes.slice(m.index + m[0].length).trim()}`;
}

// A segítségben egyenként megmutatható lépések: a megoldás lépései addig, amíg a végeredmény
// kijön, de abból a végeredményt elrejtjük, hogy azt a diák számolja ki. (Az utána következő
// megjegyzések csak a teljes megoldásban látszanak.) Választós feladatnál nincs ilyen.
function segitoLepesek(f) {
  const lepesek = lepesekre(f.megoldas);
  if (!lepesek.length || f.valasztas) return [];
  for (let j = lepesek.length - 1; j >= 0; j--) {
    const rejtett = ertekElrejtve(lepesek[j], f);
    if (rejtett) return [...lepesek.slice(0, j), rejtett];
  }
  const utolso = egyenlosegElrejtve(lepesek[lepesek.length - 1]);
  return utolso ? [...lepesek.slice(0, -1), utolso] : lepesek.slice(0, -1);
}

function megoldasHTML(f) {
  const lepesek = lepesekre(f.megoldas);
  return lepesek.length > 1
    ? `<div class="megoldas"><b>Így kell megoldani:</b><ol>${lepesek.map((l) => `<li>${l}</li>`).join('')}</ol></div>`
    : `<div class="megoldas">${f.megoldas}</div>`;
}

// Kétválasztásos (igen/nem) feladatnál nincs második esély, mert ott a második tipp már biztos talált.
const masodikEsely = (f) => !f.valasztas || f.valasztas.length > 2;

function feladatKartya(f, i) {
  const bemenet = f.valasztas
    ? `<div class="valasztasok">${f.valasztas
        .map((o) => `<label><input type="radio" name="f${i}" value="${attr(o)}"><span>${o}</span></label>`)
        .join('')}</div>`
    : `<label class="valasz-sor">Válasz: <input type="text" name="f${i}" inputmode="${f.tort ? 'text' : 'decimal'}" autocomplete="off">${
        f.egyseg ? `<span>${f.egyseg}</span>` : ''
      }</label>${f.tort ? '<p class="kerekites">Törtet így írj be: 3/4 (vegyes számot így: 1 1/2)</p>' : ''}`;
  const lepesSzam = segitoLepesek(f).length;
  const segitseg =
    f.segitseg || lepesSzam
      ? `<details class="segitseg"><summary>💡 Segítség</summary><div>
          ${f.segitseg ? `<p class="tipp"><b>Tipp:</b> ${f.segitseg}</p>` : ''}
          ${
            lepesSzam
              ? `<ol class="segito-lepesek"></ol><button type="button" class="gomb kicsi masodlagos" data-lepes="${i}">🪜 Mutass egy lépést (${lepesSzam} lépés)</button>`
              : ''
          }
        </div></details>`
      : '';
  return `<section class="kartya feladat">
    <h3>${i + 1}. feladat ${f.szint ? `<span class="szint-cimke szint-${f.szint}">${SZINTEK[f.szint]}</span>` : ''}${
      f.szakma ? `<span class="szakma-cimke">${f.szakma}</span>` : ''
    }</h3>
    <div class="kerdes">${f.kerdes}</div>
    ${f.abra ? `<div class="rajz">${f.abra()}</div>` : ''}
    ${kerekitesSzoveg(f.tizedes)}
    ${segitseg}
    ${bemenet}
    <div class="visszajelzes" aria-live="polite"></div>
  </section>`;
}

function valaszKiolvas(urlap, i) {
  const mezo = urlap.elements[`f${i}`];
  return mezo instanceof RadioNodeList ? mezo.value : mezo.value.trim();
}

// ---- Gyakorlás ----
// A futó gyakorlás állása témánként a böngészőben marad (haladas(...).menet), így ha a diák
// elnavigál és visszajön, ott folytatja, ahol abbahagyta, és lapozhat a feladatok között.
// menet: { sor: [feladatindexek], poz: az aktuális oldal első helye a sorban,
//          eredmeny: { [feladatindex]: { valasz, allapot: 'masodik' | 'jo' | 'rossz', masodikra } } }

const kesz = (e) => e && (e.allapot === 'jo' || e.allapot === 'rossz');
const helyesDb = (menet) => menet.sor.filter((i) => menet.eredmeny[i]?.allapot === 'jo').length;
const hibasak = (menet) => menet.sor.filter((i) => menet.eredmeny[i]?.allapot === 'rossz');
const keszDb = (menet) => menet.sor.filter((i) => kesz(menet.eredmeny[i])).length;

function gyakorlasInditas(ctx, sor) {
  haladas(ctx.tantargy, ctx.tema.azon).menet = { sor, poz: 0, eredmeny: {} };
  mentes();
  oldalMutat(ctx);
}

// A Gyakorlás fül megnyitása: ha van félbehagyott gyakorlás, azt folytatjuk.
function gyakorlasMegnyitas(ctx) {
  const { tantargy, tema } = ctx;
  const menet = haladas(tantargy, tema.azon).menet;
  const ervenyes = menet && menet.sor.length && menet.sor.every((i) => i < tema.feladatok.length);
  if (!ervenyes) return gyakorlasInditas(ctx, tema.feladatok.map((_, i) => i));
  if (keszDb(menet) === menet.sor.length) return osszegzes(ctx);
  oldalMutat(ctx);
}

function lapozo(menet) {
  const oldalak = Math.ceil(menet.sor.length / PARONKENT);
  const aktualis = menet.poz / PARONKENT;
  const gombok = Array.from({ length: oldalak }, (_, o) => {
    const eredmenyek = menet.sor.slice(o * PARONKENT, (o + 1) * PARONKENT).map((i) => menet.eredmeny[i]);
    const allapot = !eredmenyek.every(kesz) ? '' : eredmenyek.some((e) => e.allapot === 'rossz') ? 'kesz-hibas' : 'kesz-jo';
    const cimke = `${o + 1}. oldal${allapot ? ', kész' : ''}`;
    return `<button type="button" class="lap ${allapot}${o === aktualis ? ' aktualis' : ''}" data-oldal="${o}" aria-label="${cimke}"${
      o === aktualis ? ' aria-current="page"' : ''
    }>${o + 1}</button>`;
  }).join('');
  return `<nav class="lapozo" aria-label="Lapozás a feladatok között">
    <button type="button" class="gomb kicsi masodlagos" data-oldal="${aktualis - 1}"${aktualis === 0 ? ' disabled' : ''}>← Előző</button>
    <span class="lapok">${gombok}</span>
    <button type="button" class="gomb kicsi masodlagos" data-oldal="${aktualis + 1}"${aktualis === oldalak - 1 ? ' disabled' : ''}>Következő →</button>
  </nav>`;
}

const joHTML = (f, masodikra) => `<p class="jo">✔ ${masodikra ? 'Helyes, második próbálkozásra! Ügyes vagy, hogy nem adtad fel.' : 'Helyes!'}</p>
  <details><summary>Megoldás megtekintése</summary>${megoldasHTML(f)}</details>`;
const rosszHTML = (f) => `<p class="rossz">✘ Most nem sikerült. A helyes válasz: <b>${helyesValasz(f)}</b></p>${megoldasHTML(f)}
  <p class="biztatas">Nézd át a lépéseket! A végén ezt a feladatot újra gyakorolhatod.</p>`;
const masodikHTML = (k) => `<p class="figyel">✘ Ez még nem jó, de van még egy esélyed!</p>
  <p>Nyisd ki a 💡 Segítséget, nézd meg a lépéseket, és javítsd ki a válaszod.</p>
  <button type="button" class="gomb kicsi masodlagos" data-felad="${k}">Inkább megnézem a megoldást</button>`;

function oldalMutat(ctx) {
  const { tantargy, tema, panel } = ctx;
  const menet = haladas(tantargy, tema.azon).menet;
  const { sor, poz, eredmeny } = menet;
  const indexek = sor.slice(poz, poz + PARONKENT);
  const oldalak = Math.ceil(sor.length / PARONKENT);
  const folytatas = keszDb(menet) > 0 && indexek.some((i) => !kesz(eredmeny[i]));
  // Minden oldalváltáskor új .gyakorlo elem készül, így az eseménykezelők nem halmozódnak.
  panel.innerHTML = `<div class="gyakorlo">
    <div class="savsor"><span>${poz / PARONKENT + 1}. oldal / ${oldalak}</span><span class="pontszam">${helyesDb(menet)} helyes válasz</span></div>
    <div class="haladas-sav"><span style="width:${(keszDb(menet) / sor.length) * 100}%"></span></div>
    ${folytatas ? '<p class="folytatas">Ott folytatod, ahol abbahagytad. <button type="button" class="link-gomb" data-m="elorol">Előről kezdem</button></p>' : ''}
    <form class="feladatpar" novalidate>
      ${indexek.map((i) => feladatKartya(tema.feladatok[i], i)).join('')}
      <p class="figyelmeztetes" aria-live="polite"></p>
      <button type="submit" class="gomb">Ellenőrzés</button>
    </form>
    ${lapozo(menet)}</div>`;
  const doboz = $('.gyakorlo', panel);
  const urlap = $('form', doboz);
  const gomb = $('button[type="submit"]', urlap);
  const kartyak = urlap.querySelectorAll('.feladat');
  const oldalKesz = () => indexek.every((i) => kesz(eredmeny[i]));

  // Egy feladatkártya megjelenítése a tárolt eredménye szerint (beírt válasz, visszajelzés).
  const rajzol = (k) => {
    const i = indexek[k];
    const f = tema.feladatok[i];
    const e = eredmeny[i];
    const kartyaEl = kartyak[k];
    if (!e) return;
    const mezo = urlap.elements[`f${i}`];
    if (mezo instanceof RadioNodeList) mezo.forEach((r) => (r.checked = r.value === e.valasz));
    else mezo.value = e.valasz;
    kartyaEl.classList.remove('masodik', 'helyes', 'hibas');
    const visszajelzes = $('.visszajelzes', kartyaEl);
    if (e.allapot === 'masodik') {
      kartyaEl.classList.add('masodik');
      visszajelzes.innerHTML = masodikHTML(k);
      const segitseg = $('.segitseg', kartyaEl);
      if (segitseg) segitseg.open = true;
      return;
    }
    kartyaEl.classList.add(e.allapot === 'jo' ? 'helyes' : 'hibas');
    visszajelzes.innerHTML = e.allapot === 'jo' ? joHTML(f, e.masodikra) : rosszHTML(f);
    kartyaEl.querySelectorAll('input').forEach((el) => (el.disabled = true));
  };
  const gombFrissit = () => {
    gomb.textContent = !oldalKesz()
      ? indexek.some((i) => eredmeny[i]?.allapot === 'masodik')
        ? 'Újra ellenőrzöm'
        : 'Ellenőrzés'
      : keszDb(menet) === sor.length
        ? 'Eredmény megtekintése'
        : `Következő ${PARONKENT} feladat →`;
  };
  const frissitSav = () => {
    $('.pontszam', panel).textContent = `${helyesDb(menet)} helyes válasz`;
    $('.haladas-sav span', panel).style.width = `${(keszDb(menet) / sor.length) * 100}%`;
    $('.lapozo', panel).outerHTML = lapozo(menet);
  };
  const ugras = (oldal) => {
    menet.poz = Math.max(0, Math.min(oldalak - 1, oldal)) * PARONKENT;
    mentes();
    oldalMutat(ctx);
    panel.scrollIntoView({ block: 'start' });
  };
  indexek.forEach((_, k) => rajzol(k));
  gombFrissit();

  doboz.addEventListener('click', (e) => {
    const lap = e.target.closest('[data-oldal]');
    if (lap && !lap.disabled) return ugras(+lap.dataset.oldal);
    if (e.target.closest('[data-m="elorol"]')) {
      if (confirm('Biztosan előről kezded? Az ebben a gyakorlásban adott válaszaid törlődnek (a témánál jelzett haladás megmarad).')) {
        gyakorlasInditas(ctx, tema.feladatok.map((_, i) => i));
      }
    }
  });

  urlap.addEventListener('click', (e) => {
    // Segítség: a következő lépés megmutatása
    const lepesGomb = e.target.closest('[data-lepes]');
    if (lepesGomb) {
      const lepesek = segitoLepesek(tema.feladatok[+lepesGomb.dataset.lepes]);
      const lista = lepesGomb.previousElementSibling;
      lista.insertAdjacentHTML('beforeend', `<li>${lepesek[lista.children.length]}</li>`);
      const maradt = lepesek.length - lista.children.length;
      if (maradt) lepesGomb.textContent = `🪜 Mutasd a következő lépést (még ${maradt})`;
      else lepesGomb.outerHTML = '<p class="biztatas">Most már csak a „?” helyére kell kiszámolnod az eredményt. Menni fog! 💪</p>';
      return;
    }
    // Második esélynél: „Inkább megnézem a megoldást”
    const feladGomb = e.target.closest('[data-felad]');
    if (feladGomb) {
      const k = +feladGomb.dataset.felad;
      eredmeny[indexek[k]].allapot = 'rossz';
      mentes();
      rajzol(k);
      gombFrissit();
      frissitSav();
    }
  });

  urlap.addEventListener('submit', (e) => {
    e.preventDefault();
    if (oldalKesz()) {
      if (keszDb(menet) === sor.length) return osszegzes(ctx);
      // A következő oldal, amelyen még van megoldatlan feladat (a végéről az elejére visszafordulva).
      for (let lepes = 1; lepes <= oldalak; lepes++) {
        const o = (poz / PARONKENT + lepes) % oldalak;
        if (sor.slice(o * PARONKENT, (o + 1) * PARONKENT).some((i) => !kesz(eredmeny[i]))) return ugras(o);
      }
      return;
    }
    const nyitott = indexek.map((_, k) => k).filter((k) => !kesz(eredmeny[indexek[k]]));
    const valaszok = indexek.map((i) => valaszKiolvas(urlap, i));
    if (nyitott.some((k) => valaszok[k] === '')) {
      $('.figyelmeztetes', urlap).textContent = 'Minden feladatra válaszolj, mielőtt ellenőrzöd!';
      return;
    }
    $('.figyelmeztetes', urlap).textContent = '';
    nyitott.forEach((k) => {
      const i = indexek[k];
      const f = tema.feladatok[i];
      const masodszor = eredmeny[i]?.allapot === 'masodik';
      if (ertekel(f, valaszok[k])) {
        eredmeny[i] = { valasz: valaszok[k], allapot: 'jo', masodikra: masodszor };
        const h = haladas(tantargy, tema.azon).helyes;
        if (!h.includes(i)) h.push(i);
      } else {
        eredmeny[i] = { valasz: valaszok[k], allapot: !masodszor && masodikEsely(f) ? 'masodik' : 'rossz' };
      }
      rajzol(k);
    });
    mentes();
    gombFrissit();
    frissitSav();
    const javitando = $('.masodik input[type="text"]', urlap);
    if (javitando) javitando.select();
    else gomb.focus();
  });

  const elso = $('input[type="text"]:not(:disabled)', urlap);
  if (elso) elso.focus({ preventScroll: true });
}

function osszegzes(ctx) {
  const { tantargy, tema, panel } = ctx;
  const menet = haladas(tantargy, tema.azon).menet;
  const helyes = helyesDb(menet);
  const hibas = hibasak(menet);
  const arany = helyes / menet.sor.length;
  const ertekeles =
    arany === 1
      ? 'Hibátlan! 🌟'
      : arany >= 0.7
        ? 'Nagyon jó munka!'
        : arany >= 0.4
          ? 'Jó úton jársz, gyakorolj tovább!'
          : 'Ne add fel! Nézd át újra a magyarázatot, és próbáld meg még egyszer. A 💡 Segítségben lépésről lépésre is megnézheted a megoldást.';
  panel.innerHTML = `<div class="kartya osszegzes">
    <h3>Vége a gyakorlásnak</h3>
    <p class="eredmeny">${helyes} / ${menet.sor.length}</p>
    <p>${ertekeles}</p>
    ${hibas.length ? `<button type="button" class="gomb" data-m="hibasak">Hibás feladatok újra (${hibas.length})</button>` : ''}
    <button type="button" class="gomb masodlagos" data-m="atnez">Feladatok átnézése</button>
    <button type="button" class="gomb masodlagos" data-m="ujra">Összes feladat újra</button>
    <a class="gomb masodlagos" href="#/${tantargy.azon}/${tema.azon}/magyarazat">Magyarázat</a>
  </div>`;
  const hibasGomb = $('[data-m="hibasak"]', panel);
  if (hibasGomb) hibasGomb.addEventListener('click', () => gyakorlasInditas(ctx, hibas));
  $('[data-m="atnez"]', panel).addEventListener('click', () => {
    menet.poz = 0;
    mentes();
    oldalMutat(ctx);
  });
  $('[data-m="ujra"]', panel).addEventListener('click', () => gyakorlasInditas(ctx, tema.feladatok.map((_, i) => i)));
}

// ---- Indítás ----

function utvonal() {
  const [tAzon, azon, ful] = location.hash.replace(/^#\/?/, '').split('/');
  const tantargy = Tananyag.tantargyak.find((t) => t.azon === tAzon);
  const csoport = tantargy && tantargy.menu.find((c) => c.azon === azon && c.temak.length > 1);
  if (!tantargy) kezdolap();
  else if (csoport) csoportOldal(tantargy, csoport);
  else if (tantargy.temak[azon]) temaOldal(tantargy, tantargy.temak[azon], ful === 'gyakorlas' ? 'gyakorlas' : 'magyarazat');
  else tantargyOldal(tantargy);
  window.scrollTo(0, 0);
}

document.getElementById('torles').addEventListener('click', () => {
  if (!confirm('Biztosan törlöd az összes eddigi eredményt ezen az eszközön?')) return;
  tarolt.temak = {};
  mentes();
  utvonal();
});

window.addEventListener('hashchange', utvonal);
Tananyag.betolt().then(utvonal);
