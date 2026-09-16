class EntityEffectsPredicate {
  constructor(effects = null) {
    this.effects = effects;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    // Se houver um filtro de efeitos, verifica se a entidade satisfaz as condições
    if (this.effects && typeof this.effects.matches === 'function') {
      return this.effects.matches(entity);
    }

    return true;
  }
}

window.EntityEffectsPredicate = EntityEffectsPredicate;
