import { registerMessage } from "./register-messages.js";
import { loadMessages } from "./load-messages.js";
import { current_channel } from "../.utils/globals.js";
import { req } from "../.utils/methods.js";

let main_message_container = document.getElementById('main-message-container');
let d2_container = document.getElementById('d2-container');

const channel_display = document.getElementById('channel-display');
const channel_button_m = document.getElementById('channel-button-m');
const channel_button_0 = document.getElementById('channel-button-0');
const channel_button_1 = document.getElementById('channel-button-1');
const channel_button_2 = document.getElementById('channel-button-2');

channel_button_m.onclick = async () => {
    if (current_channel.id == -1) return;
    current_channel.change(-1);
    let statistics = await req('/get', {type: "object", object: "statistics"});
    let res = await req('/get', {type: 'member', object: 'self'});
    let member = res.member;

    res = await req('/get', {type: 'object', object: 'bulletin'});
    let bulletin = res.bulletin;

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
    document.getElementById('theme-button')
        .onclick = () => {
            const body = document.getElementsByTagName("body")[0];            
        };
    document.getElementById('description-set-button')
        .onclick = async () => {
            await req('/set', {type: 'member', object: 'info', sub: 'description', sub_value: document.getElementById('description-input').value});
        }       
    document.getElementById('description-input')
        .innerHTML = member.info.description;
    document.getElementById('log-out-button')
        .onclick = () => {
            document.cookies = "";
            window.location = '/portal.html';
        }
};

channel_button_0.onclick = () => {
    if (current_channel.id == 0) return;
    current_channel.change(0);
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

    message_send_button.onclick = registerMessage;
    document.onkeydown = registerMessage;;
        
    loadMessages(current_channel.id, main_message_container);
};

channel_button_1.onclick = () => {
    if (current_channel.id == 1) return;
    current_channel.change(1);
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

    message_send_button.onclick = registerMessage;
    document.onkeydown = registerMessage;

    loadMessages(current_channel.id, main_message_container);
};

channel_button_2.onclick = () => {
    if (current_channel.id == 2) return;
    current_channel.change(2);
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

    message_send_button.onclick = registerMessage;
    document.onkeydown = registerMessage;

    loadMessages(current_channel.id, main_message_container);
};