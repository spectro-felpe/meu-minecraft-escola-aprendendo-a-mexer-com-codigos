class PlayerPredicate {
  constructor(options = {}) {
    this.level = options.level || null;
    this.food = options.food || null;
    this.gameType = options.gameType || null;
    this.stats = options.stats || [];
    this.recipes = options.recipes || new Map();
    this.advancements = options.advancements || new Map();
    this.lookingAt = options.lookingAt || null;
    this.input = options.input || null;
  }

  static LOOKING_AT_RANGE = 100;

  matches(entity, level = null, position = null) {
    if (!entity || !entity.isPlayer) {
      return false;
    }

    // 1. Nível de Experiência
    if (this.level && typeof this.level.matches === 'function') {
      const expLevel = entity.experienceLevel ?? entity.level ?? 0;
      if (!this.level.matches(expLevel)) {
        return false;
      }
    }

    // 2. Comida / Fome
    if (this.food && typeof this.food.matches === 'function') {
      const foodData = typeof entity.getFoodData === 'function' ? entity.getFoodData() : entity.foodData;
      if (!this.food.matches(foodData)) {
        return false;
      }
    }

    // 3. Modo de Jogo (GameMode)
    if (this.gameType && typeof this.gameType.matches === 'function') {
      const gameMode = typeof entity.gameMode === 'function' ? entity.gameMode() : entity.gameMode;
      if (!this.gameType.matches(gameMode)) {
        return false;
      }
    }

    // 4. Estatísticas
    if (this.stats && this.stats.length > 0) {
      const statsCounter = typeof entity.getStats === 'function' ? entity.getStats() : entity.stats;
      for (const stat of this.stats) {
        if (stat && typeof stat.matches === 'function') {
          if (!stat.matches(statsCounter)) {
            return false;
          }
        }
      }
    }

    // 5. Receitas
    if (this.recipes && this.recipes.size > 0) {
      const recipeBook = typeof entity.getRecipeBook === 'function' ? entity.getRecipeBook() : entity.recipeBook;
      for (const [recipeKey, requiredState] of this.recipes.entries()) {
        const contains = recipeBook && typeof recipeBook.contains === 'function' 
          ? recipeBook.contains(recipeKey) 
          : false;

        if (contains !== requiredState) {
          return false;
        }
      }
    }

    // 6. Conquistas (Advancements)
    if (this.advancements && this.advancements.size > 0) {
      const advancements = typeof entity.getAdvancements === 'function' ? entity.getAdvancements() : entity.advancements;
      for (const [id, predicate] of this.advancements.entries()) {
        const progress = advancements && typeof advancements.getOrStartProgress === 'function'
          ? advancements.getOrStartProgress(id)
          : null;

        if (!progress || (predicate && typeof predicate.test === 'function' && !predicate.test(progress))) {
          return false;
        }
      }
    }

    // 7. Entidade Olhada (Looking At)
    if (this.lookingAt && typeof this.lookingAt.matches === 'function') {
      const lookingAtEntity = typeof entity.getTargetedEntity === 'function'
        ? entity.getTargetedEntity(PlayerPredicate.LOOKING_AT_RANGE)
        : entity.lookingAtEntity;

      if (!lookingAtEntity || !this.lookingAt.matches(entity, lookingAtEntity)) {
        return false;
      }
    }

    // 8. Entradas de Controle (Input)
    if (this.input && typeof this.input.matches === 'function') {
      const lastInput = typeof entity.getLastClientInput === 'function' 
        ? entity.getLastClientInput() 
        : entity.lastClientInput;

      if (!this.input.matches(lastInput)) {
        return false;
      }
    }

    return true;
  }
}

class PlayerPredicateBuilder {
  constructor() {
    this.options = {
      stats: [],
      recipes: new Map(),
      advancements: new Map(),
      lookingAt: null,
      input: null
    };
  }

  static player() {
    return new PlayerPredicateBuilder();
  }

  setLevel(level) {
    this.options.level = level;
    return this;
  }

  setFood(food) {
    this.options.food = food;
    return this;
  }

  setGameType(gameType) {
    this.options.gameType = gameType;
    return this;
  }

  addStat(type, value, range) {
    this.options.stats.push({
      type,
      value,
      range,
      matches: (counter) => {
        const val = counter && typeof counter.getValue === 'function' ? counter.getValue(type, value) : 0;
        return range && typeof range.matches === 'function' ? range.matches(val) : true;
      }
    });
    return this;
  }

  addRecipe(recipe, present) {
    this.options.recipes.set(recipe, present);
    return this;
  }

  setLookingAt(lookingAtBuilder) {
    this.options.lookingAt = typeof lookingAtBuilder?.build === 'function' 
      ? lookingAtBuilder.build() 
      : lookingAtBuilder;
    return this;
  }

  checkAdvancementDone(advancement, isDone) {
    this.options.advancements.set(advancement, {
      test: (progress) => progress && typeof progress.isDone === 'function' ? progress.isDone() === isDone : false
    });
    return this;
  }

  checkAdvancementCriterions(advancement, criterions) {
    this.options.advancements.set(advancement, {
      test: (progress) => {
        if (!progress) return false;
        for (const [criterion, expected] of Object.entries(criterions)) {
          const critProgress = typeof progress.getCriterion === 'function' ? progress.getCriterion(criterion) : null;
          const done = critProgress && typeof critProgress.isDone === 'function' ? critProgress.isDone() : false;
          if (done !== expected) return false;
        }
        return true;
      }
    });
    return this;
  }

  hasInput(input) {
    this.options.input = input;
    return this;
  }

  build() {
    return new PlayerPredicate(this.options);
  }
}

window.PlayerPredicate = PlayerPredicate;
window.PlayerPredicateBuilder = PlayerPredicateBuilder;
