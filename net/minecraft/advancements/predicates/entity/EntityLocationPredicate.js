class EntityLocationPredicate {
  constructor(predicate = null) {
    this.predicate = predicate;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    if (this.predicate && typeof this.predicate.matches === 'function') {
      const x = typeof entity.getX === 'function' ? entity.getX() : (entity.position?.x || 0);
      const y = typeof entity.getY === 'function' ? entity.getY() : (entity.position?.y || 0);
      const z = typeof entity.getZ === 'function' ? entity.getZ() : (entity.position?.z || 0);

      return this.predicate.matches(level, x, y, z);
    }

    return true;
  }
}

window.EntityLocationPredicate = EntityLocationPredicate;
