class EntityFlagsPredicate {
  constructor(flags = {}) {
    this.isOnGround = flags.isOnGround ?? null;
    this.isOnFire = flags.isOnFire ?? null;
    this.isCrouching = flags.isCrouching ?? null;
    this.isSprinting = flags.isSprinting ?? null;
    this.isSwimming = flags.isSwimming ?? null;
    this.isFlying = flags.isFlying ?? null;
    this.isBaby = flags.isBaby ?? null;
    this.isInWater = flags.isInWater ?? null;
    this.isFallFlying = flags.isFallFlying ?? null;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    if (this.isOnGround !== null && (typeof entity.onGround === 'function' ? entity.onGround() : !!entity.onGround) !== this.isOnGround) {
      return false;
    }

    if (this.isOnFire !== null && (typeof entity.isOnFire === 'function' ? entity.isOnFire() : !!entity.isOnFire) !== this.isOnFire) {
      return false;
    }

    if (this.isCrouching !== null && (typeof entity.isCrouching === 'function' ? entity.isCrouching() : !!entity.isCrouching) !== this.isCrouching) {
      return false;
    }

    if (this.isSprinting !== null && (typeof entity.isSprinting === 'function' ? entity.isSprinting() : !!entity.isSprinting) !== this.isSprinting) {
      return false;
    }

    if (this.isSwimming !== null && (typeof entity.isSwimming === 'function' ? entity.isSwimming() : !!entity.isSwimming) !== this.isSwimming) {
      return false;
    }

    if (this.isFlying !== null) {
      const isFallFlying = typeof entity.isFallFlying === 'function' ? entity.isFallFlying() : !!entity.isFallFlying;
      const isPlayerFlying = entity.abilities ? !!entity.abilities.flying : false;
      const entityIsFlying = isFallFlying || isPlayerFlying;

      if (entityIsFlying !== this.isFlying) {
        return false;
      }
    }

    if (this.isInWater !== null && (typeof entity.isInWater === 'function' ? entity.isInWater() : !!entity.isInWater) !== this.isInWater) {
      return false;
    }

    if (this.isFallFlying !== null && (typeof entity.isFallFlying === 'function' ? entity.isFallFlying() : !!entity.isFallFlying) !== this.isFallFlying) {
      return false;
    }

    if (this.isBaby !== null && (typeof entity.isBaby === 'function' ? entity.isBaby() : !!entity.isBaby) !== this.isBaby) {
      return false;
    }

    return true;
  }
}

class EntityFlagsPredicateBuilder {
  constructor() {
    this.flags = {};
  }

  static flags() {
    return new EntityFlagsPredicateBuilder();
  }

  setOnGround(onGround) { this.flags.isOnGround = onGround; return this; }
  setOnFire(onFire) { this.flags.isOnFire = onFire; return this; }
  setCrouching(crouching) { this.flags.isCrouching = crouching; return this; }
  setSprinting(sprinting) { this.flags.isSprinting = sprinting; return this; }
  setSwimming(swimming) { this.flags.isSwimming = swimming; return this; }
  setIsFlying(flying) { this.flags.isFlying = flying; return this; }
  setIsBaby(baby) { this.flags.isBaby = baby; return this; }
  setIsInWater(inWater) { this.flags.isInWater = inWater; return this; }
  setIsFallFlying(fallFlying) { this.flags.isFallFlying = fallFlying; return this; }

  build() {
    return new EntityFlagsPredicate(this.flags);
  }
}

window.EntityFlagsPredicate = EntityFlagsPredicate;
window.EntityFlagsPredicateBuilder = EntityFlagsPredicateBuilder;
