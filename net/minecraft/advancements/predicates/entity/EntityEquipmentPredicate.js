class EntityEquipmentPredicate {
  constructor(equipment = {}) {
    this.head = equipment.head || null;
    this.chest = equipment.chest || null;
    this.legs = equipment.legs || null;
    this.feet = equipment.feet || null;
    this.body = equipment.body || null;
    this.mainhand = equipment.mainhand || null;
    this.offhand = equipment.offhand || null;
  }

  matches(entity, level = null, position = null) {
    if (!entity || typeof entity.getItemBySlot !== 'function') return false;

    const slots = {
      head: this.head,
      chest: this.chest,
      legs: this.legs,
      feet: this.feet,
      body: this.body,
      mainhand: this.mainhand,
      offhand: this.offhand
    };

    for (const [slotName, predicate] of Object.entries(slots)) {
      if (predicate) {
        const item = entity.getItemBySlot(slotName);
        if (typeof predicate.test === 'function' && !predicate.test(item)) {
          return false;
        }
      }
    }

    return true;
  }
}

class EntityEquipmentPredicateBuilder {
  constructor() {
    this.equipment = {};
  }

  static equipment() {
    return new EntityEquipmentPredicateBuilder();
  }

  head(predicate) { this.equipment.head = predicate; return this; }
  chest(predicate) { this.equipment.chest = predicate; return this; }
  legs(predicate) { this.equipment.legs = predicate; return this; }
  feet(predicate) { this.equipment.feet = predicate; return this; }
  body(predicate) { this.equipment.body = predicate; return this; }
  mainhand(predicate) { this.equipment.mainhand = predicate; return this; }
  offhand(predicate) { this.equipment.offhand = predicate; return this; }

  build() {
    return new EntityEquipmentPredicate(this.equipment);
  }
}

window.EntityEquipmentPredicate = EntityEquipmentPredicate;
window.EntityEquipmentPredicateBuilder = EntityEquipmentPredicateBuilder;
