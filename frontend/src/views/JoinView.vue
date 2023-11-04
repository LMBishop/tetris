<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = route.params.id;

const joiningGame = ref(true);
const connected = ref(false);
const gameState = ref('');

const socket = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_URL}`);
socket.onopen = () => {
  socket.send(JSON.stringify({
    action: 'join',
    sessionId: sessionId,
  }));
};
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.action === 'state') {
    gameState.value = data.state;
    joiningGame.value = false;
    connected.value = true;
  }
};

function sendMove(move: string) {
  socket.send(JSON.stringify({
    action: 'move',
    sessionId: sessionId,
    move: move,
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
    <h1 v-if="joiningGame">Joining game "{{ sessionId }}"...</h1>
    <h1 v-if="connected">Connected to "{{ sessionId }}"</h1>
    <h1 v-if="gameState === 'waiting'">Waiting for host to start the game...</h1>
    <div class='controls' v-if="gameState === 'playing'">
      <button @click="sendLeft">Left</button>
      <button @click="sendRotate">Rotate</button>
      <button @click="sendRight">Right</button>
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
  }
</style>
