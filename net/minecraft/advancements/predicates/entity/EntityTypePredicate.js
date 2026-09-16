class EntityTypePredicate {
  constructor(types = null) {
    this.types = types;
  }

  static of(lookup, type) {
    const holder = typeof type?.builtInRegistryHolder === 'function' 
      ? type.builtInRegistryHolder() 
      : type;
    return new EntityTypePredicate([holder]);
  }

  matches(typeOrEntity, level = null, position = null) {
    if (!typeOrEntity) return false;

    // Extrai o tipo se for passado uma entidade
    let targetType = typeOrEntity;
    if (typeof typeOrEntity.typeHolder === 'function') {
      targetType = typeOrEntity.typeHolder();
    } else if (typeOrEntity.type) {
      targetType = typeOrEntity.type;
    }

    if (!this.types) return true;

    // Se this.types for um Set/Array ou tiver um método .contains()
    if (typeof this.types.contains === 'function') {
      return this.types.contains(targetType);
    }

    if (Array.isArray(this.types) || this.types instanceof Set) {
      const typeSet = this.types instanceof Set ? this.types : new Set(this.types);
      return typeSet.has(targetType);
    }

    return true;
  }
}

window.EntityTypePredicate = EntityTypePredicate;
