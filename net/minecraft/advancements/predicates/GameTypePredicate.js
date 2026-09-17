class GameTypePredicate {
  constructor(types = []) {
    this.types = Array.isArray(types) ? types : [types];
  }

  static of(...types) {
    const list = Array.isArray(types[0]) ? types[0] : types;
    return new GameTypePredicate(list);
  }

  matches(type) {
    if (!type) return false;

    // Trata se o tipo for uma string ou um objeto com a propriedade name/id
    const typeName = typeof type === 'string' ? type : (type.name || type.id || type);

    return this.types.some(t => {
      const tName = typeof t === 'string' ? t : (t.name || t.id || t);
      return tName === typeName;
    });
  }
}

GameTypePredicate.ANY = GameTypePredicate.of(['survival', 'creative', 'adventure', 'spectator']);
GameTypePredicate.SURVIVAL_LIKE = GameTypePredicate.of(['survival', 'adventure']);

window.GameTypePredicate = GameTypePredicate;
