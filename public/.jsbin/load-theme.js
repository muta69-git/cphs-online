import { req } from "/.jsbin/.utils/methods.js";

(async () => {
    let res = await req("/get", {type: "member", object: "self"});
    let member = res.member;
    console.log(member)

    let body = document.getElementsByTagName('body')[0];

    if (member.settings.theme == 0) {
        body.setAttribute('class', 'dark-theme');
    } else {
        body.setAttribute('class', 'light-theme');
    }
})();