class EntityNbtPredicate {
  constructor(nbt = null) {
    this.nbt = nbt;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    if (this.nbt && typeof this.nbt.matches === 'function') {
      const entityTag = typeof NbtPredicate?.getEntityTagToCompare === 'function' 
        ? NbtPredicate.getEntityTagToCompare(entity) 
        : (entity.nbtData || null);

      return this.nbt.matches(entityTag);
    }

    return true;
  }
}

window.EntityNbtPredicate = EntityNbtPredicate;
