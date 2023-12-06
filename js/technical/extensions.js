/**
 * Copies the object to a new object.
 * @param {object} obj 
 */
Object.prototype.copyFrom = obj => {
    this = obj;
}

window.safeCall = fn => { if (fn) fn() }