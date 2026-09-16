class MovementPredicate {
  constructor(x = null, y = null, z = null, speed = null, horizontalSpeed = null, verticalSpeed = null, fallDistance = null) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.speed = speed;
    this.horizontalSpeed = horizontalSpeed;
    this.verticalSpeed = verticalSpeed;
    this.fallDistance = fallDistance;
  }

  static speed(bounds) {
    return new MovementPredicate(null, null, null, bounds, null, null, null);
  }

  static horizontalSpeed(bounds) {
    return new MovementPredicate(null, null, null, null, bounds, null, null);
  }

  static verticalSpeed(bounds) {
    return new MovementPredicate(null, null, null, null, null, bounds, null);
  }

  static fallDistance(bounds) {
    return new MovementPredicate(null, null, null, null, null, null, bounds);
  }

  matchesMovement(dx, dy, dz, fallDist) {
    if (this.x && typeof this.x.matches === 'function' && !this.x.matches(dx)) return false;
    if (this.y && typeof this.y.matches === 'function' && !this.y.matches(dy)) return false;
    if (this.z && typeof this.z.matches === 'function' && !this.z.matches(dz)) return false;

    const speedSqr = dx * dx + dy * dy + dz * dz;
    if (this.speed) {
      if (typeof this.speed.matchesSqr === 'function' && !this.speed.matchesSqr(speedSqr)) return false;
      if (typeof this.speed.matches === 'function' && !this.speed.matches(Math.sqrt(speedSqr))) return false;
    }

    const horizSpeedSqr = dx * dx + dz * dz;
    if (this.horizontalSpeed) {
      if (typeof this.horizontalSpeed.matchesSqr === 'function' && !this.horizontalSpeed.matchesSqr(horizSpeedSqr)) return false;
      if (typeof this.horizontalSpeed.matches === 'function' && !this.horizontalSpeed.matches(Math.sqrt(horizSpeedSqr))) return false;
    }

    const vertSpeed = Math.abs(dy);
    if (this.verticalSpeed && typeof this.verticalSpeed.matches === 'function' && !this.verticalSpeed.matches(vertSpeed)) {
      return false;
    }

    if (this.fallDistance && typeof this.fallDistance.matches === 'function' && !this.fallDistance.matches(fallDist)) {
      return false;
    }

    return true;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    let movement = { x: 0, y: 0, z: 0 };

    if (typeof entity.getKnownMovement === 'function') {
      const vec = entity.getKnownMovement();
      movement.x = (vec.x || 0) * 20.0;
      movement.y = (vec.y || 0) * 20.0;
      movement.z = (vec.z || 0) * 20.0;
    } else if (entity.velocity) {
      movement.x = (entity.velocity.x || 0) * 20.0;
      movement.y = (entity.velocity.y || 0) * 20.0;
      movement.z = (entity.velocity.z || 0) * 20.0;
    }

    const fallDist = entity.fallDistance || 0;

    return this.matchesMovement(movement.x, movement.y, movement.z, fallDist);
  }
}

window.MovementPredicate = MovementPredicate;
