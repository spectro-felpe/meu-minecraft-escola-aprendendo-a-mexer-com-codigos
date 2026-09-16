class CollectionPredicate {
  constructor(contains = null, counts = null, size = null) {
    this.contains = contains; // Instância de CollectionContentsPredicate
    this.counts = counts;     // Instância de CollectionCountsPredicate
    this.size = size;         // Instância de MinMaxBounds.Ints
  }

  test(iterable = []) {
    if (!iterable) return false;

    const values = Array.isArray(iterable) ? iterable : Array.from(iterable);

    // 1. Validação de conteúdo (contains)
    if (this.contains) {
      if (typeof this.contains.test === 'function' && !this.contains.test(values)) {
        return false;
      }
      if (typeof this.contains.matches === 'function' && !this.contains.matches(values)) {
        return false;
      }
    }

    // 2. Validação de contagem de elementos (counts)
    if (this.counts) {
      if (typeof this.counts.test === 'function' && !this.counts.test(values)) {
        return false;
      }
      if (typeof this.counts.matches === 'function' && !this.counts.matches(values)) {
        return false;
      }
    }

    // 3. Validação do tamanho total da coleção (size)
    if (this.size && typeof this.size.matches === 'function') {
      if (!this.size.matches(values.length)) {
        return false;
      }
    }

    return true;
  }
}

window.CollectionPredicate = CollectionPredicate;
