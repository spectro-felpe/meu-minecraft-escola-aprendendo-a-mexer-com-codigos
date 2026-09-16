class DamageSourcePredicate {
  constructor(tags = [], directEntity = null, sourceEntity = null, isDirect = null) {
    this.tags = tags;
    this.directEntity = directEntity;
    this.sourceEntity = sourceEntity;
    this.isDirect = isDirect;
  }

  matches(levelOrPlayer, positionOrSource, source) {
    let level;
    let position;
    let damageSource;

    // Trata a sobrecarga: matches(player, source) ou matches(level, position, source)
    if (source === undefined) {
      const player = levelOrPlayer;
      damageSource = positionOrSource;
      level = typeof player?.level === 'function' ? player.level() : player?.level;
      position = typeof player?.position === 'function' ? player.position() : player?.position;
    } else {
      level = levelOrPlayer;
      position = positionOrSource;
      damageSource = source;
    }

    if (!damageSource) return false;

    // 1. Validação das Tags do tipo de dano
    const typeHolder = typeof damageSource.typeHolder === 'function' 
      ? damageSource.typeHolder() 
      : damageSource.typeHolder;

    for (const tag of this.tags) {
      if (tag && typeof tag.matches === 'function' && !tag.matches(typeHolder)) {
        return false;
      }
    }

    // 2. Validação da Entidade Direta (ex: a flecha projetada)
    if (this.directEntity && typeof this.directEntity.matches === 'function') {
      const directEntity = typeof damageSource.getDirectEntity === 'function' 
        ? damageSource.getDirectEntity() 
        : damageSource.directEntity;

      if (!this.directEntity.matches(level, position, directEntity)) {
        return false;
      }
    }

    // 3. Validação da Entidade Origem (ex: o esqueleto que atirou a flecha)
    if (this.sourceEntity && typeof this.sourceEntity.matches === 'function') {
      const entity = typeof damageSource.getEntity === 'function' 
        ? damageSource.getEntity() 
        : damageSource.entity;

      if (!this.sourceEntity.matches(level, position, entity)) {
        return false;
      }
    }

    // 4. Validação se o dano é direto
    if (this.isDirect !== null && this.isDirect !== undefined) {
      const isDirectDamage = typeof damageSource.isDirect === 'function' 
        ? damageSource.isDirect() 
        : !!damageSource.isDirect;

      if (this.isDirect !== isDirectDamage) {
        return false;
      }
    }

    return true;
  }
}

class DamageSourcePredicateBuilder {
  constructor() {
    this.tagsList = [];
    this.directEntityVal = null;
    this.sourceEntityVal = null;
    this.isDirectVal = null;
  }

  static damageType() {
    return new DamageSourcePredicateBuilder();
  }

  tag(tag) {
    this.tagsList.push(tag);
    return this;
  }

  direct(directEntityBuilder) {
    this.directEntityVal = typeof directEntityBuilder?.build === 'function' 
      ? directEntityBuilder.build() 
      : directEntityBuilder;
    return this;
  }

  source(sourceEntityBuilder) {
    this.sourceEntityVal = typeof sourceEntityBuilder?.build === 'function' 
      ? sourceEntityBuilder.build() 
      : sourceEntityBuilder;
    return this;
  }

  isDirect(direct) {
    this.isDirectVal = direct;
    return this;
  }

  build() {
    return new DamageSourcePredicate(
      this.tagsList,
      this.directEntityVal,
      this.sourceEntityVal,
      this.isDirectVal
    );
  }
}

window.DamageSourcePredicate = DamageSourcePredicate;
window.DamageSourcePredicateBuilder = DamageSourcePredicateBuilder;
