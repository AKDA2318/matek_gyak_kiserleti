// Matematika tantárgy: a menü szerkezete (témacsoportok és altémák).
// Új téma: írd meg a temak/ mappában, és add meg itt a `fajl` mezőt.
// `fajl` nélküli altéma „Hamarosan” jelzéssel jelenik meg.
'use strict';

Tananyag.tantargy({
  azon: 'matematika',
  cim: 'Matematika',
  ikon: '📐',
  leiras: 'Gyakorlás lépésről lépésre, szakmai példákkal',
  kozos: ['kozos/geometria.js', 'kozos/mertekegyseg.js', 'kozos/testek.js'],
  menu: [
    {
      azon: 'alapok',
      cim: 'Számok és műveletek',
      ikon: '±',
      leiras: 'Műveleti sorrend, negatív számok, kerekítés, becslés',
      temak: [
        { azon: 'muveleti-sorrend', cim: 'Műveleti sorrend és számológép' },
        { azon: 'negativ-szamok', cim: 'Negatív számok' },
        { azon: 'kerekites-becsles', cim: 'Kerekítés és becslés' },
        { azon: 'hatvany-gyok', cim: 'Hatványozás és négyzetgyök' },
      ],
    },
    {
      azon: 'mertekegysegek',
      cim: 'Mértékegységek',
      ikon: 'm²',
      leiras: 'Átváltás: hossz, terület, térfogat, tömeg',
      temak: [
        { azon: 'hossz-terulet', cim: 'Hossz és terület' },
        { azon: 'terfogat-urtartalom', cim: 'Térfogat és űrtartalom' },
        { azon: 'tomeg-ido', cim: 'Tömeg és idő' },
        { azon: 'suruseg', cim: 'Sűrűség és tömeg' },
      ],
    },
    {
      azon: 'tortek',
      cim: 'Törtek',
      ikon: '¾',
      leiras: 'Fél, negyed, háromnegyed: darabolás, keverés',
      temak: [
        { azon: 'kozonseges-tortek', cim: 'Közönséges törtek' },
        { azon: 'tizedes-tortek', cim: 'Tizedes törtek' },
      ],
    },
    {
      azon: 'szazalek',
      cim: 'Százalékszámítás',
      ikon: '%',
      leiras: 'Ráhagyás, kedvezmény, ÁFA, lejtés',
      temak: [{ azon: 'szazalekszamitas', cim: 'Százalékszámítás' }],
    },
    {
      azon: 'aranyok',
      cim: 'Arányok',
      ikon: '1:50',
      leiras: 'Méretarány, keverési arány, arányosság',
      temak: [
        { azon: 'meretarany', cim: 'Méretarány (tervrajz)' },
        { azon: 'keveresi-arany', cim: 'Keverési arány' },
        { azon: 'egyenes-forditott', cim: 'Egyenes és fordított arányosság' },
        { azon: 'hasonlosag', cim: 'Hasonlóság' },
      ],
    },
    {
      azon: 'sikidomok',
      cim: 'Síkidomok',
      ikon: '▱',
      leiras: 'Kerület és terület: csempe, festék, szegélyléc',
      temak: [
        { azon: 'negyzet', cim: 'Négyzet' },
        { azon: 'teglalap', cim: 'Téglalap' },
        { azon: 'paralelogramma', cim: 'Paralelogramma' },
        { azon: 'rombusz', cim: 'Rombusz' },
        { azon: 'trapez', cim: 'Trapéz' },
        { azon: 'deltoid', cim: 'Deltoid' },
        { azon: 'haromszog', cim: 'Háromszög' },
        { azon: 'kor', cim: 'Kör' },
        { azon: 'osszetett-alakzatok', cim: 'Összetett alakzatok', leiras: 'L alakú szoba, nyílások levonása' },
      ],
    },
    {
      azon: 'szogek',
      cim: 'Szögszámolás',
      ikon: '∠',
      leiras: 'Szögek háromszögben és négyszögben, gérvágás',
      temak: [
        { azon: 'szogek-haromszog', cim: 'Szögek a háromszögben' },
        { azon: 'szogek-negyszog', cim: 'Szögek a négyszögben' },
      ],
    },
    {
      azon: 'pitagorasz-tetel',
      cim: 'Pitagorasz-tétel',
      ikon: 'a²+b²',
      leiras: 'Ferde oldalak kiszámolása: szarufa, létra, átló',
      temak: [{ azon: 'pitagorasz', cim: 'Pitagorasz-tétel', fajl: 'temak/pitagorasz.js' }],
    },
    {
      azon: 'thalesz-tetel',
      cim: 'Thalész-tétel',
      ikon: '◠',
      leiras: 'Derékszög a félkörben, kör közepének megkeresése',
      temak: [{ azon: 'thalesz', cim: 'Thalész-tétel' }],
    },
    {
      azon: 'trigonometria',
      cim: 'Trigonometria',
      ikon: 'sin',
      leiras: 'Szögek és dőlés: tető, lépcső, rámpa, létra',
      temak: [{ azon: 'szogfuggvenyek', cim: 'Szögfüggvények' }],
    },
    {
      azon: 'testek',
      cim: 'Testek: felszín és térfogat',
      ikon: '⬛',
      leiras: 'Beton, föld, víz, festendő felület',
      temak: [
        { azon: 'kocka', cim: 'Kocka' },
        { azon: 'teglatest', cim: 'Téglatest', leiras: 'Szoba, alap, födém, gerenda' },
        { azon: 'hasabok', cim: 'Hasábok', leiras: 'Háromszög és trapéz alapú: padlástér, árok, támfal' },
        { azon: 'henger', cim: 'Henger', leiras: 'Oszlop, cső, tartály' },
        { azon: 'osszetett-testek', cim: 'Összetett testek', leiras: 'Ház tetővel, lépcső' },
        { azon: 'gula', cim: 'Gúla' },
        { azon: 'kup', cim: 'Kúp' },
      ],
    },
    {
      azon: 'egyenletek',
      cim: 'Egyenletek és képletek',
      ikon: 'x=?',
      leiras: 'Egyszerű egyenletek, képletek átrendezése',
      temak: [
        { azon: 'egyszeru-egyenletek', cim: 'Egyszerű egyenletek' },
        { azon: 'linearis-fuggveny', cim: 'Lineáris függvény, grafikon' },
      ],
    },
    {
      azon: 'meres',
      cim: 'Mérés és pontosság',
      ikon: '±mm',
      leiras: 'Mérési pontosság, tűrés',
      temak: [{ azon: 'meresi-pontossag', cim: 'Mérési pontosság és tűrés' }],
    },
    {
      azon: 'adatok',
      cim: 'Adatok és diagramok',
      ikon: '📊',
      leiras: 'Átlag, táblázat, diagram olvasása',
      temak: [{ azon: 'atlag-diagram', cim: 'Átlag és diagramok' }],
    },
    {
      azon: 'koltseg',
      cim: 'Költségszámítás',
      ikon: 'Ft',
      leiras: 'Anyagköltség, munkadíj, bér, számla',
      temak: [
        { azon: 'arajanlat', cim: 'Árajánlat készítése' },
        { azon: 'ber-szamla', cim: 'Bér, munkaidő, számla' },
      ],
    },
  ],
});
