import { player } from "./game";
import Decimal from "./technical/break_eternity";

const SOFTCAPS = {
    exampleSoftcap: {
        id: "exampleSoftcap",
        type: "custom",
        displayName: "Test softcap",
        startsAt: new Decimal("1e1000000"),
        scFunction: value => new Decimal(value).plus(1).slog().plus(1),
        displayInfo: () => ``
    },
    exampleSoftcap2: {
        id: "exampleSoftcap2",
        type: "root",
        displayName: "Test softcap 2",
        startsAt: new Decimal("1e1000000"),
        rootPower: new Decimal(2.575),
        displayInfo: () => ``
    },
    exampleSoftcap3: {
        id: "exampleSoftcap3",
        type: "expRoot",
        displayName: "Test softcap 3",
        startsAt: new Decimal("1e1000000"),
        rootPower: new Decimal(1.875),
        displayInfo: () => ``
    },
    exampleSoftcap4: {
        id: "exampleSoftcap4",
        type: "exponent",
        displayName: "Test softcap 4",
        startsAt: new Decimal("1e1000000"),
        softcapExponent: new Decimal(0.667424),
        displayInfo: () => ``
    },
    exampleSoftcap5: {
        id: "exampleSoftcap5",
        type: "l2Exponent",
        displayName: "Test softcap 5",
        startsAt: new Decimal("1e1000000"),
        softcapExponent: new Decimal(0.75),
        displayInfo: () => ``
    },
    exampleSoftcap6: {
        id: "exampleSoftcap6",
        type: "log",
        displayName: "Test softcap 6",
        startsAt: new Decimal("1e1000000"),
        logarithmBase: new Decimal(10),
        afterLogPower: new Decimal(1),
        displayInfo: () => ``
    },
}

window.Softcaps = SOFTCAPS;

export function softcapActive(name, val) {
	if (!SOFTCAPS[name]) return false;
	else return Decimal.gte(val, getSoftcapData(name, "startsAt"));
}

function getSoftcapData(name, id) {
	let data = SOFTCAPS[name][id]
	if (isFunction(data)) return data();
	else return data;
}

function runCustomSCFunction(name, value) {
    return SOFTCAPS[name].scFunction(value);
}

export function softcap(value, softcapID) {
    if (!(value instanceof Decimal)) {
        value = new Decimal(value);
    }
	if (!softcapActive(softcapID, value)) return value;
	const type = getSoftcapData(softcapID, "type");
	const start = getSoftcapData(softcapID, "start");
	switch (type) {
        case "custom":
            return runCustomSCFunction(softcapID, value);
        default:
            throw new UndefinedError(type);
    }
}