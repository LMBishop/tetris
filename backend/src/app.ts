import express from 'express';
import router from './router.js';
import cors from 'cors';
import createWebsocketServer from './websocket/websocket-router.js';
       
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true}))

app.use(cors());

app.use('/', router);

const port = parseInt(process.env.PORT || "3000");

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

createWebsocketServer(server);