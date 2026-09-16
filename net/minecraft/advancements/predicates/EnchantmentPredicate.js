class EnchantmentPredicate {
  constructor(enchantments = null, level = null) {
    this.enchantments = enchantments; // Array/Set de encantamentos ou null
    this.level = level; // Instância de MinMaxBounds.Ints ou null
  }

  containedIn(itemEnchantments) {
    if (!itemEnchantments) return false;

    // 1. Se houver um grupo específico de encantamentos definido
    if (this.enchantments !== null && this.enchantments !== undefined) {
      const enchantList = Array.isArray(this.enchantments)
        ? this.enchantments
        : (this.enchantments.values ? Array.from(this.enchantments.values()) : [this.enchantments]);

      for (const enchantment of enchantList) {
        if (this._matchesEnchantment(itemEnchantments, enchantment)) {
          return true;
        }
      }

      return false;
    } 
    // 2. Se apenas o nível (level) foi especificado
    else if (this.level && typeof this.level.matches === 'function' && !this.level.isAny?.()) {
      const entries = typeof itemEnchantments.entrySet === 'function'
        ? itemEnchantments.entrySet()
        : Object.entries(itemEnchantments);

      for (const entry of entries) {
        const lvl = typeof entry.getIntValue === 'function' 
          ? entry.getIntValue() 
          : (Array.isArray(entry) ? entry[1] : entry.level);

        if (this.level.matches(lvl)) {
          return true;
        }
      }

      return false;
    } 
    // 3. Se nenhum filtro específico foi definido, valida se não está vazio
    else {
      const isEmpty = typeof itemEnchantments.isEmpty === 'function'
        ? itemEnchantments.isEmpty()
        : Object.keys(itemEnchantments).length === 0;

      return !isEmpty;
    }
  }

  _matchesEnchantment(itemEnchantments, enchantment) {
    const level = typeof itemEnchantments.getLevel === 'function'
      ? itemEnchantments.getLevel(enchantment)
      : (itemEnchantments[enchantment] || 0);

    if (level === 0) {
      return false;
    }

    if (!this.level || typeof this.level.matches !== 'function' || this.level.isAny?.()) {
      return true;
    }

    return this.level.matches(level);
  }
}

window.EnchantmentPredicate = EnchantmentPredicate;
