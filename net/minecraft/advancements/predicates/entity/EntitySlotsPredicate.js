class EntitySlotsPredicate {
  constructor(slots = null) {
    this.slots = slots;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    if (this.slots && typeof this.slots.matches === 'function') {
      return this.slots.matches(entity);
    }

    return true;
  }
}

window.EntitySlotsPredicate = EntitySlotsPredicate;
