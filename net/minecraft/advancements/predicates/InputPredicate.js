class InputPredicate {
  constructor(
    forward = null,
    backward = null,
    left = null,
    right = null,
    jump = null,
    sneak = null,
    sprint = null
  ) {
    this.forward = forward;
    this.backward = backward;
    this.left = left;
    this.right = right;
    this.jump = jump;
    this.sneak = sneak;
    this.sprint = sprint;
  }

  matches(input) {
    if (!input) return false;

    // Obtém as propriedades do objeto de entrada (suporta métodos e propriedades diretas)
    const forwardVal = typeof input.forward === 'function' ? input.forward() : input.forward;
    const backwardVal = typeof input.backward === 'function' ? input.backward() : input.backward;
    const leftVal = typeof input.left === 'function' ? input.left() : input.left;
    const rightVal = typeof input.right === 'function' ? input.right() : input.right;
    const jumpVal = typeof input.jump === 'function' ? input.jump() : input.jump;
    const sneakVal = typeof input.shift === 'function' ? input.shift() : (input.sneak || input.shift);
    const sprintVal = typeof input.sprint === 'function' ? input.sprint() : input.sprint;

    return this._checkMatch(this.forward, forwardVal)
      && this._checkMatch(this.backward, backwardVal)
      && this._checkMatch(this.left, leftVal)
      && this._checkMatch(this.right, rightVal)
      && this._checkMatch(this.jump, jumpVal)
      && this._checkMatch(this.sneak, sneakVal)
      && this._checkMatch(this.sprint, sprintVal);
  }

  _checkMatch(expected, actual) {
    if (expected === null || expected === undefined) return true;
    return !!expected === !!actual;
  }
}

window.InputPredicate = InputPredicate;
