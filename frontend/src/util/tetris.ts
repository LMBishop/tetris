import type { Board } from "@/model/board";
import { allTetrominoes, type Tetromino } from "@/model/tetrominoes";

export function mergeTetrominoWithBoard(board: Board, tetromino: Tetromino): Board {
  return board.map((row, rowIndex) => {
    if (rowIndex >= tetromino.row && rowIndex < tetromino.row + tetromino.shapes[tetromino.rotation].length) {
      return row.map((col, colIndex) => {
        if (colIndex >= tetromino.col && colIndex < tetromino.col + tetromino.shapes[tetromino.rotation][0].length) {
          return tetromino.shapes[tetromino.rotation][rowIndex - tetromino.row][colIndex - tetromino.col] || col;
        }
        return col;
      });
    }
    return row;
  });
}

export function tetrominoCollidesWithBoard(board: Board, tetromino: Tetromino): boolean {
  return tetromino.shapes[tetromino.rotation].some((row, rowIndex) => {
    return row.some((col, colIndex) => {
      if (col) {
        const boardRow = board[rowIndex + tetromino.row];
        if (!boardRow) {
          return true;
        }
        const boardCol = boardRow[colIndex + tetromino.col];
        if (boardCol) {
          return true;
        }
        if (colIndex + tetromino.col < 0 || colIndex + tetromino.col >= boardRow.length) {
          return true;
        }
        if (rowIndex + tetromino.row < 0 || rowIndex + tetromino.row >= board.length) {
          return true;
        }
      }
      return false;
    });
  });
}

export function randomiseNextTetrominoes(): Array<Tetromino> {
  const tetrominoes = Object.values(allTetrominoes);
  let currentIndex = tetrominoes.length,
    randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [tetrominoes[currentIndex], tetrominoes[randomIndex]] = [
      tetrominoes[randomIndex],
      tetrominoes[currentIndex],
    ];
  }

  return tetrominoes;
}