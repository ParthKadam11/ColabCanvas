import "@repo/types"
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET
const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server running on port 8080");

wss.on('connection', function connection(ws, request) {

  const url =request.url;
  if(!url){
    return 
  }
  const queryParams = new URLSearchParams(url.split('?')[1])
  const token =queryParams.get('token') ?? ""
  const decoded = jwt.verify(token,JWT_SECRET as string)

  if(typeof decoded == "string"){
    ws.close()
    return
  }

  if( !decoded || !decoded.userId){
    ws.close()
    return
  }

  ws.on('message', function message(data) {
    ws.send('pong!');
  });

});