class VehiclePredicate {
  constructor(vehicle) {
    this.vehicle = vehicle;
  }

  matches(entity, level, position) {
    if (!this.vehicle || !entity) return false;

    // Obtém o veículo no qual a entidade está montada
    let vehicleEntity = null;
    if (typeof entity.getVehicle === 'function') {
      vehicleEntity = entity.getVehicle();
    } else if (entity.vehicle) {
      vehicleEntity = entity.vehicle;
    }

    if (typeof this.vehicle.matches === 'function') {
      return this.vehicle.matches(level, position, vehicleEntity);
    }

    return false;
  }
}

window.VehiclePredicate = VehiclePredicate;
