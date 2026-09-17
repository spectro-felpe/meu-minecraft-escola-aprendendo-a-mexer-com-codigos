class NbtPredicate {
  constructor(tag = null) {
    this.tag = tag; // Instância de CompoundTag / NBT
  }

  matches(target) {
    if (!this.tag) return true;
    if (!target) return false;

    // 1. Se for uma entidade ou objeto com método de tag
    if (typeof target.saveWithoutId === 'function' || target.registryAccess) {
      const entityTag = NbtPredicate.getEntityTagToCompare(target);
      return this.matchesTag(entityTag);
    }

    // 2. Se for um componente de dados (DataComponentGetter)
    if (typeof target.getOrDefault === 'function') {
      const customData = target.getOrDefault('custom_data', null);
      if (customData && typeof customData.matchedBy === 'function') {
        return customData.matchedBy(this.tag);
      }
    }

    // 3. Se for uma tag NBT direta
    return this.matchesTag(target);
  }

  matchesTag(tag) {
    if (!tag) return false;
    
    // Utiliza a classe utilitária NbtUtils se disponível
    if (window.NbtUtils && typeof window.NbtUtils.compareNbt === 'function') {
      return window.NbtUtils.compareNbt(this.tag, tag, true);
    }

    // Fallback para verificação básica de propriedades
    return this._deepCompare(this.tag, tag);
  }

  _deepCompare(expected, actual) {
    if (expected === actual) return true;
    if (typeof expected !== 'object' || typeof actual !== 'object' || !expected || !actual) {
      return expected == actual;
    }

    for (const key of Object.keys(expected)) {
      if (!(key in actual)) return false;
      if (!this._deepCompare(expected[key], actual[key])) return false;
    }

    return true;
  }

  static getEntityTagToCompare(entity) {
    if (!entity) return {};

    let tag = {};
    if (typeof entity.saveWithoutId === 'function') {
      tag = entity.saveWithoutId({}) || {};
    } else if (entity.nbt) {
      tag = { ...entity.nbt };
    }

    // Se for jogador, adiciona o item selecionado
    if (entity.isPlayer || typeof entity.getInventory === 'function') {
      const inventory = typeof entity.getInventory === 'function' ? entity.getInventory() : entity.inventory;
      if (inventory) {
        const selected = typeof inventory.getSelectedItem === 'function' ? inventory.getSelectedItem() : inventory.selectedItem;
        if (selected && !selected.isEmpty?.()) {
          tag.SelectedItem = selected;
        }
      }
    }

    return tag;
  }
}

NbtPredicate.SELECTED_ITEM_TAG = "SelectedItem";

window.NbtPredicate = NbtPredicate;
