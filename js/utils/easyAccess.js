/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {boolean}
 */

export function hasUpgrade(layer, id) {
	return ((player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString())) && !tmp[layer].deactivated)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {boolean}
 */

export function hasMilestone(layer, id) {
	return ((player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString())) && !tmp[layer].deactivated)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {boolean}
 */

export function hasAchievement(layer, id) {
	return ((player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString())) && !tmp[layer].deactivated)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {boolean}
 */

export function hasChallenge(layer, id) {
	return ((player[layer].challenges[id]) && !tmp[layer].deactivated)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {boolean}
 */

export function maxedChallenge(layer, id) {
	return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {number|Decimal}
 */

export function challengeCompletions(layer, id) {
	return (player[layer].challenges[id])
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {number|Decimal}
 */

export function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id])
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @param {number|Decimal} amt 
 */

export function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @param {number|Decimal} amt 
 */

export function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {*}
 */

export function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @param {*} state 
 */

export function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

export function getGridData(layer, id) {
	return (player[layer].grid[id])
}

export function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {number|Decimal}
 */

export function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {number|Decimal}
 */

export function challengeEffect(layer, id) {
	return (tmp[layer].challenges[id].rewardEffect)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {number|Decimal}
 */

export function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {number|Decimal}
 */

export function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect)
}

/**
 * 
 * @param {string} layer 
 * @param {number} id 
 * @returns {number|Decimal}
 */

export function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect)
}

export function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
}