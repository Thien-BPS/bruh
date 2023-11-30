import Decimal from "./technical/break_eternity";

function deepFreeze(obj) {
    Object.keys(obj).forEach(prop => {
      const reference = obj[prop];
      if (typeof reference === "object") deepFreeze(reference);
    });
    return Object.freeze(obj);
}

export const DC = deepFreeze({
    D0:                         new Decimal(0),
    D1:                         new Decimal(1),
    D1_5:                       new Decimal(1.5),
    D2:                         new Decimal(2),
    D10:                        new Decimal(10)
})