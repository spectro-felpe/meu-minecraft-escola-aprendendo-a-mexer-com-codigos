class LightPredicate {
  constructor(composite = null) {
    this.composite = composite; // Instância de MinMaxBounds.Ints
  }

  matches(level, pos) {
    if (!level) return false;

    // 1. Verifica se a posição está carregada (se o método existir)
    if (typeof level.isLoaded === 'function' && !level.isLoaded(pos)) {
      return false;
    }

    // 2. Obtém o nível de luz na posição
    const brightness = typeof level.getMaxLocalRawBrightness === 'function' 
      ? level.getMaxLocalRawBrightness(pos) 
      : 0;

    // 3. Valida contra o limite especificado
    if (this.composite && typeof this.composite.matches === 'function') {
      return this.composite.matches(brightness);
    }

    return true;
  }
}

class LightPredicateBuilder {
  constructor() {
    this.compositeVal = null;
  }

  static light() {
    return new LightPredicateBuilder();
  }

  setComposite(composite) {
    this.compositeVal = composite;
    return this;
  }

  build() {
    return new LightPredicate(this.compositeVal);
  }
}

window.LightPredicate = LightPredicate;
window.LightPredicateBuilder = LightPredicateBuilder;
