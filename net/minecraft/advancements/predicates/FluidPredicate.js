class FluidPredicate {
  constructor(fluids = null, properties = null) {
    this.fluids = fluids;         // Array, Set ou HolderSet de fluídos/IDs
    this.properties = properties; // Instância de StatePropertiesPredicate
  }

  matches(level, pos) {
    if (!level) return false;

    // 1. Verifica se a posição está carregada (se o método existir)
    if (typeof level.isLoaded === 'function' && !level.isLoaded(pos)) {
      return false;
    }

    // 2. Obtém o estado do fluido na posição
    const state = typeof level.getFluidState === 'function' ? level.getFluidState(pos) : null;
    if (!state) return false;

    // 3. Valida se o fluido está na lista permitida
    if (this.fluids) {
      const fluidList = Array.isArray(this.fluids) ? this.fluids : Array.from(this.fluids);
      const isMatch = typeof state.is === 'function'
        ? fluidList.some(f => state.is(f))
        : fluidList.includes(state.fluid || state);

      if (!isMatch) {
        return false;
      }
    }

    // 4. Valida as propriedades do estado do fluido
    if (this.properties && typeof this.properties.matches === 'function') {
      if (!this.properties.matches(state)) {
        return false;
      }
    }

    return true;
  }
}

class FluidPredicateBuilder {
  constructor() {
    this.fluidsVal = null;
    this.propertiesVal = null;
  }

  static fluid() {
    return new FluidPredicateBuilder();
  }

  of(fluid) {
    const list = Array.isArray(fluid) ? fluid : [fluid];
    this.fluidsVal = list;
    return this;
  }

  setProperties(properties) {
    this.propertiesVal = typeof properties?.build === 'function'
      ? properties.build()
      : properties;
    return this;
  }

  build() {
    return new FluidPredicate(this.fluidsVal, this.propertiesVal);
  }
}

window.FluidPredicate = FluidPredicate;
window.FluidPredicateBuilder = FluidPredicateBuilder;
