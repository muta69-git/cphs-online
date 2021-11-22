function removeTags(str) {
    if ((str===null) || (str==='')) {
      return false;
    } else {
      str = str.toString();
      return str.replace(/[^<@](<([^>]+)>)/ig, '');
   }
}

function validURL(str) {
    if (str == "" || str == " " || str == undefined) return null;
    return str;
}

async function req(path = "/", body = {}, json = true) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };

    let res = await fetch(path, options);
    if (json) res = await res.json();
    
    return res;
}

function load_profile(message, array, profile_opened, message_wrapper, message_container, message_author, message_content, main_message_container) {
    profile_opened = false;
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
        // iteration through roles to make span tags

        let profile_container_2 = document.createElement('div');
        profile_container_2.setAttribute('id', 'profile-container-2')
        let pc2_content = document.createElement('p');
        pc2_content.innerHTML = '<p style=\'margin-top: 8px; color: var(--neutral); text-align: center;\'>{placeholder}</span>';

        let profile_container_3 = document.createElement('div');
        profile_container_3.setAttribute('id', 'profile-container-3')
        let pc3_content = document.createElement('p');
        pc3_content.innerHTML = '<p style=\'margin-top: 8px; color: var(--neutral); text-align: center;\'>{placeholder}</span>';

        let profile_container_4 = document.createElement('div');
        profile_container_4.setAttribute('id', 'profile-container-4')
        let pc4_content = document.createElement('p');
        pc4_content.innerHTML = '<p style=\'margin-top: 8px; color: var(--neutral); text-align: center;\'>{placeholder}</span>';

        if (message.author.is_admin) {
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
                
        let message = main_message_container.childNodes.item(array.indexOf(message_wrapper));

        message.innerHTML = '';
        message.appendChild(message_container);
    }
}

export {removeTags, validURL, req, load_profile};