> **Bemutató változat:** ebben a csomagban csak a Pitagorasz-tétel témakör nyitható meg, a többi „Hamarosan” jelzéssel látszik. A teljes tananyag (42 téma, 1424 feladat) a teljes csomagban található.

# Tananyag – Matek Gyakorló

Ingyenes, nyílt forráskódú, böngészőben futó tananyag és gyakorló **szakképzésben tanuló diákoknak**
(9–12. évfolyam: ács, burkoló, festő-mázoló-tapétázó, kőműves, asztalos, kárpitos, valamint
magasépítő és faipari technikus). A nyelvezet szándékosan egyszerű, hogy a matematikában
lemaradt diákok is megértsék: rövid mondatok, minden szakszó köznapi magyarázattal,
előbb a kézzelfogható példa, utána a képlet.
Nem kell hozzá telepítés, regisztráció vagy szerver: sima HTML + JavaScript.

## A diák szemszögéből

1. **Témaválasztás:** témacsoportok (pl. Törtek, Síkidomok, Pitagorasz-tétel, Trigonometria).
   A több részből álló csoportoknak saját almenüjük van (pl. Síkidomok → Négyzet, Téglalap, …).
2. **📖 Magyarázat fül:** lemaradt diákoknak is érthető, lépésről lépésre felépített anyag:
   - „Ebben a részben megtanulod” – célok,
   - „Előtte ismételjünk!” – a szükséges előismeretek (pl. négyzetre emelés, számológép-beállítás),
   - lépésenkénti **animáció feliratokkal**, interaktív **„Próbáld ki!”** rész csúszkákkal,
   - számozott **receptek** és kidolgozott példák,
   - **„A szakmában”** – példák mind a 8 szakmának (tető, létra, burkolatlejtés, lépcső, bútor, rámpa…),
   - lenyitható **„Ha többet szeretnél tudni”** rész a mélyebb összefüggésekkel, aki akarja, kinyitja,
   - gyakori hibák és „Jegyezd meg!” összefoglaló.
3. **✏️ Gyakorlás fül:** témánként 31–44 (többnyire 33) feladat, a nehéz szinten témánként legalább 15, egyszerre 2 látszik.
   - A gyakorlás állása megmarad: ha a diák elnavigál, visszatérve ott folytatja, ahol abbahagyta,
     és a lapozóval bármelyik oldalra visszaléphet (a kész oldalak zölddel, a hibát tartalmazók narancssárgával jelölve).
   - Nehézségi címke (Könnyű / Közepes / Nehéz), a könnyűtől a nehézig sorban; szakmai feladatoknál szakmacímke (pl. „🧱 Kőműves”).
   - **💡 Segítség** gomb: előbb egy tipp, utána lépésenként a megoldás menete; a végeredményt a diák számolja ki.
   - Rossz válasz után második esély (az igen/nem feladatok kivételével).
   - Helyi, azonnali kiértékelés a megoldás menetével; a végén a hibás feladatok újragyakorolhatók.
   - **Pontozás és kiértékelés:** elsőre jó válasz 1 pont, második próbálkozásra fél pont, egyébként 0.
     A „Befejezés és kiértékelés” gomb bármikor kiértékeli az addig megoldott feladatokat (a kihagyottak nem
     számítanak bele): pontszám, százalék, és lista arról, hol hibázott a diák, ugrással az adott feladathoz.

Az eredmények a böngészőben tárolódnak (`localStorage`), adat nem hagyja el az eszközt.

## Tartalom állapota

| Csoport | Altémák | Állapot |
|---|---|---|
| Számok és műveletek | Műveleti sorrend és számológép, Negatív számok, Kerekítés és becslés, Hatványozás és négyzetgyök | ✅ 33 + 32 + 32 + 33 feladat |
| Mértékegységek | Hossz és terület, Térfogat és űrtartalom, Tömeg és idő, Sűrűség és tömeg | ✅ 36 + 34 + 34 + 33 feladat |
| Törtek | Közönséges törtek, Tizedes törtek | ✅ 36 + 36 feladat |
| Százalékszámítás | – | ✅ 38 feladat |
| Arányok | Méretarány, Keverési arány, Egyenes és fordított arányosság, Hasonlóság | ✅ 33 + 33 + 33 + 33 feladat |
| Síkidomok | Négyzet, Téglalap, Paralelogramma, Rombusz, Trapéz, Deltoid, Háromszög, Kör, Összetett alakzatok | ✅ összesen 302 feladat |
| Szögszámolás | Szögek a háromszögben, Szögek a négyszögben | ✅ 34 + 34 feladat |
| Pitagorasz-tétel | – | ✅ 41 feladat |
| Thalész-tétel | – | ✅ 33 feladat |
| Trigonometria | Szögfüggvények | ✅ 44 feladat |
| Testek: felszín és térfogat | Kocka, Téglatest, Hasábok, Henger, Összetett testek, Gúla, Kúp | ✅ 33 + 33 + 33 + 33 + 33 + 31 + 31 feladat |
| Egyenletek és képletek | Egyszerű egyenletek, Lineáris függvény | ✅ 33 + 33 feladat |
| Mérés és pontosság | Mérési pontosság és tűrés | ✅ 34 feladat |
| Adatok és diagramok | Átlag és diagramok | ✅ 33 feladat |
| Költségszámítás | Árajánlat készítése, Bér, munkaidő, számla | ✅ 33 + 34 feladat |

Mind a 42 téma kész, összesen 1424 feladat.

## Felépítés (moduláris)

