// Imports
import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
import { removeTags, validURL, req } from './.utils/methods.js';
import { Message } from './.utils/classes.js';

// Message Handling imports.
import { loadMessages } from './.message-handling/load-messages.js';
import { removeMessages } from './.message-handling/remove-messages.js';

// Constants
const socket = io('https://cphs-online.ryansyn.repl.co');

// General Document Elements.
let message_input = document.getElementById('message-input');
let message_send_button = document.getElementById('message-send-button');
let main_message_container = document.getElementById('main-message-container');
let d2_container = document.getElementById('d2-container');

// Channel buttons
const channel_display = document.getElementById('channel-display');
const channel_button_m = document.getElementById('channel-button-m');
const channel_button_0 = document.getElementById('channel-button-0');
const channel_button_1 = document.getElementById('channel-button-1');
const channel_button_2 = document.getElementById('channel-button-2');


// Variables
let current_channel = 0;
let current_direct_message;

// Functions
loadMessages(current_channel, main_message_container);

async function registerMessage(e) {
    let message_input = document.getElementById('message-input');
    if (e.key == 'Enter' && document.activeElement == message_input || e.key === undefined) {
        // Basically if message was just tags return.
        if (message_input.value == '' || removeTags(message_input.value) == '') return message_input.value = '';
        if (message_input.value == ' ' || removeTags(message_input.value) == ' ') return message_input.value = '';
        
        // Creates a new instance of a message then sends it to the server to send to all clients.
        
        let channel = await req('/get', {type: 'object', object: 'channel', sub: current_channel});
        let user = await req('/get', {type: 'member', object: 'self'});

        let msg = new Message(user, channel, removeTags(message_input.value), null);

        socket.emit('message', {message: msg});
        message_input.value = '';
    }
}

// Event for when tab closed.
// window.onunload = async () => {
//     await socket.emit('leave', username_input.value);
// };

channel_button_m.addEventListener('click', async () => {
    let statistics = await req('/get', {type: "object", object: "statistics"});
    let res = await req('/get', {type: 'member', object: 'self'});
    let member = res.member;

    res = await req('/get', {type: 'object', object: 'bulletin'});
    let bulletin = res.bulletin;
    
    current_channel = -1;
    channel_display.innerHTML = 'viewing the menu';
    d2_container.innerHTML = `
                <div class='d2-container-wrapper-1'>
                    <input id='description-input'placeholder='description'></input>
                    <button id='description-set-button'>set</button>
                    <input id='banner-url-input' placeholder='banner url'></input>
                    <button id='banner-url-set-button'>set</button>
                </div>
                <div class='menu-wrapper'>
                    <button id='theme-button'>theme: dark</button>
                    <p class='menu-container-1'>total users: ${statistics.users}</p>
                    <p class='menu-container-2'>total messages: ${statistics.messages}</p>
                    <p class='menu-container-3'>signed-in: ${member.username}</p>
                    <button id='log-out-button'>log out</button>
                </div>
                <div class='message-wrapper' style='margin: 0;'>
                    <button class='message-container' style='margin: 0 8px 0 8px;'>
                        <p style='margin-bottom: 8px;'><span style='font-weight: bold; color: var(--neutral);'>system</span></p>
                        <p>${bulletin}</p>
                    </button>
                </div>`
    let theme_button = document.getElementById('theme-button');
    let log_out_button = document.getElementById('log-out-button');
    let description_input = document.getElementById('description-input');
    let description_set_button = document.getElementById("description-set-button");

    description_input.value = member.info.description;

    if (member.settings.theme == 1) {
        theme_button.innerHTML = 'theme: light';
    } else { theme_button.innerHTML = 'theme: dark'; }

    theme_button.onclick = async () => {
        let body = document.getElementsByTagName('body')[0];
        if (member.settings.theme == 1) {
            member.settings.theme = 0;
            body.setAttribute('class', 'dark-theme');
            theme_button.innerHTML = 'theme: dark';
        } else {
            member.settings.theme = 1; 
            body.setAttribute('class', 'light-theme'); 
            theme_button.innerHTML = 'theme: light';
        }

        await req("/set", {type: "member", object: "settings", sub: "theme", sub_value: member.settings.theme});
    };

    description_set_button.onclick = async () => {
        console.log(1)
        console.log(description_input.value);

        await req("/set", {type: "member", object: "info", sub: "description", sub_value: description_input.value});
        description_input.value = '';
    };

    log_out_button.onclick = () => {
        document.cookie = '';
        window.location = '/portal.html';
    };
});

