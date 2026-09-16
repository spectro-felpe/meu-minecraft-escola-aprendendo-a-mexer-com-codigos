class FishingHookPredicate {
  constructor(inOpenWater = null) {
    this.inOpenWater = inOpenWater;
  }

  static ANY = new FishingHookPredicate(null);

  static inOpenWater(requirement) {
    return new FishingHookPredicate(requirement);
  }

  matches(entity, level = null, position = null) {
    if (this.inOpenWater === null) {
      return true;
    }

    if (!entity) return false;

    const isOpenWater = typeof entity.isOpenWaterFishing === 'function'
      ? entity.isOpenWaterFishing()
      : !!entity.isOpenWater;

    return this.inOpenWater === isOpenWater;
  }
}

window.FishingHookPredicate = FishingHookPredicate;
