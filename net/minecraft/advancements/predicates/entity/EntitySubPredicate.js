class EntitySubPredicate {
  static ALWAYS_TRUE = {
    matches: (entity, level, position) => true
  };

  matches(entity, level = null, position = null) {
    return true;
  }

  and(other) {
    return {
      matches: (entity, level, position) => {
        return this.matches(entity, level, position) && other.matches(entity, level, position);
      }
    };
  }
}

window.EntitySubPredicate = EntitySubPredicate;
