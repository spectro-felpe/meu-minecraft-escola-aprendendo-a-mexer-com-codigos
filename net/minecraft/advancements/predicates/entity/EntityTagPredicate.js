class EntityTagPredicate {
  constructor(tags = {}) {
    this.anyOf = tags.anyOf || null;
    this.allOf = tags.allOf || null;
    this.noneOf = tags.noneOf || null;
  }

  matches(entityOrTags, level = null, position = null) {
    if (!entityOrTags) return false;

    // Obtém o conjunto/lista de tags da entidade ou o parâmetro direto
    let tags = entityOrTags;
    if (typeof entityOrTags.entityTags === 'function') {
      tags = entityOrTags.entityTags();
    } else if (entityOrTags.tags) {
      tags = entityOrTags.tags;
    }

    const tagSet = tags instanceof Set ? tags : new Set(Array.isArray(tags) ? tags : []);

    if (this.anyOf && !EntityTagPredicate.containsAtLeastOne(tagSet, this.anyOf)) {
      return false;
    }

    if (this.noneOf && EntityTagPredicate.containsAtLeastOne(tagSet, this.noneOf)) {
      return false;
    }

    if (this.allOf && !EntityTagPredicate.containsAllOf(tagSet, this.allOf)) {
      return false;
    }

    return true;
  }

  static containsAtLeastOne(provided, tags) {
    for (const tag of tags) {
      if (provided.has(tag)) {
        return true;
      }
    }
    return false;
  }

  static containsAllOf(provided, tags) {
    for (const tag of tags) {
      if (!provided.has(tag)) {
        return false;
      }
    }
    return true;
  }
}

window.EntityTagPredicate = EntityTagPredicate;
