import { req } from "../.utils/methods.js";

async function loadMessages(current_channel, main_message_container) {
    const messages = await req("/load-messages", {channel: current_channel });
    
    if (!(messages.length > 0)) return;

    messages.reverse().forEach(message => {
        let message_wrapper = document.createElement('div');
        let message_container = document.createElement('button');
        let message_author = document.createElement('p');
        message_author.setAttribute('style', 'margin-bottom: 8px;');
        let message_author_span = document.createElement('span');
        let message_content = document.createElement('p');

        message_wrapper.setAttribute('class', 'message-wrapper');
        message_container.setAttribute('class', 'message-container');
    
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

        main_message_container.appendChild(message_wrapper);

        var array = Array.prototype.slice.call(main_message_container.childNodes);
        message_wrapper.setAttribute('id', array.indexOf(message_wrapper));

        let profile_opened = false;
        message_wrapper.onclick = (e) => {
            array = Array.prototype.slice.call(main_message_container.childNodes);

            if (profile_opened == false) {
                profile_opened = true;

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
                console.log(array.indexOf(message_wrapper))
            } else {
                profile_opened = false;
                
                let message = main_message_container.childNodes.item(array.indexOf(message_wrapper));

                let profile_container = message.querySelector("#profile-container");
                message.removeChild(profile_container);
            }
        };
            
        // // background conditional
        // if (!message.bg_url == null || !message.bg_url == '' || !message.bg_url == ' ') { 
        //     msg_container.setAttribute('style', `background: var(--background-transp), url(${message.bg_url}); background-repeat: repeat; background-size: auto 100%;`); 
        // }
    });
}

export {loadMessages};