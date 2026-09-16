class CubeMobPredicate {
  constructor(size = null) {
    this.size = size; 
  }

  static sized(size) {
    return new CubeMobPredicate(size);
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    if (typeof entity.getSize === 'function') {
      const entitySize = entity.getSize();
      
      if (!this.size) return true;

      return this.size.matches ? this.size.matches(entitySize) : entitySize === this.size;
    }

    return false;
  }
}

window.CubeMobPredicate = CubeMobPredicate;
