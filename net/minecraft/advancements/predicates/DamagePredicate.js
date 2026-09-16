class DamagePredicate {
  constructor(
    dealtDamage = null,
    takenDamage = null,
    sourceEntity = null,
    blocked = null,
    type = null
  ) {
    this.dealtDamage = dealtDamage;
    this.takenDamage = takenDamage;
    this.sourceEntity = sourceEntity;
    this.blocked = blocked;
    this.type = type;
  }

  matches(player, source, originalDamage, actualDamage, blocked) {
    // 1. Dano causado (original)
    if (this.dealtDamage && typeof this.dealtDamage.matches === 'function') {
      if (!this.dealtDamage.matches(originalDamage)) {
        return false;
      }
    }

    // 2. Dano sofrido (real)
    if (this.takenDamage && typeof this.takenDamage.matches === 'function') {
      if (!this.takenDamage.matches(actualDamage)) {
        return false;
      }
    }

    // 3. Entidade de origem do dano
    if (this.sourceEntity && typeof this.sourceEntity.matches === 'function') {
      const sourceEnt = typeof source?.getEntity === 'function' ? source.getEntity() : source?.entity;
      if (!this.sourceEntity.matches(player, sourceEnt)) {
        return false;
      }
    }

    // 4. Se o dano foi bloqueado
    if (this.blocked !== null && this.blocked !== undefined) {
      if (this.blocked !== blocked) {
        return false;
      }
    }

    // 5. Tipo de dano (DamageSourcePredicate)
    if (this.type && typeof this.type.matches === 'function') {
      if (!this.type.matches(player, source)) {
        return false;
      }
    }

    return true;
  }
}

class DamagePredicateBuilder {
  constructor() {
    this.dealtDamageVal = null;
    this.takenDamageVal = null;
    this.sourceEntityVal = null;
    this.blockedVal = null;
    this.typeVal = null;
  }

  static damageInstance() {
    return new DamagePredicateBuilder();
  }

  dealtDamage(dealtDamage) {
    this.dealtDamageVal = dealtDamage;
    return this;
  }

  takenDamage(takenDamage) {
    this.takenDamageVal = takenDamage;
    return this;
  }

  sourceEntity(sourceEntity) {
    this.sourceEntityVal = typeof sourceEntity?.build === 'function' ? sourceEntity.build() : sourceEntity;
    return this;
  }

  blocked(blocked) {
    this.blockedVal = blocked;
    return this;
  }

  type(type) {
    this.typeVal = typeof type?.build === 'function' ? type.build() : type;
    return this;
  }

  build() {
    return new DamagePredicate(
      this.dealtDamageVal,
      this.takenDamageVal,
      this.sourceEntityVal,
      this.blockedVal,
      this.typeVal
    );
  }
}

window.DamagePredicate = DamagePredicate;
window.DamagePredicateBuilder = DamagePredicateBuilder;
