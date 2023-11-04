export type Tetromino = {
  id: string;
  shapes: Array<Array<Array<string | number>>>;
  color: string;
  rotation: number;
  col: number;
  row: number;
  width: number;
  height: number;
};

export const Tetrominoes: { [key: string]: Tetromino } = {
  I: {
    id: "I",
    shapes: [
      [
        [0, "I", 0, 0],
        [0, "I", 0, 0],
        [0, "I", 0, 0],
        [0, "I", 0, 0],
      ],
      [
        [0, 0, 0, 0],
        ["I", "I", "I", "I"],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, "I", 0, 0],
        [0, "I", 0, 0],
        [0, "I", 0, 0],
        [0, "I", 0, 0],
      ],
      [
        [0, 0, 0, 0],
        ["I", "I", "I", "I"],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    color: "80, 227, 230",
    rotation: 0,
    col: 0,
    row: 0,
    width: 4,
    height: 4,
  },
  J: {
    id: "J",
    shapes: [
      [
        [0, "J", 0],
        [0, "J", 0],
        ["J", "J", 0],
      ],
      [
        ["J", 0, 0],
        ["J", "J", "J"],
        [0, 0, 0],
      ],
      [
        [0, "J", "J"],
        [0, "J", 0],
        [0, "J", 0],
      ],
      [
        [0, 0, 0],
        ["J", "J", "J"],
        [0, 0, "J"],
      ],
    ],
    color: "36, 95, 223",
    rotation: 0,
    col: 0,
    row: 0,
    width: 3,
    height: 3,
  },
  L: {
    id: "L",
    shapes: [
      [
        [0, "L", 0],
        [0, "L", 0],
        [0, "L", "L"],
      ],
      [
        [0, 0, 0],
        ["L", "L", "L"],
        ["L", 0, 0],
      ],
      [
        ["L", "L", 0],
        [0, "L", 0],
        [0, "L", 0],
      ],
      [
        [0, 0, "L"],
        ["L", "L", "L"],
        [0, 0, 0],
      ],
    ],
    color: "223, 173, 36",
    rotation: 0,
    col: 0,
    row: 0,
    width: 3,
    height: 3,
  },
  O: {
    id: "O",
    shapes: [
      [
        ["O", "O"],
        ["O", "O"],
      ],
      [
        ["O", "O"],
        ["O", "O"],
      ],
      [
        ["O", "O"],
        ["O", "O"],
      ],
      [
        ["O", "O"],
        ["O", "O"],
      ],
    ],
    color: "223, 217, 36",
    rotation: 0,
    col: 0,
    row: 0,
    width: 2,
    height: 2,
  },
  S: {
    id: "S",
    shapes: [
      [
        [0, "S", "S"],
        ["S", "S", 0],
        [0, 0, 0],
      ],
      [
        [0, "S", 0],
        [0, "S", "S"],
        [0, 0, "S"],
      ],
      [
        [0, 0, 0],
        [0, "S", "S"],
        ["S", "S", 0],
      ],
      [
        ["S", 0, 0],
        ["S", "S", 0],
        [0, "S", 0],
      ],
    ],
    color: "48, 211, 56",
    rotation: 0,
    col: 0,
    row: 0,
    width: 3,
    height: 3,
  },
  T: {
    id: "T",
    shapes: [
      [
        [0, 0, 0],
        ["T", "T", "T"],
        [0, "T", 0],
      ],
      [
        [0, "T", 0],
        ["T", "T", 0],
        [0, "T", 0],
      ],
      [
        [0, "T", 0],
        ["T", "T", "T"],
        [0, 0, 0],
      ],
      [
        [0, "T", 0],
        [0, "T", "T"],
        [0, "T", 0],
      ],
    ],
    color: "132, 61, 198",
    rotation: 0,
    col: 0,
    row: 0,
    width: 3,
    height: 3,
  },
  Z: {
    id: "Z",
    shapes: [
      [
        ["Z", "Z", 0],
        [0, "Z", "Z"],
        [0, 0, 0],
      ],
      [
        [0, 0, "Z"],
        [0, "Z", "Z"],
        [0, "Z", 0],
      ],
      [
        [0, 0, 0],
        ["Z", "Z", 0],
        [0, "Z", "Z"],
      ],
      [
        [0, "Z", 0],
        ["Z", "Z", 0],
        ["Z", 0, 0],
      ],
    ],
    color: "227, 78, 78",
    rotation: 0,
    col: 0,
    row: 0,
    width: 3,
    height: 3,
  },
};
