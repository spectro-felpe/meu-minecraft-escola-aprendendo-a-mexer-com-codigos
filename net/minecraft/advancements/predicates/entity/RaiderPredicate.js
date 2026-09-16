class RaiderPredicate {
  constructor(hasRaid = false, isCaptain = false) {
    this.hasRaid = hasRaid;
    this.isCaptain = isCaptain;
  }

  static CAPTAIN_WITHOUT_RAID = new RaiderPredicate(false, true);

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    const hasRaid = typeof entity.hasRaid === 'function' 
      ? entity.hasRaid() 
      : !!entity.hasRaid;

    const isCaptain = typeof entity.isCaptain === 'function' 
      ? entity.isCaptain() 
      : !!entity.isCaptain;

    return hasRaid === this.hasRaid && isCaptain === this.isCaptain;
  }
}

window.RaiderPredicate = RaiderPredicate;
