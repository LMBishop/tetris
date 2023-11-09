<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = route.params.id;

const joiningGame = ref(true);
const connected = ref(false);
const gameState = ref('');
const controlsLocked = ref(false);

let moveTimeout: number;

const socket = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_URL}/coop?action=join&sessionId=${sessionId}`);
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const type = data.type;
  const payload = data.payload;

  if (type === 'state') {
    gameState.value = payload.state;
    joiningGame.value = false;
    connected.value = true;
  }

  if (type === 'timeout') {
    const timeout = payload.timeoutUntil - Date.now();
    if (timeout < 0) {
      controlsLocked.value = false;
      return;
    }

    controlsLocked.value = true; 
    if (moveTimeout) {
      clearTimeout(moveTimeout);
    }
    moveTimeout = setTimeout(() => {
      controlsLocked.value = false;
    }, timeout);
  }
};

function sendMove(move: string) {
  if (controlsLocked.value) {
    return;
  }
  controlsLocked.value = true;
  socket.send(JSON.stringify({
    type: 'move',
    payload: {
      move 
    }
  }));
}

function sendLeft() {
  sendMove('left');
}

function sendRotate() {
  sendMove('rotate');
}

function sendRight() {
  sendMove('right');
}
</script>

<template>
  <main>
    <template v-if="joiningGame">
      <h1>Joining game "{{ sessionId }}"...</h1>
      <p>If you are stuck on this page then disconnect from eduroam and use the guest network (or mobile data).
        UoN eduroam appears to block insecure websockets over the Internet which breaks this entire app.</p>
    </template>
    <h1 v-if="connected">Connected to "{{ sessionId }}"</h1>
    <h1 v-if="gameState === 'waiting'">Waiting for host to start the game...</h1>
    <div class='controls' v-if="gameState === 'playing'">
      <button @click="sendLeft" :disabled="controlsLocked">Left</button>
      <button @click="sendRotate" :disabled="controlsLocked">Rotate</button>
      <button @click="sendRight" :disabled="controlsLocked">Right</button>
    </div>
  </main>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: row;
  height: 100vh;
  gap: 0.5rem;
}

.controls button {
  flex-grow: 1;
  touch-action: none;
}
</style>
