class EntityPredicate {
  constructor(parts = new Map()) {
    this.parts = parts instanceof Map ? parts : new Map(Object.entries(parts));
  }

  matches(levelOrPlayer, positionOrEntity = null, entity = null) {
    let level = levelOrPlayer;
    let position = positionOrEntity;
    let targetEntity = entity;

    // Trata overload de parâmetros (caso o primeiro argumento seja um Player)
    if (levelOrPlayer && typeof levelOrPlayer.level !== 'undefined') {
      level = levelOrPlayer.level;
      position = levelOrPlayer.position ? levelOrPlayer.position() : null;
      targetEntity = positionOrEntity;
    }

    if (!targetEntity) return false;

    // Valida todos os sub-predicados contidos em 'parts'
    for (const predicate of this.parts.values()) {
      if (predicate && typeof predicate.matches === 'function') {
        if (!predicate.matches(targetEntity, level, position)) {
          return false;
        }
      }
    }

    return true;
  }

  static createContext(player, entity) {
    return {
      thisEntity: entity,
      origin: player ? player.position() : null,
      level: player ? player.level : null
    };
  }
}

class EntityPredicateBuilder {
  constructor() {
    this.parts = new Map();
  }

  static entity() {
    return new EntityPredicateBuilder();
  }

  put(key, predicate) {
    this.parts.set(key, predicate);
    return this;
  }

  entityType(entityType) {
    return this.put('entity_type', entityType);
  }

  distance(distanceToPlayer) {
    return this.put('distance', new window.DistanceToPlayerPredicate?.(distanceToPlayer));
  }

  moving(movement) {
    return this.put('movement', movement);
  }

  located(locationBuilder) {
    const location = typeof locationBuilder?.build === 'function' ? locationBuilder.build() : locationBuilder;
    return this.put('location', new window.EntityLocationPredicate?.(location));
  }

  steppingOn(locationBuilder) {
    const location = typeof locationBuilder?.build === 'function' ? locationBuilder.build() : locationBuilder;
    return this.put('stepping_on', new window.SteppingOnPredicate?.(location));
  }

  movementAffectedBy(locationBuilder) {
    const location = typeof locationBuilder?.build === 'function' ? locationBuilder.build() : locationBuilder;
    return this.put('movement_affected_by', new window.MovementAffectedByPredicate?.(location));
  }

  effects(effectsBuilder) {
    const effects = typeof effectsBuilder?.build === 'function' ? effectsBuilder.build() : effectsBuilder;
    return this.put('effects', new window.EntityEffectsPredicate?.(effects));
  }

  nbt(nbt) {
    return this.put('nbt', new window.EntityNbtPredicate?.(nbt));
  }

  flags(flagsBuilder) {
    const flags = typeof flagsBuilder?.build === 'function' ? flagsBuilder.build() : flagsBuilder;
    return this.put('flags', flags);
  }

  equipment(equipmentBuilder) {
    const equipment = typeof equipmentBuilder?.build === 'function' ? equipmentBuilder.build() : equipmentBuilder;
    return this.put('equipment', equipment);
  }

  periodicTick(period) {
    return this.put('periodic_tick', new window.PeriodicEntityTickPredicate?.(period));
  }

  vehicle(vehicleBuilder) {
    const vehicle = typeof vehicleBuilder?.build === 'function' ? vehicleBuilder.build() : vehicleBuilder;
    return this.put('vehicle', new window.VehiclePredicate?.(vehicle));
  }

  passenger(passengerBuilder) {
    const passenger = typeof passengerBuilder?.build === 'function' ? passengerBuilder.build() : passengerBuilder;
    return this.put('passenger', new window.PassengerPredicate?.(passenger));
  }

  targetedEntity(targetedBuilder) {
    const targeted = typeof targetedBuilder?.build === 'function' ? targetedBuilder.build() : targetedBuilder;
    return this.put('targeted_entity', new window.TargetedEntityPredicate?.(targeted));
  }

  team(team) {
    return this.put('team', new window.TeamPredicate?.(team));
  }

  slots(slots) {
    return this.put('slots', new window.EntitySlotsPredicate?.(slots));
  }

  components(components) {
    if (components instanceof Map || typeof components === 'object') {
      return this.put('components', new window.EntityPartialComponentsPredicate?.(components));
    }
    return this.put('components', new window.EntityExactDataComponentsPredicate?.(components));
  }

  lightingBolt(lightningBolt) {
    return this.put('type_specific/lightning', lightningBolt);
  }

  player(player) {
    return this.put('type_specific/player', player);
  }

  sheep(sheep) {
    return this.put('type_specific/sheep', sheep);
  }

  cubeMob(cubeMob) {
    return this.put('type_specific/cube_mob', cubeMob);
  }

  raider(raider) {
    return this.put('type_specific/raider', raider);
  }

  fishingHook(fishingHook) {
    return this.put('type_specific/fishing_hook', fishingHook);
  }

  build() {
    return new EntityPredicate(this.parts);
  }
}

window.EntityPredicate = EntityPredicate;
window.EntityPredicateBuilder = EntityPredicateBuilder;
