import { removeTags, parseMentions, req } from "../.utils/methods.js";
import { current_channel, current_user, socket } from "../.utils/globals.js";
import { Message } from "../.utils/classes.js";

// Function
async function registerMessage(e) {
    let message_input = document.getElementById('message-input');
    
    if (e.key == 'Enter' && document.activeElement == message_input || e.key === undefined) {
        const content = message_input.value = message_input.value.replaceAll('\\n', '<br>');
        let msg = new Message(current_channel, parseMentions(message_input.value), current_user);

        socket.emit('message', {message: msg});
        message_input.value = '';
    }
}

// Exports
export { registerMessage };