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
    action: 'start',
    sessionId: code.value,
  }));
}

fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/session`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  }
).then(async (response) => {
  const data: any = await response.json();
  code.value = data.id;
  url.value = `${import.meta.env.VITE_FRONTEND_BASE_URL}/join/${data.id}`;
  waitingForCode.value = false;
  openSocket(data.id);
});

function openSocket(id: string) {
  socket = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_URL}`);

  socket.onopen = () => {
    socket.send(JSON.stringify({
      action: 'host',
      sessionId: id,
    }));
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.action === 'join') {
      numClients.value = data.clients;
    } else if (data.action === 'state' && data.state === 'playing') {
      started.value = true;
    } else if (data.action === 'move') {
      inputQueue.value.push(data.move);
    }
  };
}
</script>

<template>
  <main>
    <template v-if="waitingForCode">
      <h1>Requesting session...</h1>
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
