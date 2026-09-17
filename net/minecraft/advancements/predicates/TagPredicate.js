class TagPredicate {
  constructor(tag, expected = true) {
    this.tag = tag; // Instância de HolderSet ou Array de Holders
    this.expected = expected;
  }

  static is(tag) {
    return new TagPredicate(tag, true);
  }

  static isNot(tag) {
    return new TagPredicate(tag, false);
  }

  matches(holder) {
    if (!this.tag || !holder) return !this.expected;

    let contains = false;

    if (typeof this.tag.contains === 'function') {
      contains = this.tag.contains(holder);
    } else if (Array.isArray(this.tag)) {
      contains = this.tag.includes(holder);
    } else if (this.tag instanceof Set) {
      contains = this.tag.has(holder);
    }

    return contains === this.expected;
  }
}

window.TagPredicate = TagPredicate;
