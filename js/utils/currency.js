import { getPointGen, getStartPoints } from "../mod";
import { DC } from "../precooked-decimals";
import { isDisallowedEntry } from "../utils";
import { GameMechanicState, NotImplementedError } from "./layersReqs";

class MathOperations {
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    add(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    subtract(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    multiply(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    divide(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    mod(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    pow(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    max(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    min(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    eq(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    gt(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    gte(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    lt(left, right) { throw new NotImplementedError(); }
  
    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    lte(left, right) { throw new NotImplementedError(); }
  }
  
  MathOperations.number = new class NumberMathOperations extends MathOperations {
    add(left, right) { return left + right; }
    subtract(left, right) { return left - right; }
    multiply(left, right) { return left * right; }
    divide(left, right) { return left / right; }
    mod(left, right) { return left % right }
    pow(left, right) { return Math.pow(left, right) }

    max(left, right) { return Math.max(left, right); }
    min(left, right) { return Math.min(left, right); }
    eq(left, right) { return left === right; }
    gt(left, right) { return left > right; }
    gte(left, right) { return left >= right; }
    lt(left, right) { return left < right; }
    lte(left, right) { return left <= right; }
  }();
  
  MathOperations.decimal = new class DecimalMathOperations extends MathOperations {
    add(left, right) { return Decimal.plus(left, right); }
    subtract(left, right) { return Decimal.sub(left, right); }
    multiply(left, right) { return Decimal.times(left, right); }
    divide(left, right) { return Decimal.div(left, right); }
    mod(left, right) { return Decimal.mod(left, right) }
    root(left, right) { return Decimal.root(left, right) }
    pow(left, right) { return Decimal.pow(left, right) }

    max(left, right) { return Decimal.max(left, right); }
    min(left, right) { return Decimal.min(left, right); }
    eq(left, right) { return Decimal.eq(left, right); }
    gt(left, right) { return Decimal.gt(left, right); }
    gte(left, right) { return Decimal.gte(left, right); }
    lt(left, right) { return Decimal.lt(left, right); }
    lte(left, right) { return Decimal.lte(left, right); }
    neq(left, right) { return Decimal.neq(left, right); }
  }();

class InternalCurrencyState extends GameMechanicState {
    get isCustomMechanic() {
        return true;
    }

    get currencyValue() {
        throw new NotImplementedError("This is a base class, should be overrided.");
    }

    set currencyValue(value) {
        throw new NotImplementedError("This is a base class, should be overrided.");
    }

    get operations() {
        throw new TypeError("This should be specified when extending this class.");
    }

    add(amount) {
        this.value = this.operations.add(this.value, amount);
      }
    
      subtract(amount) {
        this.value = this.operations.max(this.operations.subtract(this.value, amount), 0);
      }
    
      multiply(amount) {
        this.value = this.operations.multiply(this.value, amount);
      }
    
      divide(amount) {
        this.value = this.operations.divide(this.value, amount);
      }

      mod(amount) {
        this.value = this.operations.mod(this.value, amount);
      }
    
      eq(amount) {
        return this.operations.eq(this.value, amount);
      }
    
      gt(amount) {
        return this.operations.gt(this.value, amount);
      }
    
      gte(amount) {
        return this.operations.gte(this.value, amount);
      }
    
      lt(amount) {
        return this.operations.lt(this.value, amount);
      }
    
      lte(amount) {
        return this.operations.lte(this.value, amount);
      }

      purchase(cost) {
        if (!this.gte(cost)) return false;
        this.subtract(cost);
        return true;
      }
    
      bumpTo(value) {
        this.value = this.operations.max(this.value, value);
      }
    
      dropTo(value) {
        this.value = this.operations.min(this.value, value);
      }

      get startsWith() {
        throw new TypeError("This should be specified when extending this class.");
      }

      reset() {
        this.value = this.startsWith;
      }
}

/**
 * @abstract
 */
class NumberCurrency extends InternalCurrencyState {
  get operations() { return MathOperations.number; }
  get startingValue() { return 0; }
}
  
/**
 * @abstract
 */
class DecimalCurrency extends InternalCurrencyState {
  get operations() { return MathOperations.decimal; }
  get mantissa() { return this.value.mantissa; }
  get exponent() { return this.value.exponent; }
  get layer() { return this.value.layer; }
  get mag() { return this.value.mag; }
  get startingValue() { return DC.D0; }
}

window.DecimalCurrency = DecimalCurrency;
window.NumberCurrency = NumberCurrency;

export const Currency = {
  points: new class extends DecimalCurrency {
      get currencyValue() {
          return player.points;
      }

      set currencyValue(value) {
          if (isDisallowedEntry(value)) {
            throw new Error();
          }
          player.records.totalPoints = player.records.totalPoints.plus(value);
          player.records.maximumEverPoints = player.records.maximumEverPoints.max(value);
          player.points = value;
      }

      get maximum() {
          return player.records.maximumEverPoints;
      }

      get startsWith() {
          return getStartPoints();
      }

      get productionPerSecond() {
          return getPointGen();
      }
  },
  prestigePoints: new class extends DecimalCurrency {
      get currencyValue() {
          return player.p.points;
      }

      set currencyValue(value) {
          player.p.points = value;
      }

      get startsWith() {
          return DC.D0;
      }

      get productionPerSecond() {
          return getResetGain("p", "normal");
      }
  },
}