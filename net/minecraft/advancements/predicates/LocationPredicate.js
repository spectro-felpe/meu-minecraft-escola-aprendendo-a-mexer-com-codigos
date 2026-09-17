class PositionPredicate {
  constructor(x = null, y = null, z = null) {
    this.x = x; // Instância de MinMaxBounds.Doubles
    this.y = y; // Instância de MinMaxBounds.Doubles
    this.z = z; // Instância de MinMaxBounds.Doubles
  }

  static of(x, y, z) {
    const isXAny = !x || (typeof x.isAny === 'function' ? x.isAny() : false);
    const isYAny = !y || (typeof y.isAny === 'function' ? y.isAny() : false);
    const isZAny = !z || (typeof z.isAny === 'function' ? z.isAny() : false);

    if (isXAny && isYAny && isZAny) {
      return null;
    }
    return new PositionPredicate(x, y, z);
  }

  matches(x, y, z) {
    if (this.x && typeof this.x.matches === 'function' && !this.x.matches(x)) return false;
    if (this.y && typeof this.y.matches === 'function' && !this.y.matches(y)) return false;
    if (this.z && typeof this.z.matches === 'function' && !this.z.matches(z)) return false;
    return true;
  }
}

class LocationPredicate {
  constructor(options = {}) {
    this.position = options.position || null;
    this.biomes = options.biomes || null;
    this.structures = options.structures || null;
    this.dimension = options.dimension || null;
    this.smokey = options.smokey ?? null;
    this.light = options.light || null;
    this.block = options.block || null;
    this.fluid = options.fluid || null;
    this.canSeeSky = options.canSeeSky ?? null;
  }

  matches(level, x, y, z) {
    if (!level) return false;

    // 1. Posição (X, Y, Z)
    if (this.position && !this.position.matches(x, y, z)) {
      return false;
    }

    // 2. Dimensão
    if (this.dimension) {
      const levelDim = typeof level.dimension === 'function' ? level.dimension() : level.dimension;
      if (levelDim !== this.dimension) {
        return false;
      }
    }

    const pos = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
    const loaded = typeof level.isLoaded === 'function' ? level.isLoaded(pos) : true;

    // 3. Bioma
    if (this.biomes) {
      if (!loaded) return false;
      const currentBiome = typeof level.getBiome === 'function' ? level.getBiome(pos) : null;
      const biomeList = Array.isArray(this.biomes) ? this.biomes : Array.from(this.biomes);
      const biomeMatch = biomeList.some(b => b === currentBiome || b?.id === currentBiome?.id);
      if (!biomeMatch) return false;
    }

    // 4. Estrutura
    if (this.structures) {
      if (!loaded) return false;
      const structMgr = typeof level.structureManager === 'function' ? level.structureManager() : level.structureManager;
      if (structMgr && typeof structMgr.getStructureWithPieceAt === 'function') {
        const result = structMgr.getStructureWithPieceAt(pos, this.structures);
        if (!result || (typeof result.isValid === 'function' && !result.isValid())) {
          return false;
        }
      }
    }

    // 5. Fumegante (Campfire/Smokey)
    if (this.smokey !== null) {
      if (!loaded) return false;
      const isSmokey = window.CampfireBlock?.isSmokeyPos ? window.CampfireBlock.isSmokeyPos(level, pos) : false;
      if (this.smokey !== isSmokey) return false;
    }

    // 6. Luz
    if (this.light && typeof this.light.matches === 'function') {
      if (!this.light.matches(level, pos)) return false;
    }

    // 7. Bloco
    if (this.block && typeof this.block.matches === 'function') {
      if (!this.block.matches(level, pos)) return false;
    }

    // 8. Fluido
    if (this.fluid && typeof this.fluid.matches === 'function') {
      if (!this.fluid.matches(level, pos)) return false;
    }

    // 9. Visibilidade do céu
    if (this.canSeeSky !== null) {
      const canSee = typeof level.canSeeSky === 'function' ? level.canSeeSky(pos) : false;
      if (this.canSeeSky !== canSee) return false;
    }

    return true;
  }
}

class LocationPredicateBuilder {
  constructor() {
    this.xVal = null;
    this.yVal = null;
    this.zVal = null;
    this.biomesVal = null;
    this.structuresVal = null;
    this.dimensionVal = null;
    this.smokeyVal = null;
    this.lightVal = null;
    this.blockVal = null;
    this.fluidVal = null;
    this.canSeeSkyVal = null;
  }

  static location() {
    return new LocationPredicateBuilder();
  }

  static inBiome(biome) {
    return LocationPredicateBuilder.location().setBiomes([biome]);
  }

  static inDimension(dimension) {
    return LocationPredicateBuilder.location().setDimension(dimension);
  }

  static inStructure(structure) {
    return LocationPredicateBuilder.location().setStructures([structure]);
  }

  static atYLocation(yLocation) {
    return LocationPredicateBuilder.location().setY(yLocation);
  }

  setX(x) { this.xVal = x; return this; }
  setY(y) { this.yVal = y; return this; }
  setZ(z) { this.zVal = z; return this; }

  setBiomes(biomes) {
    this.biomesVal = Array.isArray(biomes) ? biomes : [biomes];
    return this;
  }

  setStructures(structures) {
    this.structuresVal = Array.isArray(structures) ? structures : [structures];
    return this;
  }

  setDimension(dimension) {
    this.dimensionVal = dimension;
    return this;
  }

  setLight(lightBuilder) {
    this.lightVal = typeof lightBuilder?.build === 'function' ? lightBuilder.build() : lightBuilder;
    return this;
  }

  setBlock(blockBuilder) {
    this.blockVal = typeof blockBuilder?.build === 'function' ? blockBuilder.build() : blockBuilder;
    return this;
  }

  setFluid(fluidBuilder) {
    this.fluidVal = typeof fluidBuilder?.build === 'function' ? fluidBuilder.build() : fluidBuilder;
    return this;
  }

  setSmokey(smokey) {
    this.smokeyVal = smokey;
    return this;
  }

  setCanSeeSky(canSeeSky) {
    this.canSeeSkyVal = canSeeSky;
    return this;
  }

  build() {
    const posPredicate = PositionPredicate.of(this.xVal, this.yVal, this.zVal);
    return new LocationPredicate({
      position: posPredicate,
      biomes: this.biomesVal,
      structures: this.structuresVal,
      dimension: this.dimensionVal,
      smokey: this.smokeyVal,
      light: this.lightVal,
      block: this.blockVal,
      fluid: this.fluidVal,
      canSeeSky: this.canSeeSkyVal
    });
  }
}

LocationPredicate.PositionPredicate = PositionPredicate;
LocationPredicate.Builder = LocationPredicateBuilder;

window.LocationPredicate = LocationPredicate;
window.LocationPredicateBuilder = LocationPredicateBuilder;
