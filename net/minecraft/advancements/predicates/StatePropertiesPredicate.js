class ExactMatcher {
  constructor(value) {
    this.value = String(value);
  }

  match(state, property) {
    if (!state || !property) return false;

    const actualValue = typeof state.getValue === 'function' ? state.getValue(property) : state[property.name];
    if (actualValue === undefined || actualValue === null) return false;

    if (typeof property.getValue === 'function') {
      const typedExpected = property.getValue(this.value);
      return typedExpected !== null && typedExpected !== undefined && actualValue === typedExpected;
    }

    return String(actualValue) === this.value;
  }
}

class RangedMatcher {
  constructor(minValue = null, maxValue = null) {
    this.minValue = minValue !== null ? String(minValue) : null;
    this.maxValue = maxValue !== null ? String(maxValue) : null;
  }

  match(state, property) {
    if (!state || !property) return false;

    const value = typeof state.getValue === 'function' ? state.getValue(property) : state[property.name];
    if (value === undefined || value === null) return false;

    if (this.minValue !== null) {
      const typedMin = typeof property.getValue === 'function' ? property.getValue(this.minValue) : this.minValue;
      if (typedMin === null || typedMin === undefined || value < typedMin) {
        return false;
      }
    }

    if (this.maxValue !== null) {
      const typedMax = typeof property.getValue === 'function' ? property.getValue(this.maxValue) : this.maxValue;
      if (typedMax === null || typedMax === undefined || value > typedMax) {
        return false;
      }
    }

    return true;
  }
}

class PropertyMatcher {
  constructor(name, valueMatcher) {
    this.name = name;
    this.valueMatcher = valueMatcher;
  }

  match(definition, state) {
    let property = null;
    if (definition && typeof definition.getProperty === 'function') {
      property = definition.getProperty(this.name);
    } else if (definition?.properties) {
      property = definition.properties[this.name];
    } else {
      property = { name: this.name };
    }

    if (!property) return false;
    return this.valueMatcher.match(state, property);
  }

  checkState(states) {
    let property = null;
    if (states && typeof states.getProperty === 'function') {
      property = states.getProperty(this.name);
    } else if (states?.properties) {
      property = states.properties[this.name];
    }

    return property ? null : this.name;
  }
}

class StatePropertiesPredicate {
  constructor(properties = []) {
    this.properties = properties;
  }

  matches(definitionOrState, state) {
    if (state !== undefined) {
      return this._matchesWithDefinition(definitionOrState, state);
    }

    const targetState = definitionOrState;
    if (!targetState) return false;

    let definition = null;
    if (targetState.getBlock && typeof targetState.getBlock === 'function') {
      definition = targetState.getBlock().getStateDefinition?.();
    } else if (targetState.getType && typeof targetState.getType === 'function') {
      definition = targetState.getType().getStateDefinition?.();
    } else {
      definition = targetState.stateDefinition || targetState.definition;
    }

    return this._matchesWithDefinition(definition, targetState);
  }

  _matchesWithDefinition(definition, state) {
    for (const matcher of this.properties) {
      if (!matcher.match(definition, state)) {
        return false;
      }
    }
    return true;
  }

  checkState(states) {
    for (const property of this.properties) {
      const unknown = property.checkState(states);
      if (unknown !== null) {
        return unknown;
      }
    }
    return null;
  }
}

class StatePropertiesPredicateBuilder {
  constructor() {
    this.matchers = [];
  }

  static properties() {
    return new StatePropertiesPredicateBuilder();
  }

  hasProperty(property, value) {
    const propName = typeof property === 'string' ? property : (property.getName?.() || property.name);
    const strVal = typeof value === 'object' && value?.getSerializedName ? value.getSerializedName() : String(value);
    
    this.matchers.push(new PropertyMatcher(propName, new ExactMatcher(strVal)));
    return this;
  }

  build() {
    return new StatePropertiesPredicate(this.matchers);
  }
}

StatePropertiesPredicate.ExactMatcher = ExactMatcher;
StatePropertiesPredicate.RangedMatcher = RangedMatcher;
StatePropertiesPredicate.PropertyMatcher = PropertyMatcher;
StatePropertiesPredicate.Builder = StatePropertiesPredicateBuilder;

window.StatePropertiesPredicate = StatePropertiesPredicate;
window.StatePropertiesPredicateBuilder = StatePropertiesPredicateBuilder;
