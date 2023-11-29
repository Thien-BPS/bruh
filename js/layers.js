import Decimal from "./technical/break_eternity.js"

function NotImplementedError(message = "") {
    this.name = "NotImplementedError";
    this.message = message;
  }
NotImplementedError.prototype = Error.prototype;

function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

export class UpgradeMechanicState {
    constructor(confg) {
        this._config = confg;
    }

    get cost() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get effect() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get description() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get title() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get unlocked() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get effectDisplay() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get formula() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get canAfford() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }
}

export class ExampleUpgradeState extends UpgradeMechanicState {
    get costExpBase() {
        return this._config.costExponentBase;
    }

    get costExp() {
        return this._config.costExponent;
    }

    get costBase() {
        return this._config.minimumCost;
    }

    get cost() {
        return Decimal.pow(this.costExpBase, this.costExp).add(this.costBase);
    }

    get effectType() {
        return this._config.effectType;
    }

    get effectSubType() {
        return this._config.effectSubType
    }

    effectParams(param, ...args) {
        const calling = this._config.effectObject[param];
        return isFunction(calling) ? calling(args) : calling;
    }

    get effect() {
        const type = this.effectType;
        const subType = this.effectSubType
        let firstEff;
        switch (type) {
            case "linear":
                firstEff = Decimal.times(this.effectParams("base"), this.effectParams("multiplier"));
                switch (subType) {
                    case "noOtherBoosts":
                        return firstEff;
                    case "onlyAdders":
                        return firstEff.add(this.effectParams("effectAdders"));
                    case "onlyMults":
                        return firstEff.times(this.effectParams("effectMults"));
                    case "onlyPow":
                        return firstEff.max(1).pow(this.effectParams("effectPowers"));
                    case "":
                        return this.effectParams("handleBaseEffect", firstEff, 1);
                    case "effectAndSoftcaps":
                        return this.effectParams("handleBaseEffect", firstEff, 1);
                    case "onlySoftcaps":
                        return this.effectParams("handleBaseEffect", firstEff, 2);
                    case "onlyEffect":
                        return this.effectParams("handleBaseEffect", firstEff, 3);
                }
            case "exponentional":
                firstEff = Decimal.pow(this.effectParams("expBase"), this.effectParams("exp")).max(this.effectParams("minimumEffValue"));
                switch (subType) {
                    case "noOtherBoosts":
                        return firstEff;
                    case "onlyAdders":
                        return firstEff.add(this.effectParams("effectAdders"));
                    case "onlyMults":
                        return firstEff.times(this.effectParams("effectMults"));
                    case "onlyPow":
                        return firstEff.max(1).pow(this.effectParams("effectPowers"));
                    case "onlyLogarithm":
                        return firstEff.max(1).log(this.effectParams("effectLogarithmBase"));
                    case "onlyRoot":
                        return firstEff.root(this.effectParams("rootPower"));
                    case "":
                        return this.effectParams("handleBaseEffect", firstEff, 1);
                    case "effectAndSoftcaps":
                        return this.effectParams("handleBaseEffect", firstEff, 1);
                    case "onlySoftcaps":
                        return this.effectParams("handleBaseEffect", firstEff, 2);
                    case "onlyEffect":
                        return this.effectParams("handleBaseEffect", firstEff, 3);
                }
            case "multiExp" || "tetrational":
                firstEff = Decimal.tetrate(this.effectParams("tetrateAmount"), this.effectParams("tetrateBase"), false).max(this.effectParams("minimumEffValue"));
                switch (subType) {
                    case "noOtherBoosts":
                        return firstEff;
                    case "onlyPow":
                        return firstEff.max(1).pow(this.effectParams("effectPowers"));
                    case "onlyLogarithm":
                        return firstEff.max(1).log(this.effectParams("effectLogarithmBase"));
                    case "onlyRoot":
                        return firstEff.root(this.effectParams("rootPower"));
                    case "onlyRepeatedLog":
                        return firstEff.max(1).iteratedlog(this.effectParams("effectLogarithmBase"), this.effectParams("effectLogRepeat"), false);
                    case "onlyRepeatedPower":
                        return firstEff.max(1).iteratedexp(this.effectParams("effectPowers"), this.effectParams("effectPowerBase"), false);
                    case "onlySuperLogarithm":
                        return firstEff.max(1).slog(this.effectParams("effectLogarithmBase"));
                    case "":
                        return this.effectParams("handleBaseEffect", firstEff, 1);
                    case "effectAndSoftcaps":
                        return this.effectParams("handleBaseEffect", firstEff, 1);
                    case "onlySoftcaps":
                        return this.effectParams("handleBaseEffect", firstEff, 2);
                    case "onlyEffect":
                        return this.effectParams("handleBaseEffect", firstEff, 3);
                }
            case "pentational":
                // really dangerous, can reach infinity very quickly.
                firstEff = Decimal.pentate(this.effectParams("pentateBase"), this.effectParams("pentateAmount"), false).max(this.effectParams("minimumEffValue"));
                switch (subType) {
                    case "":
                        return this.effectParams("handleBaseEffect", firstEff);
                    case "effectAndSoftcaps":
                        return this.effectParams("handleBaseEffect", firstEff, true);
                    case "onlySoftcaps":
                        return this.effectParams("handleBaseEffect", firstEff, false);
                }
            case "custom":
                return this.effectParams("handleBaseEffect", this.effectParams("baseEffect"), 1)
            default:
                throw new TypeError(`Unknown Effect Type: ${type}`);
        }
    }

    get description() {
        return new Decimal.pow(this.costExpBase, this.costExp).add(this.costBase);
    }
}