class CollectionCountsPredicate {
  constructor(entries = []) {
    this.entries = entries;
  }

  static of(...predicates) {
    const list = Array.isArray(predicates[0]) ? predicates[0] : predicates;
    if (list.length === 0) return new CollectionCountsPredicate.Zero();
    if (list.length === 1) return new CollectionCountsPredicate.Single(list[0]);
    return new CollectionCountsPredicate.Multiple(list);
  }

  unpack() {
    return this.entries;
  }

  test(iterable = []) {
    return true;
  }
}

CollectionCountsPredicate.Entry = class {
  constructor(test = null, count = null) {
    this.testPredicate = test; // Predicado para testar cada item
    this.count = count;         // Instância de MinMaxBounds.Ints
  }

  test(iterable = []) {
    if (!iterable) return false;
    const values = Array.isArray(iterable) ? iterable : Array.from(iterable);
    let count = 0;

    for (const value of values) {
      const p = this.testPredicate;
      if (!p) continue;

      const passed = (typeof p.test === 'function' && p.test(value)) ||
                     (typeof p.matches === 'function' && p.matches(value));

      if (passed) {
        count++;
      }
    }

    if (this.count && typeof this.count.matches === 'function') {
      return this.count.matches(count);
    }

    return true;
  }
};

CollectionCountsPredicate.Zero = class extends CollectionCountsPredicate {
  constructor() {
    super([]);
  }

  test(iterable = []) {
    return true;
  }

  unpack() {
    return [];
  }
};

CollectionCountsPredicate.Single = class extends CollectionCountsPredicate {
  constructor(entry) {
    super([entry]);
    this.entry = entry;
  }

  test(iterable = []) {
    return this.entry ? this.entry.test(iterable) : false;
  }

  unpack() {
    return [this.entry];
  }
};

CollectionCountsPredicate.Multiple = class extends CollectionCountsPredicate {
  constructor(entries = []) {
    super(entries);
  }

  test(iterable = []) {
    for (const entry of this.entries) {
      if (entry && !entry.test(iterable)) {
        return false;
      }
    }
    return true;
  }

  unpack() {
    return this.entries;
  }
};

window.CollectionCountsPredicate = CollectionCountsPredicate;
