export class Pool {
  constructor() {
    this._pool = {}
    this._elementCount = 0
  }

  add(element) {
    if (!(element in this._pool)) {
      this._pool[element] = 0
    }
    this._pool[element]++
    this._elementCount++
  }

  has(element) {
    return element in this._pool
  }

  remove(element) {
    if (--this._pool[element] == 0) {
      delete this._pool[element]
    }
    this._elementCount--
  }

  pick() {
    for (const k in this._pool) {
      return k
    }
  }

  isEmpty() {
    return this._elementCount === 0
  }
}
