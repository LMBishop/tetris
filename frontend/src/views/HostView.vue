<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type TetrisBoard from '../components/TetrisBoard.vue';

let started = ref(false)
let waitingForCode = ref(true)
let code = ref('')
let url = ref('');
let numClients = ref(0);
let inputQueue: Ref<Array<string>> = ref([]);

let socket: WebSocket;

function startGame() {
  if (!socket) {
    return;
  }
  socket.send(JSON.stringify({
    type: 'start',
    payload: {}
  }));
}

console.log(import.meta.env.VITE_BACKEND_WS_URL);

socket = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_URL}/coop?action=create`);

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const type = data.type;
  const payload = data.payload;

  if (type === 'create') {
    code.value = payload.sessionId;
    waitingForCode.value = false;
    url.value = `${import.meta.env.VITE_FRONTEND_BASE_URL}/join/${payload.sessionId}`;

  } else if (type === 'join') {
    numClients.value = payload.numberOfClients;

  } else if (type === 'state') {
    started.value = payload.state === 'playing';

  } else if (type === 'move') {
    inputQueue.value.push(payload.move);
  }
};
</script>

<template>
  <main>
    <template v-if="waitingForCode">
      <h1>Requesting session...</h1>
      <p>If you are stuck on this page then disconnect from eduroam and use the guest network (or mobile data).
        UoN eduroam appears to block insecure websockets over the Internet which breaks this entire app.</p>
    </template>
    <template v-if="!started && !waitingForCode">
      <h1>Join this game</h1>
      <QRCode size=500 level="M" :value="url"></QRCode>
      <h2><a :href="url">{{ url }}</a></h2>
      <p>Connected clients: {{ numClients }}</p>
      <button @click="startGame">Start game</button>
    </template>
    <TetrisBoard v-if="started" :networked="true" :input-queue="inputQueue" :qrCode="url"></TetrisBoard>
  </main>
</template>
