class SlotsPredicate {
  constructor(slots = new Map()) {
    this.slots = slots instanceof Map ? slots : new Map(Object.entries(slots));
  }

  matches(slotProvider) {
    if (!slotProvider) return false;

    for (const [slotRange, itemPredicate] of this.slots.entries()) {
      const slotsList = Array.isArray(slotRange?.slots)
        ? slotRange.slots
        : (typeof slotRange?.slots === 'function' ? slotRange.slots() : []);

      if (!SlotsPredicate.matchSlots(slotProvider, itemPredicate, slotsList)) {
        return false;
      }
    }

    return true;
  }

  static matchSlots(slotProvider, test, slots) {
    if (!slots || !test) return false;

    for (let i = 0; i < slots.length; i++) {
      const slotId = typeof slots.getInt === 'function' ? slots.getInt(i) : slots[i];
      
      let slot = null;
      if (typeof slotProvider.getSlot === 'function') {
        slot = slotProvider.getSlot(slotId);
      }

      const itemStack = typeof slot?.get === 'function' ? slot.get() : (slot?.item || slot);

      const isMatch = typeof test.test === 'function' 
        ? test.test(itemStack) 
        : (typeof test.matches === 'function' ? test.matches(itemStack) : false);

      if (slot && isMatch) {
        return true;
      }
    }

    return false;
  }
}

window.SlotsPredicate = SlotsPredicate;
