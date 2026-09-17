class ItemPredicate {
  constructor(items = null, count = null, components = null) {
    this.items = items;           // Array, Set ou HolderSet de itens/IDs
    this.count = count;           // Instância de MinMaxBounds.Ints
    this.components = components || (window.DataComponentMatchers?.ANY || null); // Instância de DataComponentMatchers
  }

  test(itemStack) {
    if (!itemStack) return false;

    // 1. Validação da lista de itens permitidos
    if (this.items) {
      const itemList = Array.isArray(this.items) ? this.items : Array.from(this.items);
      const isMatch = typeof itemStack.is === 'function'
        ? itemList.some(i => itemStack.is(i))
        : itemList.includes(itemStack.item || itemStack.id || itemStack);

      if (!isMatch) {
        return false;
      }
    }

    // 2. Validação da quantidade (count)
    const countVal = typeof itemStack.count === 'function' ? itemStack.count() : (itemStack.count || 1);
    if (this.count && typeof this.count.matches === 'function') {
      if (!this.count.matches(countVal)) {
        return false;
      }
    }

    // 3. Validação dos componentes
    if (this.components) {
      if (typeof this.components.test === 'function' && !this.components.test(itemStack)) {
        return false;
      }
    }

    return true;
  }

  matches(itemStack) {
    return this.test(itemStack);
  }
}

class ItemPredicateBuilder {
  constructor() {
    this.itemsVal = null;
    this.countVal = null;
    this.componentsVal = window.DataComponentMatchers?.ANY || null;
  }

  static item() {
    return new ItemPredicateBuilder();
  }

  of(lookup, ...items) {
    const list = Array.isArray(items[0]) ? items[0] : items;
    this.itemsVal = list;
    return this;
  }

  withCount(count) {
    this.countVal = count;
    return this;
  }

  withComponents(components) {
    this.componentsVal = components;
    return this;
  }

  build() {
    return new ItemPredicate(this.itemsVal, this.countVal, this.componentsVal);
  }
}

window.ItemPredicate = ItemPredicate;
window.ItemPredicateBuilder = ItemPredicateBuilder;
