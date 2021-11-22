// Imports
const db = require("quick.db");

// Constants
const CHANNEL_STORAGE_LIMIT = 200;
const DM_STORAGE_LIMIT = 100;

// Classes
class Channel {
    constructor(name = null, id) {
        (async () => {
            this.name = name;
            this.id = id;

            let fetched_messages = await db.fetch(`channel.${this.id}`);
            
            if (!fetched_messages) {
                fetched_messages = [];
            }
            this.messages = fetched_messages;
        })();
    }

    store(body) {
        (async () => {
            let messages = this.messages;

            if (messages == null || messages == undefined) {
                messages = [];
            }

            if (messages.length < CHANNEL_STORAGE_LIMIT) {
                messages.push(body);
            } else {
                messages.sort((a, b) => {return Date.parse(a.timestamp) > Date.parse(b.timestamp)});
                messages.splice(0, 1);
                messages.push(body);
            }

            await db.set(`channel.${this.id}`, messages);
        })();
    }
}

class User {
    constructor(email, username, password, is_admin = false, roles = []) {
        // Credentials
        this.email = email;
        this.username = username;
        this.password = password;
        this.id = email.replace("@students.cps.k12.in.us", "");

        // Settings.
        let date = new Date();

        this.settings = {theme: 0, bg_url: null};
        this.info = {roles: roles, description: "", is_admin: is_admin, join_date: date.toLocaleString("en-US", {timeZone: "America/New_York"})};
        this.allowed_channels = [0, 1, 2];

        (async () => {
            await db.set(`user.${this.id}`, {email: this.email, username: this.username, password: this.password, id: this.id, settings: this.settings, allowed_channels: this.allowed_channels, info: this.info});
        })();
    }
}

class Member {
    constructor(user = User) {
        this.username = user.username;
        this.id = user.id;
        this.info = user.info;
        this.settings = user.settings;
    }
}

class DM {
    constructor(id, messages) {
        this.id = id;
        this.closed = false;
        
        if (messages === undefined || messages === null) {
            messages = [];
        }

        this.messages = messages;
    }
}

exports.DM = DM;
exports.Channel = Channel;
exports.User = User;
exports.Member = Member;