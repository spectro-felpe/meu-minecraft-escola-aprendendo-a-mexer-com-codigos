class SteppingOnPredicate {
  constructor(predicate = null) {
    this.predicate = predicate;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    // Checa se a entidade está no chão (onGround)
    const isOnGround = typeof entity.onGround === 'function' 
      ? entity.onGround() 
      : !!entity.onGround;

    if (!isOnGround) {
      return false;
    }

    if (this.predicate && typeof this.predicate.matches === 'function') {
      let x = 0, y = 0, z = 0;

      if (typeof entity.getOnPos === 'function') {
        const pos = entity.getOnPos();
        x = (pos.x ?? pos.getX?.() ?? 0) + 0.5;
        y = (pos.y ?? pos.getY?.() ?? 0) + 0.5;
        z = (pos.z ?? pos.getZ?.() ?? 0) + 0.5;
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

window.SteppingOnPredicate = SteppingOnPredicate;
