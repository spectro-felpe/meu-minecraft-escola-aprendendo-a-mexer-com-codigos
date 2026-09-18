class AdvancementNode {
  constructor(holder, parent = null) {
    this._holder = holder;
    this._parent = parent;
    this._children = new Set();
    this._x = 0;
    this._y = 0;
  }

  advancement() {
    return this._holder ? this._holder.value : null;
  }

  holder() {
    return this._holder;
  }

  isTask() {
    return this._parent !== null;
  }

  isRoot() {
    return this._parent === null;
  }

  parent() {
    return this._parent;
  }

  root() {
    return AdvancementNode.getRoot(this);
  }

  static getRoot(advancement) {
    let root = advancement;

    while (root) {
      const parent = root.parent();
      if (!parent) {
        return root;
      }
      root = parent;
    }

    return root;
  }

  children() {
    return this._children;
  }

  addChild(child) {
    this._children.add(child);
  }

  setLocation(x, y) {
    this._x = x;
    this._y = y;
  }

  x() {
    return this._x;
  }

  y() {
    return this._y;
  }

  equals(obj) {
    if (this === obj) return true;
    if (!obj || !(obj instanceof AdvancementNode)) return false;

    if (this._holder && typeof this._holder.equals === 'function') {
      return this._holder.equals(obj._holder);
    }

    return this._holder === obj._holder;
  }

  hashCode() {
    if (this._holder && typeof this._holder.hashCode === 'function') {
      return this._holder.hashCode();
    }
    return 0;
  }

  toString() {
    return this._holder ? String(this._holder.id || this._holder) : '';
  }
}

window.AdvancementNode = AdvancementNode;
