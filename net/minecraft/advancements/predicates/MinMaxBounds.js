class Bounds {
  constructor(min = null, max = null) {
    this.min = min;
    this.max = max;
  }

  isAny() {
    return this.min === null && this.max === null;
  }

  areSwapped() {
    return this.min !== null && this.max !== null && this.min > this.max;
  }

  asPoint() {
    return this.min !== null && this.min === this.max ? this.min : null;
  }

  static any() {
    return new Bounds(null, null);
  }

  static exactly(value) {
    return new Bounds(value, value);
  }

  static between(min, max) {
    return new Bounds(min, max);
  }

  static atLeast(value) {
    return new Bounds(value, null);
  }

  static atMost(value) {
    return new Bounds(null, value);
  }

  map(mapper) {
    const newMin = this.min !== null ? mapper(this.min) : null;
    const newMax = this.max !== null ? mapper(this.max) : null;
    return new Bounds(newMin, newMax);
  }

  static fromReader(reader, converter) {
    if (!reader || typeof reader.canRead !== 'function' || !reader.canRead()) {
      throw new Error("Argument range empty");
    }

    const start = typeof reader.getCursor === 'function' ? reader.getCursor() : 0;

    let min = Bounds._readNumber(reader, converter);
    let max;

    if (typeof reader.canRead === 'function' && reader.canRead(2) && reader.peek() === '.' && reader.peek(1) === '.') {
      reader.skip();
      reader.skip();
      max = Bounds._readNumber(reader, converter);
    } else {
      max = min;
    }

    if (min === null && max === null) {
      throw new Error("Argument range empty");
    }

    return new Bounds(min, max);
  }

  static _readNumber(reader, converter) {
    const start = reader.getCursor();

    while (reader.canRead() && Bounds._isAllowedInputChar(reader)) {
      reader.skip();
    }

    const str = reader.getString().substring(start, reader.getCursor());
    if (str.length === 0) {
      return null;
    }

    return converter(str);
  }

  static _isAllowedInputChar(reader) {
    const c = reader.peek();
    if ((c < '0' || c > '9') && c !== '-') {
      return c !== '.' ? false : !reader.canRead(2) || reader.peek(1) !== '.';
    }
    return true;
  }
}

class Doubles {
  constructor(bounds, boundsSqr = null) {
    this.bounds = bounds;
    this.boundsSqr = boundsSqr || bounds.map(v => v * v);
  }

  static exactly(value) { return new Doubles(Bounds.exactly(value)); }
  static between(min, max) { return new Doubles(Bounds.between(min, max)); }
  static atLeast(value) { return new Doubles(Bounds.atLeast(value)); }
  static atMost(value) { return new Doubles(Bounds.atMost(value)); }

  min() { return this.bounds.min; }
  max() { return this.bounds.max; }
  isAny() { return this.bounds.isAny(); }

  matches(value) {
    if (this.bounds.min !== null && this.bounds.min > value) return false;
    if (this.bounds.max !== null && this.bounds.max < value) return false;
    return true;
  }

  matchesSqr(valueSqr) {
    if (this.boundsSqr.min !== null && this.boundsSqr.min > valueSqr) return false;
    if (this.boundsSqr.max !== null && this.boundsSqr.max < valueSqr) return false;
    return true;
  }

  static fromReader(reader) {
    const start = reader.getCursor();
    const bounds = Bounds.fromReader(reader, parseFloat);
    if (bounds.areSwapped()) {
      reader.setCursor(start);
      throw new Error("Swapped bounds in range");
    }
    return new Doubles(bounds);
  }
}
Doubles.ANY = new Doubles(Bounds.any());

class FloatDegrees {
  constructor(bounds) {
    this.bounds = bounds;
  }

  min() { return this.bounds.min; }
  max() { return this.bounds.max; }
  isAny() { return this.bounds.isAny(); }

  matches(value) {
    if (this.bounds.min !== null && this.bounds.min > value) return false;
    if (this.bounds.max !== null && this.bounds.max < value) return false;
    return true;
  }

  static fromReader(reader) {
    const bounds = Bounds.fromReader(reader, parseFloat);
    return new FloatDegrees(bounds);
  }
}
FloatDegrees.ANY = new FloatDegrees(Bounds.any());

class Ints {
  constructor(bounds, boundsSqr = null) {
    this.bounds = bounds;
    this.boundsSqr = boundsSqr || bounds.map(v => v * v);
  }

  static exactly(value) { return new Ints(Bounds.exactly(value)); }
  static between(min, max) { return new Ints(Bounds.between(min, max)); }
  static atLeast(value) { return new Ints(Bounds.atLeast(value)); }
  static atMost(value) { return new Ints(Bounds.atMost(value)); }

  min() { return this.bounds.min; }
  max() { return this.bounds.max; }
  isAny() { return this.bounds.isAny(); }

  matches(value) {
    if (this.bounds.min !== null && this.bounds.min > value) return false;
    if (this.bounds.max !== null && this.bounds.max < value) return false;
    return true;
  }

  matchesSqr(valueSqr) {
    if (this.boundsSqr.min !== null && this.boundsSqr.min > valueSqr) return false;
    if (this.boundsSqr.max !== null && this.boundsSqr.max < valueSqr) return false;
    return true;
  }

  static fromReader(reader) {
    const start = reader.getCursor();
    const bounds = Bounds.fromReader(reader, parseInt);
    if (bounds.areSwapped()) {
      reader.setCursor(start);
      throw new Error("Swapped bounds in range");
    }
    return new Ints(bounds);
  }
}
Ints.ANY = new Ints(Bounds.any());

const MinMaxBounds = {
  Bounds,
  Doubles,
  FloatDegrees,
  Ints
};

window.MinMaxBounds = MinMaxBounds;
