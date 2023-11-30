"use strict";

export function NotImplementedError(message = "") {
    this.name = "NotImplementedError";
    this.message = message;
  }
NotImplementedError.prototype = Error.prototype;

export class GameMechanicState {
    constructor(config) {
        this._config = config;
    }

    get isCustomMechanic() {
        return this._config.nonStandardMechanic;
    }
}

export class UpgradeMechanicState extends GameMechanicState {
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

export class BuyableMechanicState extends GameMechanicState {
    get title() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    cost() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    effect() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get display() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get unlocked() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    canAfford() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    buy() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    buyMax() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get style() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get purchaseLimit() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get layer() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get id() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }
}

export class ChallengeMechanicState extends GameMechanicState {
    get name() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get challengeDescription() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get goalDescription() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    canComplete() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get rewardDescription() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    rewardEffect() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    rewardDisplay() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    fullDisplay() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get unlocked() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    onComplete() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    onEnter() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    onExit() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get countAs() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get completionLimit() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get style() {
        throw new NotImplementedError("This should be overrided with layer features.");
    }

    get layer() {
        return this._config.inLayer;
    }

    get id() {
        return this._config.challengeID;
    }

    get isOldGoal() {
        return this._config.usingOlderGoals
    }

    get goal() {
        throw new TypeError("Deprecated. Do not use this.");
    }

    get currencyDisplayName() {
        throw new TypeError("Deprecated. Do not use this.");
    }

    get currencyInternalName() {
        throw new TypeError("Deprecated. Do not use this.");
    }

    currencyLocation() {
        throw new TypeError("Deprecated. Do not use this.");
    }
}