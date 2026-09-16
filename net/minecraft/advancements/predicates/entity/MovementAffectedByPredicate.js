class MovementAffectedByPredicate {
  constructor(predicate = null) {
    this.predicate = predicate;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    if (this.predicate && typeof this.predicate.matches === 'function') {
      let x = 0, y = 0, z = 0;

      if (typeof entity.getBlockPosBelowThatAffectsMyMovement === 'function') {
        const pos = entity.getBlockPosBelowThatAffectsMyMovement();
        x = pos.x ?? pos.getX?.() ?? 0;
        y = pos.y ?? pos.getY?.() ?? 0;
        z = pos.z ?? pos.getZ?.() ?? 0;
      } else {
        x = typeof entity.getX === 'function' ? entity.getX() : (entity.position?.x || 0);
        y = (typeof entity.getY === 'function' ? entity.getY() : (entity.position?.y || 0)) - 0.5;
        z = typeof entity.getZ === 'function' ? entity.getZ() : (entity.position?.z || 0);
      }

      return this.predicate.matches(level, x, y, z);
    }

    return true;
  }
}

window.MovementAffectedByPredicate = MovementAffectedByPredicate;