channel_button_0.addEventListener('click', () => {
    current_channel = 0;
    channel_display.innerHTML = 'viewing general';
    d2_container.innerHTML = `
                <div class='d2-container-wrapper-1'>
                    <input id='message-input' placeholder='message'></input>
                    <button id='message-send-button'>send</button>
                </div>
                <div style='margin: 8px 8px 0 8px; width: auto; height: 3px; background-color: var(--secondary-1)'></div>
                <div id='main-message-container' class='d2-container-wrapper-2'>
                </div>`
    let message_input = document.getElementById('message-input');
    let message_send_button = document.getElementById('message-send-button');
    let main_message_container = document.getElementById('main-message-container');

    message_send_button.addEventListener('click', registerMessage);
    document.addEventListener('keydown', registerMessage);
    
    loadMessages(current_channel, main_message_container);
});

channel_button_1.addEventListener('click', () => {
    current_channel = 1;
    channel_display.innerHTML = 'viewing channel-1';
    d2_container.innerHTML = `
                <div class='d2-container-wrapper-1'>
                    <input id='message-input' placeholder='message'></input>
                    <button id='message-send-button'>send</button>
                </div>
                <div style='margin: 8px 8px 0 8px; width: auto; height: 3px; background-color: var(--secondary-1)'></div>
                <div id='main-message-container' class='d2-container-wrapper-2'>
                </div>`
    let message_input = document.getElementById('message-input');
    let message_send_button = document.getElementById('message-send-button');
    let main_message_container = document.getElementById('main-message-container');

    message_send_button.addEventListener('click', registerMessage);
    document.addEventListener('keydown', registerMessage);

    loadMessages(current_channel, main_message_container);
});

channel_button_2.addEventListener('click', () => {
    current_channel = 2;
    channel_display.innerHTML = 'viewing channel-2';
    d2_container.innerHTML = `
                <div class='d2-container-wrapper-1'>
                    <input id='message-input' placeholder='message'></input>
                    <button id='message-send-button'>send</button>
                </div>
                <div style='margin: 8px 8px 0 8px; width: auto; height: 3px; background-color: var(--secondary-1)'></div>
                <div id='main-message-container' class='d2-container-wrapper-2'>
                </div>`
    let message_input = document.getElementById('message-input');
    let message_send_button = document.getElementById('message-send-button');
    let main_message_container = document.getElementById('main-message-container');

    message_send_button.addEventListener('click', registerMessage);
    document.addEventListener('keydown', registerMessage);

    loadMessages(current_channel, main_message_container);
});


// Events for msg sending.
message_send_button.addEventListener('click', registerMessage);
document.addEventListener('keydown', registerMessage);

