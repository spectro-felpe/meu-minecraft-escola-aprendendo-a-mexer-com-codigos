class PeriodicEntityTickPredicate {
  constructor(periodicTick = 1) {
    this.periodicTick = periodicTick;
  }

  matches(entity, level = null, position = null) {
    if (!entity || this.periodicTick <= 0) return false;

    const tickCount = typeof entity.tickCount === 'number' 
      ? entity.tickCount 
      : (entity.ticksExisted || 0);

    return tickCount % this.periodicTick === 0;
  }
}

window.PeriodicEntityTickPredicate = PeriodicEntityTickPredicate;
