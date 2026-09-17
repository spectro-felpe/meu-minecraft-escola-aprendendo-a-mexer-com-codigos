class SingleComponentItemPredicate {
  constructor(componentType, matchesCallback) {
    this._componentType = componentType;
    if (typeof matchesCallback === 'function') {
      this.matchesValue = matchesCallback;
    }
  }

  componentType() {
    return this._componentType;
  }

  matchesValue(value) {
    return false;
  }

  matches(components) {
    if (!components) return false;

    const type = this.componentType();
    let value = null;

    if (typeof components.get === 'function') {
      value = components.get(type);
    } else if (typeof components === 'object') {
      value = components[type];
    }

    return value !== null && value !== undefined && this.matchesValue(value);
  }
}

window.SingleComponentItemPredicate = SingleComponentItemPredicate;
