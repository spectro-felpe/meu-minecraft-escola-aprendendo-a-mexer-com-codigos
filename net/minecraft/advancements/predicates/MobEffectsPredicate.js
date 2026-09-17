class MobEffectInstancePredicate {
  constructor(amplifier = null, duration = null, ambient = null, visible = null) {
    this.amplifier = amplifier || (window.MinMaxBounds?.Ints?.ANY || null);
    this.duration = duration || (window.MinMaxBounds?.Ints?.ANY || null);
    this.ambient = ambient ?? null;
    this.visible = visible ?? null;
  }

  matches(instance) {
    if (!instance) return false;

    // Amplificador (Nível do efeito)
    const ampVal = typeof instance.getAmplifier === 'function' ? instance.getAmplifier() : (instance.amplifier ?? 0);
    if (this.amplifier && typeof this.amplifier.matches === 'function' && !this.amplifier.matches(ampVal)) {
      return false;
    }

    // Duração
    const durVal = typeof instance.getDuration === 'function' ? instance.getDuration() : (instance.duration ?? 0);
    if (this.duration && typeof this.duration.matches === 'function' && !this.duration.matches(durVal)) {
      return false;
    }

    // Ambiente (Efeito de farol/poção)
    if (this.ambient !== null) {
      const isAmbient = typeof instance.isAmbient === 'function' ? instance.isAmbient() : !!instance.ambient;
      if (this.ambient !== isAmbient) return false;
    }

    // Visibilidade das partículas
    if (this.visible !== null) {
      const isVisible = typeof instance.isVisible === 'function' ? instance.isVisible() : !!instance.visible;
      if (this.visible !== isVisible) return false;
    }

    return true;
  }
}

class MobEffectsPredicate {
  constructor(effectMap = new Map()) {
    this.effectMap = effectMap instanceof Map ? effectMap : new Map(Object.entries(effectMap));
  }

  matches(entityOrEffects) {
    if (!entityOrEffects) return false;

    // Se for uma entidade, obtém o mapa de efeitos ativos
    let effectsMap = entityOrEffects;
    if (typeof entityOrEffects.getActiveEffectsMap === 'function') {
      effectsMap = entityOrEffects.getActiveEffectsMap();
    } else if (entityOrEffects.activeEffects) {
      effectsMap = entityOrEffects.activeEffects;
    }

    if (!effectsMap) return false;

    // Converte para Map caso seja um objeto JavaScript comum
    const effects = effectsMap instanceof Map ? effectsMap : new Map(Object.entries(effectsMap));

    for (const [effectHolder, predicate] of this.effectMap.entries()) {
      let instance = effects.get(effectHolder);

      // Tenta buscar por ID caso a chave seja um objeto/Holder
      if (!instance && effectHolder?.id) {
        instance = effects.get(effectHolder.id);
      }

      if (!predicate || typeof predicate.matches !== 'function' || !predicate.matches(instance)) {
        return false;
      }
    }

    return true;
  }

  test(mobEffect) {
    if (!mobEffect) return false;

    const effectKey = typeof mobEffect.getEffect === 'function' ? mobEffect.getEffect() : mobEffect.effect;
    const predicate = this.effectMap.get(effectKey);

    return !!(predicate && typeof predicate.matches === 'function' && predicate.matches(mobEffect));
  }
}

class MobEffectsPredicateBuilder {
  constructor() {
    this.map = new Map();
  }

  static effects() {
    return new MobEffectsPredicateBuilder();
  }

  and(effect, predicate = new MobEffectInstancePredicate()) {
    this.map.set(effect, predicate);
    return this;
  }

  build() {
    return new MobEffectsPredicate(this.map);
  }
}

MobEffectsPredicate.MobEffectInstancePredicate = MobEffectInstancePredicate;
MobEffectsPredicate.Builder = MobEffectsPredicateBuilder;

window.MobEffectInstancePredicate = MobEffectInstancePredicate;
window.MobEffectsPredicate = MobEffectsPredicate;
window.MobEffectsPredicateBuilder = MobEffectsPredicateBuilder;
