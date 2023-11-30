class Lazy {
    constructor(getValue) {
      this._getValue = getValue;
      Lazy.registerLazy(this);
    }
  
    static get registrar() {
      if (Lazy._registrar === undefined) {
        Lazy._registrar = [];
      }
      return Lazy._registrar;
    }
  
    static registerLazy(object) {
      Lazy.registrar.push(object);
    }
  
    static invalidateAll() {
      for (const obj of Lazy.registrar) {
        obj.invalidate();
      }
    }
  
    get value() {
      if (this._value === undefined) {
        this._value = this._getValue();
      }
      return this._value;
    }
  
    invalidate() {
      this._value = undefined;
    }
  
    /**
     * @return {Lazy}
     */
    invalidateOn(...events) {
      return;
    }
  }
window.Lazy = Lazy;

let NaNalert = false;

// GameCache will not call these
let activeFunctions = [
	"startData", "onPrestige", "doReset", "update", "automate",
	"buy", "buyMax", "respec", "onPress", "onClick", "onHold", "masterButtonPress",
	"sellOne", "sellAll", "pay", "actualCostFunction", "actualEffectFunction",
	"effectDescription", "display", "fullDisplay", "effectDisplay", "rewardDisplay",
	"tabFormat", "content",
	"onComplete", "onPurchase", "onEnter", "onExit", "done",
	"getUnlocked", "getStyle", "getCanClick", "getTitle", "getDisplay"
]

const noCall = doNotCallTheseFunctionsEveryTick
for (item in noCall) {
	activeFunctions.push(noCall[item])
}

export let GameCache = {};
let CachedFunctions = {};

// Add the names of classes to traverse
const traversableClasses = []

export function setupTemp() {
	GameCache = {}
	GameCache.pointGen = {}
	GameCache.backgroundStyle = {}
	GameCache.displayThings = []
	GameCache.scrolled = 0
	GameCache.gameEnded = false
	CachedFunctions = {}
	
	setupTempData(layers, GameCache, CachedFunctions)
	for (layer in layers) {
		GameCache[layer].resetGain = {}
		GameCache[layer].nextAt = {}
		GameCache[layer].nextAtDisp = {}
		GameCache[layer].canReset = {}
		GameCache[layer].notify = {}
		GameCache[layer].prestigeNotify = {}
		GameCache[layer].computedNodeStyle = []
		setupBuyables(layer)
		GameCache[layer].trueGlowColor = []
	}

	GameCache.other = {
		lastPoints: player.points || decimalZero,
		oomps: decimalZero,
		screenWidth: 0,
		screenHeight: 0,
    }

	updateWidth();
}

const boolNames = ["unlocked", "deactivated", "purchased"]

function setupTempData(layerData, tmpData, funcsData) {
	for (item in layerData){
		if (layerData[item] == null) {
			tmpData[item] = null
		}
		else if (layerData[item] instanceof Decimal)
			tmpData[item] = layerData[item]
		else if (Array.isArray(layerData[item])) {
			tmpData[item] = []
			funcsData[item] = []
			setupTempData(layerData[item], tmpData[item], funcsData[item])
		}
		else if (Boolean(layerData[item]) && (layerData[item].constructor === Object)) {
			tmpData[item] = {}
			funcsData[item] = []
			setupTempData(layerData[item], tmpData[item], funcsData[item])
		}
		else if (Boolean(layerData[item]) && (typeof layerData[item] === "object") && traversableClasses.includes(layerData[item].constructor.name)) {
			tmpData[item] = new layerData[item].constructor()
			funcsData[item] = new layerData[item].constructor()
		}
		else if (isFunction(layerData[item]) && !activeFunctions.includes(item)){
			funcsData[item] = layerData[item]
			if (boolNames.includes(item))
				tmpData[item] = false
			else
				tmpData[item] = new Lazy(() => item) // The safest thing to put probably?
		} else {
			tmpData[item] = layerData[item]
		}
	}	
}

export function updateTemp() {
	if (GameCache === undefined)
		setupTemp();

	updateTempData(layers, GameCache, CachedFunctions);

	for (layer in layers) {
		GameCache[layer].resetGain = new Lazy(() => getResetGain(layer));
		GameCache[layer].nextAt = new Lazy(() => getNextAt(layer));
		GameCache[layer].nextAtDisp = new Lazy(() => getNextAt(layer, true));
		GameCache[layer].canReset = new Lazy(() => canReset(layer));
		GameCache[layer].trueGlowColor = GameCache[layer].glowColor;
		GameCache[layer].notify = new Lazy(() => shouldNotify(layer));
		GameCache[layer].prestigeNotify = new Lazy(() => prestigeNotify(layer));
		if (GameCache[layer].passiveGeneration === true) GameCache[layer].passiveGeneration = 1; // new Decimal(true) = decimalZero

	}

	GameCache.pointGen = new Lazy(() => getPointGen());
	GameCache.backgroundStyle = readData(backgroundStyle);

	GameCache.displayThings = []
	for (thing in displayThings) {
		let text = displayThings[thing]
		if (isFunction(text)) text = text()
		GameCache.displayThings.push(text) 
	}
}

function updateTempData(layerData, tmpData, funcsData, useThis) {
	for (item in funcsData){
		if (Array.isArray(layerData[item])) {
			if (item !== "tabFormat" && item !== "content") // These are only updated when needed
				updateTempData(layerData[item], tmpData[item], funcsData[item], useThis)
		}
		else if (Boolean(layerData[item]) && (layerData[item].constructor === Object) || (typeof layerData[item] === "object") && traversableClasses.includes(layerData[item].constructor.name)) {
			updateTempData(layerData[item], tmpData[item], funcsData[item], useThis)
		}
		else if (isFunction(layerData[item]) && !isFunction(tmpData[item])){
			let value
			if (useThis !== undefined) value = layerData[item].bind(useThis)()
			else value = layerData[item]()
			Vue.set(tmpData, item, value)
		}
	}	
}

export function updateChallengeTemp(layer) {
	updateTempData(layers[layer].challenges, GameCache[layer].challenges, CachedFunctions[layer].challenges)
}


export function updateBuyableTemp(layer) {
	updateTempData(layers[layer].buyables, GameCache[layer].buyables, CachedFunctions[layer].buyables)
}

export function updateClickableTemp(layer) {
	updateTempData(layers[layer].clickables, GameCache[layer].clickables, CachedFunctions[layer].clickables)
}

export function setupBuyables(layer) {
	for (id in layers[layer].buyables) {
		if (isPlainObject(layers[layer].buyables[id])) {
			let b = layers[layer].buyables[id]
			b.actualCostFunction = b.cost
			b.cost = x => {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x)
				return layers[this.layer].buyables[this.id].actualCostFunction(x)
			}
			b.actualEffectFunction = b.effect
			b.effect = x => {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x)
				return layers[this.layer].buyables[this.id].actualEffectFunction(x)
			}
		}
	}
}

export function checkDecimalNaN(x) {
	return (x instanceof Decimal) && !x.eq(x)
}