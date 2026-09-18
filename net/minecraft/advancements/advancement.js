class Advancement {
  constructor(parent = null, display = null, rewards = null, criteria = {}, requirements = null, sendsTelemetryEvent = false, name = null) {
    this.parent = parent ? (parent.id || parent) : null;
    this.display = display || null;
    this.rewards = rewards || window.AdvancementRewards?.EMPTY || null;
    this.criteria = criteria instanceof Map ? criteria : new Map(Object.entries(criteria || {}));
    this.requirements = requirements || null;
    this.sendsTelemetryEvent = Boolean(sendsTelemetryEvent);
    this.name = name || (display ? Advancement.decorateName(display) : null);
  }

  static decorateName(display) {
    if (!display || !display.title) return null;
    const title = display.title;
    const description = display.description || '';
    return `[${title}] - ${description}`;
  }

  static name(holder) {
    if (!holder) return '';
    if (holder.value && typeof holder.value.name === 'function') {
      return holder.value.name() || String(holder.id);
    }
    return holder.value?.name || String(holder.id || '');
  }

  isRoot() {
    return !this.parent;
  }

  validate(reporter, lootData) {
    for (const [name, criterion] of this.criteria.entries()) {
      if (criterion && criterion.triggerInstance && typeof criterion.triggerInstance.validate === 'function') {
        criterion.triggerInstance.validate({ reporter, lootData, name });
      }
    }
  }
}

class AdvancementBuilder {
  constructor() {
    this._parent = null;
    this._display = null;
    this._rewards = window.AdvancementRewards?.EMPTY || null;
    this._criteria = new Map();
    this._requirements = null;
    this._requirementsStrategy = 'AND';
    this._sendsTelemetryEvent = false;
  }

  static advancement() {
    return new AdvancementBuilder().sendsTelemetryEvent();
  }

  static recipeAdvancement() {
    return new AdvancementBuilder();
  }

  parent(parent) {
    this._parent = parent?.id || parent;
    return this;
  }

  rootDisplay(icon, title, description, background, frame, showToast, announceChat, hidden) {
    const displayInfo = {
      icon,
      title,
      description,
      background,
      frame,
      showToast,
      announceChat,
      hidden
    };
    return this.display(displayInfo);
  }

  display(iconOrDisplay, title, description, frame, showToast, announceChat, hidden) {
    if (typeof iconOrDisplay === 'object' && iconOrDisplay.title) {
      this._display = iconOrDisplay;
    } else {
      this._display = {
        icon: iconOrDisplay,
        title,
        description,
        background: null,
        frame,
        showToast,
        announceChat,
        hidden
      };
    }
    return this;
  }

  rewards(rewards) {
    if (rewards && typeof rewards.build === 'function') {
      this._rewards = rewards.build();
    } else {
      this._rewards = rewards;
    }
    return this;
  }

  addCriterion(name, criterion) {
    this._criteria.set(name, criterion);
    return this;
  }

  requirements(strategyOrRequirements) {
    if (typeof strategyOrRequirements === 'string') {
      this._requirementsStrategy = strategyOrRequirements;
    } else {
      this._requirements = strategyOrRequirements;
    }
    return this;
  }

  sendsTelemetryEvent() {
    this._sendsTelemetryEvent = true;
    return this;
  }

  build(id) {
    let requirements = this._requirements;
    if (!requirements) {
      const keys = Array.from(this._criteria.keys());
      if (this._requirementsStrategy === 'OR') {
        requirements = [keys];
      } else {
        requirements = keys.map(k => [k]);
      }
    }

    const advancement = new Advancement(
      this._parent,
      this._display,
      this._rewards,
      this._criteria,
      requirements,
      this._sendsTelemetryEvent
    );

    return {
      id,
      value: advancement
    };
  }

  save(output, name) {
    const holder = this.build(name);
    if (output && typeof output.register === 'function') {
      output.register(holder);
    }
    return holder;
  }
}

Advancement.Builder = AdvancementBuilder;

window.Advancement = Advancement;
window.AdvancementBuilder = AdvancementBuilder;
