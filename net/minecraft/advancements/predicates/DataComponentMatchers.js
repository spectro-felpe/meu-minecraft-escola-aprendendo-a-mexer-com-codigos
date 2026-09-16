class DataComponentMatchers {
  constructor(exact = null, partial = new Map()) {
    this.exact = exact; // Instância de DataComponentExactPredicate
    this.partial = partial instanceof Map ? partial : new Map(Object.entries(partial)); // Map de tipos para predicados
  }

  static ANY = new DataComponentMatchers(null, new Map());

  test(values) {
    if (!values) return false;

    // 1. Validação de componentes exatos
    if (this.exact && typeof this.exact.test === 'function') {
      if (!this.exact.test(values)) {
        return false;
      }
    } else if (this.exact && typeof this.exact.matches === 'function') {
      if (!this.exact.matches(values)) {
        return false;
      }
    }

    // 2. Validação de predicados parciais
    for (const predicate of this.partial.values()) {
      if (predicate) {
        if (typeof predicate.matches === 'function' && !predicate.matches(values)) {
          return false;
        }
        if (typeof predicate.test === 'function' && !predicate.test(values)) {
          return false;
        }
      }
    }

    return true;
  }

  isEmpty() {
    const isExactEmpty = !this.exact || 
      (typeof this.exact.isEmpty === 'function' ? this.exact.isEmpty() : false);
    
    const isPartialEmpty = this.partial.size === 0;

    return isExactEmpty && isPartialEmpty;
  }
}

class DataComponentMatchersBuilder {
  constructor() {
    this.exact = null;
    this.partialMap = new Map();
  }

  static components() {
    return new DataComponentMatchersBuilder();
  }

  any(type) {
    this.partialMap.set(type, {
      matches: (values) => {
        if (!values) return false;
        return typeof values.has === 'function' ? values.has(type) : !!values[type];
      }
    });
    return this;
  }

  partial(type, predicate) {
    this.partialMap.set(type, predicate);
    return this;
  }

  exact(exact) {
    this.exact = exact;
    return this;
  }

  build() {
    return new DataComponentMatchers(this.exact, this.partialMap);
  }
}

window.DataComponentMatchers = DataComponentMatchers;
window.DataComponentMatchersBuilder = DataComponentMatchersBuilder;
