const PlayerState = {
  normal:   0, // Normal playing state, which the piece is falling
  purge:    1, // The state in which the complete rows are being cleared
  end:      2  // Game over
};

export default PlayerState;