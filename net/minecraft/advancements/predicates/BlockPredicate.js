class BlockPredicate {
  constructor(blocks = null, properties = null, nbt = null, components = null) {
    this.blocks = blocks;         // Array, Set ou HolderSet de blocos/IDs
    this.properties = properties; // Instância de StatePropertiesPredicate
    this.nbt = nbt;               // Instância de NbtPredicate
    this.components = components || (window.DataComponentMatchers?.ANY || null); // Instância de DataComponentMatchers
  }

  matches(level, pos) {
    if (!level) return false;

    // 1. Verifica se a posição está carregada (se o método existir)
    if (typeof level.isLoaded === 'function' && !level.isLoaded(pos)) {
      return false;
    }

    // 2. Obtém e valida o estado do bloco
    const state = typeof level.getBlockState === 'function' ? level.getBlockState(pos) : null;
    if (!this.matchesState(state)) {
      return false;
    }

    // 3. Valida a BlockEntity se for necessário
    if (this.willMatchBlockEntity()) {
      const blockEntity = typeof level.getBlockEntity === 'function' ? level.getBlockEntity(pos) : null;
      if (!this.matchesBlockEntity(level, blockEntity)) {
        return false;
      }
    }

    return true;
  }

  willMatchBlockEntity() {
    const hasNbt = this.nbt !== null && this.nbt !== undefined;
    const hasComponents = this.components && typeof this.components.isEmpty === 'function' 
      ? !this.components.isEmpty() 
      : !!this.components;

    return hasNbt || hasComponents;
  }

  matchesInWorld(blockInWorld) {
    if (!blockInWorld) return false;

    const state = typeof blockInWorld.getState === 'function' ? blockInWorld.getState() : blockInWorld.state;
    if (!this.matchesState(state)) {
      return false;
    }

    if (this.nbt) {
      const level = typeof blockInWorld.getLevel === 'function' ? blockInWorld.getLevel() : blockInWorld.level;
      const entity = typeof blockInWorld.getEntity === 'function' ? blockInWorld.getEntity() : blockInWorld.entity;
      return BlockPredicate._matchesBlockEntityData(level, entity, this.nbt);
    }

    return true;
  }

  matchesState(state) {
    if (!state) return false;

    // Validação da lista de blocos permitidos
    if (this.blocks) {
      const blockList = Array.isArray(this.blocks) ? this.blocks : Array.from(this.blocks);
      const isMatch = typeof state.is === 'function'
        ? blockList.some(b => state.is(b))
        : blockList.includes(state.block || state);

      if (!isMatch) {
        return false;
      }
    }

    // Validação das propriedades do estado
    if (this.properties && typeof this.properties.matches === 'function') {
      if (!this.properties.matches(state)) {
        return false;
      }
    }

    return true;
  }

  matchesBlockEntity(level, blockEntity) {
    if (this.nbt && !BlockPredicate._matchesBlockEntityData(level, blockEntity, this.nbt)) {
      return false;
    }

    if (this.components && typeof this.components.isEmpty === 'function' && !this.components.isEmpty()) {
      return BlockPredicate._matchesComponents(blockEntity, this.components);
    }

    return true;
  }

  static _matchesBlockEntityData(level, entity, nbt) {
    if (!entity) return false;

    const tag = typeof entity.saveWithFullMetadata === 'function'
      ? entity.saveWithFullMetadata(level?.registryAccess?.())
      : (entity.nbt || entity);

    return nbt && typeof nbt.matches === 'function' ? nbt.matches(tag) : false;
  }

  static _matchesComponents(entity, components) {
    if (!entity) return false;

    const collected = typeof entity.collectComponents === 'function'
      ? entity.collectComponents()
      : entity.components;

    return components && (typeof components.test === 'function' ? components.test(collected) : components.matches?.(collected));
  }

  requiresNbt() {
    return this.nbt !== null && this.nbt !== undefined;
  }
}

class BlockPredicateBuilder {
  constructor() {
    this.blocksVal = null;
    this.propertiesVal = null;
    this.nbtVal = null;
    this.componentsVal = window.DataComponentMatchers?.ANY || null;
  }

  static block() {
    return new BlockPredicateBuilder();
  }

  of(lookup, ...blocks) {
    const list = Array.isArray(blocks[0]) ? blocks[0] : blocks;
    this.blocksVal = list;
    return this;
  }

  hasNbt(nbt) {
    this.nbtVal = window.NbtPredicate ? new window.NbtPredicate(nbt) : nbt;
    return this;
  }

  setProperties(propertiesBuilder) {
    this.propertiesVal = typeof propertiesBuilder?.build === 'function'
      ? propertiesBuilder.build()
      : propertiesBuilder;
    return this;
  }

  components(components) {
    this.componentsVal = components;
    return this;
  }

  build() {
    return new BlockPredicate(
      this.blocksVal,
      this.propertiesVal,
      this.nbtVal,
      this.componentsVal
    );
  }
}

window.BlockPredicate = BlockPredicate;
window.BlockPredicateBuilder = BlockPredicateBuilder;
