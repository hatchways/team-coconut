class Player {
  constructor(player) {
    this.email = player.email;
    this.name = player.name;
    this.point = 0;
    this.isGuesser = false;
    this.isGiver = false; // who is not giving duplicated words.
  }

  /**
   * Add Points
   * @param {number} point
   */
  addPoint(point) {
    this.point += point;
  }

  /**
   * Get Points
   */
  getPoint() {
    return this.point;
  }
}

module.exports = Player;
