class EntityPartialComponentsPredicate {
  constructor(predicates = new Map()) {
    this.predicates = predicates;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    const predicateList = this.predicates instanceof Map 
      ? Array.from(this.predicates.values()) 
      : Object.values(this.predicates || {});

    for (const predicate of predicateList) {
      if (predicate && typeof predicate.matches === 'function') {
        if (!predicate.matches(entity)) {
          return false;
        }
      }
    }

    return true;
  }
}

window.EntityPartialComponentsPredicate = EntityPartialComponentsPredicate;