// Event for msg receiving.
socket.on('message', async data => {
    const message = data.message;
    if (!message.content) return;

    let full_mentions = message.content.match(/\B<@[^>]+>/g);
    let parsed_mentions = message.content.match(/(?<=\<@)\w+(?=\>)/g);

    console.log(full_mentions)
    console.log(parsed_mentions)

    let main_message_container = document.getElementById('main-message-container');
    
    if (data.message.channel.id == current_channel) {
        if (main_message_container.childElementCount >= 200) {
            main_message_container.removeChild(main_message_container.lastElementChild);
        }

        let message_wrapper = document.createElement('div');
        let message_container = document.createElement('button');

        let message_author = document.createElement('p');
        message_author.setAttribute('style', 'margin-bottom: 8px;');
        let message_author_span = document.createElement('span');
        let message_content = document.createElement('p');

        message_wrapper.setAttribute('class', 'message-wrapper');
        message_container.setAttribute('class', 'message-container');
        

        // admin case - >
        if (message.author.info.is_admin) { 
            message_author_span.setAttribute('style', 'font-weight: bold; color: var(--blue);')
        } else {
            message_author_span.setAttribute('style', 'font-weight: bold; color: var(--neutral);')
        }
        
        message_author_span.innerHTML = message.author.username;
        message_author.appendChild(message_author_span);
        message_content.innerHTML = message.content;

        message_container.appendChild(message_author);
        message_container.appendChild(message_content);
        message_wrapper.appendChild(message_container);

        main_message_container.prepend(message_wrapper);

        let profile_opened = false;
        
        message_wrapper.onclick = e => {
            if (profile_opened == false) {
                profile_opened = true;
                let array = Array.prototype.slice.call(main_message_container.childNodes);
                message_wrapper.setAttribute('id', array.indexOf(message_wrapper));

                let profile_container = document.createElement('button');
                profile_container.setAttribute('id', 'profile-container');
                profile_container.setAttribute('class', 'message-container');
                profile_container.setAttribute('style', 'margin-top: 8px;');
                let profile_author = document.createElement('p');

                let profile_wrapper = document.createElement('div');
                profile_wrapper.setAttribute('class', 'profile-wrapper');

                let profile_container_1 = document.createElement('div');
                profile_container_1.setAttribute('id', 'profile-container-1')
                let pc1_role_wrapper = document.createElement('div');
                pc1_role_wrapper.setAttribute('class', 'role-wrapper');

                message.author.info.roles.forEach(role => {
                    let role_container = document.createElement('span');
                    role_container.setAttribute('class', 'role');
                    role_container.innerHTML = `${role}`;
                    pc1_role_wrapper.appendChild(document.createTextNode(' '))
                    pc1_role_wrapper.appendChild(role_container);
                });

                let profile_container_2 = document.createElement('div');
                profile_container_2.setAttribute('id', 'profile-container-2')
                let pc2_content = document.createElement('p');
                pc2_content.innerHTML = `<p style=\'margin-top: 8px; color: var(--neutral); text-align: center;\'>${message.author.info.description}</span>`;

                let profile_container_3 = document.createElement('div');
                profile_container_3.setAttribute('id', 'profile-container-3')
                let pc3_content = document.createElement('p');
                pc3_content.innerHTML = `<p style=\'margin-top: 8px; color: var(--neutral); text-align: center;\'>${message.author.info.join_date.split(", ")[0]}<br>${message.author.info.join_date.split(", ")[1]}</span>`;

                let profile_container_4 = document.createElement('div');
                profile_container_4.setAttribute('id', 'profile-container-4')
                let pc4_content = document.createElement('p');
                pc4_content.innerHTML = `<p style=\'margin-top: 8px; color: var(--neutral); text-align: center;\'>${message.author.id}</span>`;

                if (message.author.info.is_admin) {
                    profile_author.innerHTML = `<span style=\'font-weight: bold; color: var(--blue);\'>${message.author.username}</span> <span style='color: var(--neutral);'>—— user profile</span>`
                } else {
                    profile_author.innerHTML = `<span style=\'font-weight: bold; color: var(--neutral);\'>${message.author.username}</span> <span style='color: var(--neutral);'>—— user profile</span>`
                }

                profile_container_1.innerHTML = '<p style=\'color: var(--neutral); text-align: center; font-weight: bold;\'>roles</p>';
                profile_container_1.appendChild(pc1_role_wrapper);

                profile_container_2.innerHTML = '<p style=\'color: var(--neutral); text-align: center; font-weight: bold;\'>description</p>';
                profile_container_2.appendChild(pc2_content)

                profile_container_3.innerHTML = '<p style=\'color: var(--neutral); text-align: center; font-weight: bold;\'>join date</p>';
                profile_container_3.appendChild(pc3_content)

                profile_container_4.innerHTML = '<p style=\'color: var(--neutral); text-align: center; font-weight: bold;\'>user id</p>';
                profile_container_4.appendChild(pc4_content)

                profile_wrapper.appendChild(profile_container_1);
                profile_wrapper.appendChild(profile_container_2);
                profile_wrapper.appendChild(profile_container_3);
                profile_wrapper.appendChild(profile_container_4);

                profile_container.appendChild(profile_author);
                profile_container.appendChild(profile_wrapper);

                main_message_container.childNodes.item(array.indexOf(message_wrapper)).appendChild(profile_container);
            } else {
                profile_opened = false;
                        
                let array = Array.prototype.slice.call(main_message_container.childNodes);
                message_wrapper.setAttribute('id', array.indexOf(message_wrapper));
                      
                let message = main_message_container.childNodes.item(array.indexOf(message_wrapper));

                let profile_container = message.querySelector("#profile-container");

                message.removeChild(profile_container);
            }
        }
    }
});

socket.on('channel-flushed', async data => {
    if (data.channel == current_channel) {
        console.log(9)
        await removeMessages(main_message_container);
        let message_wrapper = document.createElement('div');
        let message_container = document.createElement('button');

        let message_author = document.createElement('p');

        message_wrapper.setAttribute('class', 'message-wrapper');
        message_container.setAttribute('class', 'message-container');
        message_author.setAttribute('style', 'margin-bottom: 8px; color: var(--neutral);');

        let message_author_span = document.createElement('span');
        let message_content = document.createElement('p');

        message_author_span.innerHTML = "system";
        message_author.appendChild(message_author_span);
        message_content.innerHTML = "this channel has been flushed by a site moderator.";

        message_container.appendChild(message_author);
        message_container.appendChild(message_content);
        message_wrapper.appendChild(message_container);

        main_message_container.prepend(message_wrapper);
    }
});