class AdvancementHolder {
  constructor(id, value) {
    this.id = id;
    this.value = value;
  }

  register(output) {
    if (output && typeof output.register === 'function') {
      output.register(this.id, this.value);
    }
  }

  equals(obj) {
    if (this === obj) return true;
    if (!obj || !(obj instanceof AdvancementHolder)) return false;
    
    const otherId = obj.id?.toString ? obj.id.toString() : obj.id;
    const thisId = this.id?.toString ? this.id.toString() : this.id;
    
    return thisId === otherId;
  }

  hashCode() {
    const str = this.id ? String(this.id) : '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  toString() {
    return this.id ? String(this.id) : '';
  }
}

window.AdvancementHolder = AdvancementHolder;
