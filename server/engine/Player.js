class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.point = 0;
    this.isGuesser = false;
    this.isTyping = false;
    this.clue = "";
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
