class EntityExactDataComponentsPredicate {
  constructor(predicate = null) {
    this.predicate = predicate;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    // Se houver um predicado de componentes, executa o teste na entidade
    if (this.predicate && typeof this.predicate.test === 'function') {
      return this.predicate.test(entity);
    }

    return true;
  }
}

window.EntityExactDataComponentsPredicate = EntityExactDataComponentsPredicate;
