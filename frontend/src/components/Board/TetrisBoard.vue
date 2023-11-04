<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { mergeTetrominoWithBoard, tetrominoCollidesWithBoard } from '@/util/tetris';
import { type Tetromino, Tetrominoes } from '@/model/tetrominoes';
import { type Board } from '@/model/board';

const renderBoard: Ref<Board> = ref([[]]);
let gameBoard: Board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]
let currentTetromino: Tetromino | null = null;
let nextTetromino: Ref<Tetromino | undefined> = ref();
let gameInterval: ReturnType<typeof setInterval>;
let gameInProgress = false;

function updateRender() {
  if (currentTetromino) {
    renderBoard.value = mergeTetrominoWithBoard(gameBoard, currentTetromino);
  } else {
    renderBoard.value = gameBoard;
  }
}

const tick = () => {
  if (!currentTetromino) {
    currentTetromino = { ...nextTetromino.value! };
    if (tetrominoCollidesWithBoard(gameBoard, currentTetromino)) {
      clearInterval(gameInterval);
      alert('Game over!');
      return;
    }

    nextTetromino.value = Object.values(Tetrominoes)[Math.floor(Math.random() * 7)];
  }
  
  updateRender();
  
  if (tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, row: currentTetromino.row + 1})) {
    gameBoard = mergeTetrominoWithBoard(gameBoard, currentTetromino);
    currentTetromino = null;
    return;
  }

  ++currentTetromino.row;
};

function startGame() {
  gameInterval = setInterval(tick, 250);
  nextTetromino.value = Object.values(Tetrominoes)[Math.floor(Math.random() * 7)];
  gameInProgress = true;
}

document.addEventListener('keydown', event => {
  event.preventDefault();
  if (currentTetromino && event.key === 'r') {
    if (!tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, rotation: (currentTetromino.rotation + 1) % 4})) {
      currentTetromino!.rotation = (currentTetromino!.rotation + 1) % 4;
    } 

    updateRender();
  }
  if (currentTetromino && ['ArrowLeft', 'h'].includes(event.key)) {
    if (!tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, col: currentTetromino.col - 1})) {
      --currentTetromino.col;
    }
    
    updateRender();
  }
  if (currentTetromino && ['ArrowRight', 'l'].includes(event.key)) {
    if (!tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, col: currentTetromino.col + 1})) {
      ++currentTetromino.col;
    }
    
    updateRender();
  }
  if (currentTetromino && ['ArrowDown', 'j'].includes(event.key)) {
    if (!tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, row: currentTetromino.row + 1})) {
      ++currentTetromino.row;
    }
    
    updateRender();
  }
});
</script>

<template>
  <main>
    <h1>Tetris</h1>
    <button v-if="!gameInProgress" @click="startGame">Start game</button>
    <div class="cols">
      <div class="tetris-board">
        <div v-for="(row, rowIndex) of renderBoard" class="tetris-row">
          <div v-for="(col, colIndex) of row" class="tetris-cell"
            :style="{ 'background-color': col ? `rgb(${Tetrominoes[col].color})` : 'white' }">

          </div>
        </div>
      </div>
      <div>
        <p>Next up</p>
        <div class="next-tetromino">
          <div v-for="(row, rowIndex) of nextTetromino?.shapes[0]" class="tetris-row">
            <div v-for="(col, colIndex) of row" class="tetris-cell"
              :style="{ 'background-color': col ? `rgb(${nextTetromino?.color})` : 'white' }">

            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>
.cols {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.tetris-board {
  width: calc(32px * 10);
  height: calc(32px * 20);
  border: 1px solid #dfdfdf;
}

.next-tetromino {
  width: calc(32px * 4);
  height: calc(32px * 4);
}

.tetris-row {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
}

.tetris-cell {
  width: 30px;
  height: 30px;
  border: 1px solid #dfdfdf;
}
</style>