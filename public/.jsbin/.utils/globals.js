import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
import { CurrentChannel, CurrentUser } from "./classes.js";
import { req } from "./methods.js";

const current_channel = new CurrentChannel();
const current_user = new CurrentUser();
const socket = io('https://cphs-online.ryansyn.repl.co');


export { current_channel, current_user, socket };