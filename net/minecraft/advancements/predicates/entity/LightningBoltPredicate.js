class LightningBoltPredicate {
  constructor(blocksSetOnFire = null, entityStruck = null) {
    this.blocksSetOnFire = blocksSetOnFire;
    this.entityStruck = entityStruck;
  }

  static blockSetOnFire(count) {
    return new LightningBoltPredicate(count, null);
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    // Checa blocos pegando fogo
    if (this.blocksSetOnFire && typeof this.blocksSetOnFire.matches === 'function') {
      const blocksCount = typeof entity.getBlocksSetOnFire === 'function'
        ? entity.getBlocksSetOnFire()
        : (entity.blocksSetOnFire || 0);

      if (!this.blocksSetOnFire.matches(blocksCount)) {
        return false;
      }
    }

    // Checa entidades atingidas pelo raio
    if (this.entityStruck && typeof this.entityStruck.matches === 'function') {
      let hitEntities = [];
      if (typeof entity.getHitEntities === 'function') {
        const result = entity.getHitEntities();
        hitEntities = Array.isArray(result) ? result : Array.from(result || []);
      } else if (Array.isArray(entity.hitEntities)) {
        hitEntities = entity.hitEntities;
      }

      const hasMatchingEntity = hitEntities.some(hitEntity => 
        this.entityStruck.matches(level, position, hitEntity)
      );

      if (!hasMatchingEntity) {
        return false;
      }
    }

    return true;
  }
}

window.LightningBoltPredicate = LightningBoltPredicate;
