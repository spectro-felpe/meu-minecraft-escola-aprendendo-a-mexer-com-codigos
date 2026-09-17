class TargetedEntityPredicate {
  constructor(targetedEntity) {
    this.targetedEntity = targetedEntity;
  }

  matches(entity, level, position) {
    if (!this.targetedEntity || !entity) return false;

    // Obtém o alvo (target) se a entidade for um Mob / tiver o método getTarget
    let target = null;
    if (typeof entity.getTarget === 'function') {
      target = entity.getTarget();
    } else if (entity.target) {
      target = entity.target;
    }

    if (typeof this.targetedEntity.matches === 'function') {
      return this.targetedEntity.matches(level, position, target);
    }

    return false;
  }
}

window.TargetedEntityPredicate = TargetedEntityPredicate;
