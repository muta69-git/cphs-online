import { req } from "./methods.js";

class Message {
    constructor(channel, content, author) {
        let date = new Date();
        date = date.toLocaleString("en-US", {timeZone: "America/New_York"});
        this.author = author.member.member;
        this.content = content;
        this.timestamp = date;
        this.channel = channel;
    }
}

class CurrentChannel {
    constructor() {
        this.id = 0;
    }

    change(num) {
        this.id = num;
    }
}

class CurrentUser {
    constructor() {
        (async () => {
            this.member = await req('/get', {type: 'member', object: 'self'});
        })();
    }
}

export {Message, CurrentChannel, CurrentUser};