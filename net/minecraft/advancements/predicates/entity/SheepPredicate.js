class SheepPredicate {
  constructor(sheared = null) {
    this.sheared = sheared;
  }

  static hasWool() {
    return new SheepPredicate(false);
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    if (this.sheared === null) {
      return true;
    }

    const isSheared = typeof entity.isSheared === 'function' 
      ? entity.isSheared() 
      : !!entity.isSheared;

    return isSheared === this.sheared;
  }
}

window.SheepPredicate = SheepPredicate;
