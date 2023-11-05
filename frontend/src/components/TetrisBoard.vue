<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { mergeTetrominoWithBoard, randomiseNextTetrominoes, tetrominoCollidesWithBoard } from '@/util/tetris';
import { type Tetromino, allTetrominoes } from '@/model/tetrominoes';
import { type Board } from '@/model/board';

const props = defineProps({
  networked: Boolean,
  inputQueue: Array<string>,
  qrCode: String,
});

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
let nextTetrominoes: Ref<Array<Tetromino>> = ref([]);
let gameInterval: ReturnType<typeof setInterval>;
let gameSpeed = 1000;
let elapsedBlocks = 0;
let gameInProgress = false;
let freezeTick = false;
let points = ref(0);
let notificationMessage = ref('Press start to begin!');
let notificationBg = ref('\#dfdfdf');
let notificationFg = ref('black');

function updateRender() {
  if (currentTetromino) {
    renderBoard.value = mergeTetrominoWithBoard(gameBoard, currentTetromino);
  } else {
    renderBoard.value = gameBoard;
  }
}


function rescheduleTickTimer() {
  clearInterval(gameInterval);
  gameInterval = setInterval(tick, gameSpeed);
}

const tick = () => {
  if (!currentTetromino) {
    let next = nextTetrominoes.value.shift();
    currentTetromino = { ...next! };
    currentTetromino.col = 3;
    if (tetrominoCollidesWithBoard(gameBoard, currentTetromino)) {
      clearInterval(gameInterval);
      notificationBg.value = '\#FF4136';
      notificationFg.value = 'white';
      notificationMessage.value = 'Game over!';
      return;
    }


    if (nextTetrominoes.value.length === 0) {
      nextTetrominoes.value = randomiseNextTetrominoes();
    }
  }

  updateRender();

  if (tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, row: currentTetromino.row + 1 })) {
    if (!freezeTick) {
      freezeTick = true;
      return;
    }

    gameBoard = mergeTetrominoWithBoard(gameBoard, currentTetromino);
    currentTetromino = null;
    ++elapsedBlocks;

    let clears = 0;
    for (let row = 0; row < gameBoard.length; ++row) {
      if (gameBoard[row].every(cell => cell)) {
        clears++;
        gameBoard.splice(row, 1);
        gameBoard.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
    }

    switch (clears) {
      case 1:
        points.value += 40;
        break;
      case 2:
        points.value += 100;
        break;
      case 3:
        points.value += 300;
        break;
      case 4:
        points.value += 1200;
        break;
    }

    if (gameSpeed > 150 && elapsedBlocks % 3 === 0) {
      gameSpeed = Math.max(150, gameSpeed - (gameSpeed > 300 ? 75 : 10));
      rescheduleTickTimer();
    }
    freezeTick = false;
    return;
  } else {
    freezeTick = false;
  }

  ++currentTetromino.row;

};

function startGame() {
  elapsedBlocks = 0;
  gameSpeed = props.networked ? 350 : 1000;
  nextTetrominoes.value = randomiseNextTetrominoes();
  gameInProgress = true;
  notificationMessage.value = '';

  updateRender();
  rescheduleTickTimer();
}

function rotateTetronimo() {
  if (currentTetromino && !tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, rotation: (currentTetromino.rotation + 1) % 4 })) {
    currentTetromino!.rotation = (currentTetromino!.rotation + 1) % 4;
  }

  updateRender();
}

function moveTetrominoLeft() {
  if (currentTetromino && !tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, col: currentTetromino.col - 1 })) {
    --currentTetromino.col;
  }

  updateRender();
}

function moveTetrominoRight() {
  if (currentTetromino && !tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, col: currentTetromino.col + 1 })) {
    ++currentTetromino.col;
  }

  updateRender();
}

function dropTetromino() {
  let rowsDropped = 0;
  while (currentTetromino && !tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, row: currentTetromino.row + 1 })) {
    ++currentTetromino.row;
    ++rowsDropped;
  }

  if (rowsDropped === 0) {
    return;
  }

  points.value += rowsDropped + 1;

  tick();
}

function softDropTetromino() {
  if (currentTetromino && !tetrominoCollidesWithBoard(gameBoard, { ...currentTetromino, row: currentTetromino.row + 1 })) {
    ++currentTetromino.row;
  }

  updateRender();
}

function processInputQueue() {
  if (!props.networked) {
    return;
  }

  if (props.inputQueue!.length === 0) {
    return;
  }

  let move = props.inputQueue!.shift();
  if (move === 'left') {
    moveTetrominoLeft();
  } else if (move === 'right') {
    moveTetrominoRight();
  } else if (move === 'rotate') {
    rotateTetronimo();
  }
}

if (!props.networked) {
  document.addEventListener('keydown', event => {
    event.preventDefault();
    if (currentTetromino && event.key === 'r') {
      rotateTetronimo();
    }
    if (currentTetromino && ['ArrowLeft', 'h'].includes(event.key)) {
      moveTetrominoLeft();
    }
    if (currentTetromino && ['ArrowRight', 'l'].includes(event.key)) {
      moveTetrominoRight();
    }
    if (currentTetromino && ['ArrowDown', 'j', 'z'].includes(event.key)) {
      softDropTetromino();
    }
    if (currentTetromino && ['ArrowUp', 'k', 'c'].includes(event.key)) {
      dropTetromino();
    }
  });
}

if (props.networked) {
  onMounted(() => {
    setInterval(processInputQueue, 100);
  });
}

onMounted(() => {
  if (!gameInProgress) {
    startGame();
  }
});
</script>

<template>
  <main>
    <h1>Tetris</h1>
    <div class="cols">
      <div>
        <div v-if="notificationMessage" class="notification-banner"
          :style="{ 'background-color': notificationBg, 'color': notificationFg }">
          {{ notificationMessage }}
        </div>
        <div class="tetris-board">
          <div v-for="(row, rowIndex) of renderBoard" class="tetris-row">
            <div v-for="(col, colIndex) of row" class="tetris-cell"
              :style="{ 'background-color': col ? `rgb(${allTetrominoes[col].color})` : 'white' }">

            </div>
          </div>
        </div>
      </div>
      <div class="game-info">
        <button v-if="!gameInProgress" @click="startGame">Start game</button>
        <h2>Next up</h2>
        <div class="next-tetromino">
          <div v-for="(row, rowIndex) of nextTetrominoes[0]?.shapes[0]" class="tetris-row">
            <div v-for="(col, colIndex) of row" class="tetris-cell"
              :style="{ 'background-color': col ? `rgb(${nextTetrominoes[0]?.color})` : 'white' }">

            </div>
          </div>
        </div>

        <h2>Score</h2>
        <h3>
          {{ points }}
        </h3>

        <div v-if="!networked">
          <h2>Controls</h2>
          <p>
            To move left and right, use the arrow keys or <kbd>H</kbd> and <kbd>L</kbd>.
          </p>

          <p>
            To rotate, use <kbd>R</kbd>.
          </p>

          <p>
            To do a soft drop, use the arrow down key or <kbd>J</kbd>.
          </p>

          <p>
            To do a hard drop, use the arrow up key or <kbd>K</kbd>.
          </p>
        </div>
        <div v-if="networked">
          <h2>Join this game</h2>
          <QRCode size=200 level="M" :value="qrCode"></QRCode>
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

.game-info {
  max-width: 250px;
}

.tetris-board {
  width: calc(32px * 10);
  height: calc(32px * 20);
  border: 1px solid #dfdfdf;
}

.notification-banner {
  width: calc(32px * 10 + 2px);
  height: 22px;
  text-align: center;
  position: absolute;
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