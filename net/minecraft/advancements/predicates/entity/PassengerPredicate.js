class PassengerPredicate {
  constructor(passenger = null) {
    this.passenger = passenger;
  }

  matches(entity, level = null, position = null) {
    if (!entity) return false;

    if (this.passenger && typeof this.passenger.matches === 'function') {
      let passengers = [];

      if (typeof entity.getPassengers === 'function') {
        const result = entity.getPassengers();
        passengers = Array.isArray(result) ? result : Array.from(result || []);
      } else if (Array.isArray(entity.passengers)) {
        passengers = entity.passengers;
      }

      for (const pass of passengers) {
        if (this.passenger.matches(level, position, pass)) {
          return true;
        }
      }
    }

    return false;
  }
}

window.PassengerPredicate = PassengerPredicate;
