class DistancePredicate {
  constructor(x = null, y = null, z = null, horizontal = null, absolute = null) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.horizontal = horizontal;
    this.absolute = absolute;
  }

  static horizontal(horizontal) {
    return new DistancePredicate(null, null, null, horizontal, null);
  }

  static vertical(y) {
    return new DistancePredicate(null, y, null, null, null);
  }

  static absolute(absolute) {
    return new DistancePredicate(null, null, null, null, absolute);
  }

  matches(x0, y0, z0, x1, y1, z1) {
    const xd = x0 - x1;
    const yd = y0 - y1;
    const zd = z0 - z1;

    const absX = Math.abs(xd);
    const absY = Math.abs(yd);
    const absZ = Math.abs(zd);

    if (this.x && typeof this.x.matches === 'function' && !this.x.matches(absX)) {
      return false;
    }
    if (this.y && typeof this.y.matches === 'function' && !this.y.matches(absY)) {
      return false;
    }
    if (this.z && typeof this.z.matches === 'function' && !this.z.matches(absZ)) {
      return false;
    }

    const horizontalSqr = xd * xd + zd * zd;
    if (this.horizontal && typeof this.horizontal.matchesSqr === 'function') {
      if (!this.horizontal.matchesSqr(horizontalSqr)) {
        return false;
      }
    } else if (this.horizontal && typeof this.horizontal.matches === 'function') {
      if (!this.horizontal.matches(Math.sqrt(horizontalSqr))) {
        return false;
      }
    }

    const absoluteSqr = xd * xd + yd * yd + zd * zd;
    if (this.absolute && typeof this.absolute.matchesSqr === 'function') {
      if (!this.absolute.matchesSqr(absoluteSqr)) {
        return false;
      }
    } else if (this.absolute && typeof this.absolute.matches === 'function') {
      if (!this.absolute.matches(Math.sqrt(absoluteSqr))) {
        return false;
      }
    }

    return true;
  }
}

window.DistancePredicate = DistancePredicate;