```
index.html                     az oldal váza; itt kell felsorolni a tantárgyakat
style.css                      megjelenés (világos és sötét mód)
js/
  tananyag.js                  tantárgyak/témák nyilvántartása, témafájlok betöltése
  rajz.js                      közös SVG-rajzolók (derékszögű háromszög, nyeregtető, szögív)
  animacio.js                  lépésenkénti, feliratos animációlejátszó
  app.js                       oldalak, fülek, gyakorlás és kiértékelés
tantargyak/
  szakmak.js                   az iskolában tanított szakmák listája (feladatcímkékhez, minden tantárgynak közös)
  matematika/
    tantargy.js                a tantárgy menüje (csoportok, altémák, témafájlok, közös fájlok)
    kozos/
      geometria.js             közös rajzolók (síkidomok, szögek, törtsáv), csúszkás „Próbáld ki!”,
                               közös magyarázó dobozok (kerület/terület, mértékegység, anyagszükséglet)
      mertekegyseg.js          váltószámok, automatikusan számolt átváltó feladatok, váltólépcsőrajz
      testek.js                térbeli rajzok (hasáb, téglatest, henger, gúla, kúp) takart élekkel
    temak/
      pitagorasz.js            egy fájl = egy téma
      negyzet.js, kor.js, …
```

A keret (`js/`) semmit nem tud a matematikáról: minden tananyag a `tantargyak/` mappában van.

### Új téma hozzáadása egy meglévő tantárgyhoz

1. Hozz létre egy fájlt a tantárgy `temak/` mappájában (minta: `tantargyak/matematika/temak/pitagorasz.js`):

   ```js
   Tananyag.tema('matematika', {
     azon: 'negyzet',            // ugyanaz, mint a tantargy.js menüjében
     ikon: '□',
     magyarazat: `<h3>…</h3> <div data-animacio></div> … <div data-interaktiv></div>`,
     animacio: [{ felirat: '…', rajz: () => '<svg>…</svg>' }],   // elhagyható
     interaktiv: (elem) => { … },                               // elhagyható
     feladatok: [
       ...Tananyag.szint(1, [                                    // 1 = könnyű, 2 = közepes, 3 = nehéz
         { kerdes: '…', valasz: 16, egyseg: 'cm²', segitseg: '…', megoldas: '…' },
         { kerdes: '…', valasztas: ['Igen', 'Nem'], valasz: 'Igen', segitseg: '…', megoldas: '…' },
       ]),
       ...Tananyag.szint(2, [
         { kerdes: '…', szakma: SZAKMAK.ACS,                    // szakmai feladat címkével
           valasz: Math.sqrt(2), tizedes: 2, egyseg: 'm', segitseg: '…', megoldas: '…' },
       ]),
     ],
   });
   ```

2. A tantárgy `tantargy.js` menüjében add meg az altémánál a fájlt: `{ azon: 'negyzet', cim: 'Négyzet', fajl: 'temak/negyzet.js' }`.

Feladatmezők: `kerdes`, `valasz` (szám vagy a helyes választási lehetőség), `valasztas` (feleletválasztósnál),
`tizedes` (kerekítés; 0 = egészre), `egyseg`, `abra` (SVG-t visszaadó függvény), `segitseg`, `megoldas`,
`szakma` (a `tantargyak/szakmak.js` egyik eleme),
`tort` (tört alakú válasz, pl. `[3, 4]`; a diák `3/4`, `1 1/2` vagy tizedes alakban is beírhatja),
`egyszerusitve` (csak egyszerűsített tört alak fogadható el),
`relTures` (arányos tűrés, pl. π-s feladatoknál `0.0012`, hogy a 3,14-dal számolt eredmény is jó legyen).

A tantárgy `kozos` listájában megadott fájlok (pl. `kozos/geometria.js`) a témák előtt töltődnek be,
így minden téma használhatja őket.

### Írási irányelvek (a célcsoport miatt)

- Tegező, rövid mondatok; egy mondat = egy gondolat.
- Minden szakszó mellé köznapi magyarázat (pl. „átfogó = a leghosszabb, ferde oldal”).
- Előbb a szakmai, kézzelfogható helyzet, utána a képlet; a képlet szavakkal is.
- A megoldás menete soronként, számológéppel követhető lépésekben.
- Kerek számok, ahol lehet; a segítség tippet adjon, ne a végeredményt.
Számválasznál a tizedesvessző és -pont is elfogadott; kerekítendő feladatnál az utolsó jegyben 1 eltérés még helyes.

### Új tantárgy hozzáadása

1. Hozz létre egy mappát: `tantargyak/<tantárgy>/`, benne egy `tantargy.js`-t a matematika mintájára
   (`Tananyag.tantargy({ azon, cim, ikon, leiras, menu: [...] })`), és a témafájlokat a `temak/` mappába.
2. Az `index.html`-ben vedd fel egy sorban: `<script src="tantargyak/<tantárgy>/tantargy.js"></script>`.

Amíg egy tantárgy van, a kezdőlap rögtön annak menüjét mutatja; több tantárgynál megjelenik a tantárgyválasztó.

## Közzététel GitHub Pages-en

1. Töltsd fel a repót GitHubra.
2. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, mappa = `/ (root)`.
3. Pár perc múlva elérhető: `https://<felhasználónév>.github.io/<repo-név>/`

Helyben is működik: elég megnyitni az `index.html`-t böngészőben.

## Licenc

MIT – lásd a [LICENSE](LICENSE) fájlt.
