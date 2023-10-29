import {Server} from 'socket.io';

let io: Server;

export function initIo(httpServer: any) {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      socket.disconnect();
    });
  });
}

export function getIo() {
  return io;
}
