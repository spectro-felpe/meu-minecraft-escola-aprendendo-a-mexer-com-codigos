class DistanceToPlayerPredicate {
  constructor(distance = null) {
    this.distance = distance;
  }

  matches(entity, level = null, position = null) {
    if (!position || !entity) return false;

    if (this.distance && typeof this.distance.matches === 'function') {
      const entityX = typeof entity.getX === 'function' ? entity.getX() : (entity.position?.x || 0);
      const entityY = typeof entity.getY === 'function' ? entity.getY() : (entity.position?.y || 0);
      const entityZ = typeof entity.getZ === 'function' ? entity.getZ() : (entity.position?.z || 0);

      return this.distance.matches(position.x, position.y, position.z, entityX, entityY, entityZ);
    }

    return false;
  }
}

window.DistanceToPlayerPredicate = DistanceToPlayerPredicate;
