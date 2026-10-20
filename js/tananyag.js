// Tantárgyak és témák nyilvántartása, valamint a témafájlok betöltése.
//
// Egy tantárgy = egy mappa a tantargyak/ alatt, benne egy tantargy.js, amely
// a Tananyag.tantargy({...}) hívással leírja a menüt. A menü azon altémáinál,
// amelyeknek van `fajl` mezője, a keret betölti a fájlt; a témafájl a
// Tananyag.tema('<tantárgy>', {...}) hívással regisztrálja magát.
// Altéma `fajl` nélkül „Hamarosan” jelzéssel jelenik meg.
'use strict';

const Tananyag = {
  tantargyak: [],

  tantargy(adatok) {
    // A témafájlok útvonala a tantargy.js mappájához képest értendő.
    const alap = new URL('.', document.currentScript.src).href;
    this.tantargyak.push({ ...adatok, alap, temak: {} });
  },

  tema(tantargyAzon, tema) {
    const tantargy = this.tantargyak.find((t) => t.azon === tantargyAzon);
    if (!tantargy) throw new Error(`Ismeretlen tantárgy: ${tantargyAzon}`);
    // A cím a menüből jön, így csak egy helyen kell karbantartani.
    const bejegyzes = tantargy.menu.flatMap((c) => c.temak).find((t) => t.azon === tema.azon);
    // Tört alakú válasznál a számértéket is kitöltjük (statisztikához, ellenőrzéshez).
    const feladatok = tema.feladatok.map((f) => (f.tort && f.valasz == null ? { ...f, valasz: f.tort[0] / f.tort[1] } : f));
    tantargy.temak[tema.azon] = { ...bejegyzes, ...tema, feladatok };
  },

  // Nehézségi szintet rendel egy feladatlistához (1 = könnyű, 2 = közepes, 3 = nehéz).
  szint(szint, feladatok) {
    return feladatok.map((f) => ({ ...f, szint }));
  },

  // Szakmai feladatokat jelöl meg (pl. SZAKMAK.ACS, lásd tantargyak/szakmak.js); a feladatkártyán címkeként jelenik meg.
  szakma(szakma, feladatok) {
    return feladatok.map((f) => ({ ...f, szakma }));
  },

  // Az összes tantárgy témafájljait sorban betölti. Egy hibás fájl nem állítja meg a többit.
  async betolt() {
    for (const tantargy of this.tantargyak) {
      // Előbb a tantárgy közös segédfájljai (pl. rajzolók), utána a témák.
      const fajlok = [...(tantargy.kozos || []), ...tantargy.menu.flatMap((c) => c.temak).map((t) => t.fajl)];
      for (const fajl of fajlok) {
        if (!fajl) continue;
        try {
          await szkriptBetoltes(tantargy.alap + fajl);
        } catch {
          console.error(`Nem sikerült betölteni: ${tantargy.alap + fajl}`);
        }
      }
    }
  },
};

function szkriptBetoltes(src) {
  return new Promise((kesz, hiba) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = kesz;
    s.onerror = hiba;
    document.head.appendChild(s);
  });
}
