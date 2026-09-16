class EntitySubPredicates {
  static registry = new Map();

  static register(id, codec) {
    this.registry.set(id, codec);
    return codec;
  }

  static bootstrap(registry = this.registry) {
    EntitySubPredicates.register("entity_type", window.EntityTypePredicate?.CODEC);
    EntitySubPredicates.register("location", window.EntityLocationPredicate?.CODEC);
    EntitySubPredicates.register("stepping_on", window.SteppingOnPredicate?.CODEC);
    EntitySubPredicates.register("movement_affected_by", window.MovementAffectedByPredicate?.CODEC);
    EntitySubPredicates.register("distance", window.DistanceToPlayerPredicate?.CODEC);
    EntitySubPredicates.register("movement", window.MovementPredicate?.CODEC);
    EntitySubPredicates.register("effects", window.EntityEffectsPredicate?.CODEC);
    EntitySubPredicates.register("nbt", window.EntityNbtPredicate?.CODEC);
    EntitySubPredicates.register("flags", window.EntityFlagsPredicate?.CODEC);
    EntitySubPredicates.register("equipment", window.EntityEquipmentPredicate?.CODEC);
    EntitySubPredicates.register("periodic_tick", window.PeriodicEntityTickPredicate?.CODEC);
    EntitySubPredicates.register("vehicle", window.VehiclePredicate?.CODEC);
    EntitySubPredicates.register("passenger", window.PassengerPredicate?.CODEC);
    EntitySubPredicates.register("targeted_entity", window.TargetedEntityPredicate?.CODEC);
    EntitySubPredicates.register("team", window.TeamPredicate?.CODEC);
    EntitySubPredicates.register("slots", window.EntitySlotsPredicate?.CODEC);
    EntitySubPredicates.register("components", window.EntityExactDataComponentsPredicate?.CODEC);
    EntitySubPredicates.register("predicates", window.EntityPartialComponentsPredicate?.CODEC);
    EntitySubPredicates.register("entity_tags", window.EntityTagPredicate?.CODEC);
    EntitySubPredicates.register("type_specific/lightning", window.LightningBoltPredicate?.CODEC);
    EntitySubPredicates.register("type_specific/fishing_hook", window.FishingHookPredicate?.CODEC);
    EntitySubPredicates.register("type_specific/player", window.PlayerPredicate?.CODEC);
    EntitySubPredicates.register("type_specific/cube_mob", window.CubeMobPredicate?.CODEC);
    EntitySubPredicates.register("type_specific/raider", window.RaiderPredicate?.CODEC);
    return EntitySubPredicates.register("type_specific/sheep", window.SheepPredicate?.CODEC);
  }
}

window.EntitySubPredicates = EntitySubPredicates;
