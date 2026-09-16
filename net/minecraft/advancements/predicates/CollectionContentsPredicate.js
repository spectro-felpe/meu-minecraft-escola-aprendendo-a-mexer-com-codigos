class CollectionContentsPredicate {
  constructor(predicates = []) {
    this.predicates = Array.isArray(predicates) ? predicates : [predicates];
  }

  static of(...predicates) {
    const list = Array.isArray(predicates[0]) ? predicates[0] : predicates;
    if (list.length === 0) return new CollectionContentsPredicate.Zero();
    if (list.length === 1) return new CollectionContentsPredicate.Single(list[0]);
    return new CollectionContentsPredicate.Multiple(list);
  }

  unpack() {
    return this.predicates;
  }

  test(iterable = []) {
    return true;
  }
}

CollectionContentsPredicate.Zero = class extends CollectionContentsPredicate {
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

CollectionContentsPredicate.Single = class extends CollectionContentsPredicate {
  constructor(predicate) {
    super([predicate]);
    this.predicate = predicate;
  }

  test(iterable = []) {
    if (!iterable) return false;
    const values = Array.isArray(iterable) ? iterable : Array.from(iterable);

    for (const value of values) {
      if (this.predicate && typeof this.predicate.test === 'function' && this.predicate.test(value)) {
        return true;
      }
      if (this.predicate && typeof this.predicate.matches === 'function' && this.predicate.matches(value)) {
        return true;
      }
    }
    return false;
  }

  unpack() {
    return [this.predicate];
  }
};

CollectionContentsPredicate.Multiple = class extends CollectionContentsPredicate {
  constructor(predicates = []) {
    super(predicates);
  }

  test(iterable = []) {
    if (!iterable) return false;
    const values = Array.isArray(iterable) ? iterable : Array.from(iterable);
    const testsToMatch = [...this.predicates];

    for (const value of values) {
      for (let i = testsToMatch.length - 1; i >= 0; i--) {
        const p = testsToMatch[i];
        const passed = (p && typeof p.test === 'function' && p.test(value)) ||
                       (p && typeof p.matches === 'function' && p.matches(value));
        
        if (passed) {
          testsToMatch.splice(i, 1);
        }
      }

      if (testsToMatch.length === 0) {
        return true;
      }
    }

    return false;
  }

  unpack() {
    return this.predicates;
  }
};

window.CollectionContentsPredicate = CollectionContentsPredicate;
