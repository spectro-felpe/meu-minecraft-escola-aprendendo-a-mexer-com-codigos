class FoodPredicate {
  constructor(level = null, saturation = null) {
    this.level = level;            // Instância de MinMaxBounds.Ints
    this.saturation = saturation;  // Instância de MinMaxBounds.Doubles
  }

  matches(food) {
    if (!food) return false;

    // 1. Obtém o nível de fome (foodLevel)
    const foodLevel = typeof food.getFoodLevel === 'function' ? food.getFoodLevel() : food.foodLevel;
    if (this.level && typeof this.level.matches === 'function') {
      if (!this.level.matches(foodLevel)) {
        return false;
      }
    }

    // 2. Obtém a saturação (saturationLevel)
    const saturationLevel = typeof food.getSaturationLevel === 'function' ? food.getSaturationLevel() : food.saturationLevel;
    if (this.saturation && typeof this.saturation.matches === 'function') {
      if (!this.saturation.matches(saturationLevel)) {
        return false;
      }
    }

    return true;
  }
}

class FoodPredicateBuilder {
  constructor() {
    this.levelVal = null;
    this.saturationVal = null;
  }

  static food() {
    return new FoodPredicateBuilder();
  }

  withLevel(level) {
    this.levelVal = level;
    return this;
  }

  withSaturation(saturation) {
    this.saturationVal = saturation;
    return this;
  }

  build() {
    return new FoodPredicate(this.levelVal, this.saturationVal);
  }
}

FoodPredicate.ANY = new FoodPredicate(null, null);

window.FoodPredicate = FoodPredicate;
window.FoodPredicateBuilder = FoodPredicateBuilder;
