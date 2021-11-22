// Module Imports 
const express = require("express");
const db = require('quick.db');
const fs = require("fs");
const cookieParser = require("cookie-parser");

// Class Imports.
const { Channel, User, Member, DM } = require("./globals.js");
const { Client, Intents, Interactions, MessageEmbed, Collection } = require("discord.js");

// Global Constants
const ADMIN_CREDENTIALS = process.env.ADMIN_CREDENTIALS.split(";");
const RY_CREDENTIALS = process.env.RY_CREDENTIALS.split(";");
const DOMAIN = process.env.ACCEPTED_DOMAIN;
const APP = express();
const PORT = 3000;

// Predefined Channel Instances.
const CHANNEL_2 = new Channel("channel 2", 2);
const CHANNEL_1 = new Channel("channel 1", 1);
const GLOBAL_CHAT = new Channel("global", 0);

// Predefined User Instances.
const ADMIN_USER = new User(ADMIN_CREDENTIALS[0], ADMIN_CREDENTIALS[1], ADMIN_CREDENTIALS[2], true, ["owner", "developer", "admin"]);
const RY_USER = new User(RY_CREDENTIALS[0], RY_CREDENTIALS[1], RY_CREDENTIALS[2], true, ["owner", "developer", "admin"]);

// Process events.
process.on("uncaughtException", err => {
    console.error(err);
});


// Discord Client.
let client = new Client({
    presence: {
        status: 'dnd',
        activities: [{
            name: "sign up requests.",
            type: "WATCHING"
        }]
    }, 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
});

client.commands = new Collection();


function flush_messages(channel_num) {
    if (channel_num == 0) {
        GLOBAL_CHAT.messages = [];
    } else if (channel_num == 1) {
        CHANNEL_1.messages = [];
    } else if (channel_num == 2) {
        CHANNEL_2.messages = [];
    }
}

// Discord Client events.
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}.`);
    fs.readdirSync("./commands").forEach(file => {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    });
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    if (!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);

    try {
		await command.execute(client, interaction);
	} catch (error) {
        console.error(error);
		await interaction.reply({ content: `There was an error while executing this command!\n\n${error}`, ephemeral: true });
	}
});

// Express APP configuration.
APP.use(express.static('public'));
APP.use(express.json());
APP.use(cookieParser());

const server = APP.listen(PORT, async () => {
    console.clear();
    console.log(`App listening at port ${PORT}.`);
});
const io = require("socket.io")(server);

// Socket connection events.
io.on("connection", socket => {    
    socket.on("message", data => {
        let msg = data.message;
        if (!msg.content) return;

        io.emit("message", {message: msg});

        // Hardwired channel Message Storage.
        switch(msg.channel.id) {
            case 0:
                GLOBAL_CHAT.store(msg);
            break;

            case 1:
                CHANNEL_1.store(msg);
            break;

            case 2:
                CHANNEL_2.store(msg);
            break;
        }
    });
});

// Messages.
APP.post("/load-messages", (req, res) => {
    let body = req.body;

    // Hardwired channels.
    switch(body.channel) {
        case 0:
            res.json(GLOBAL_CHAT.messages);
        break;

        case 1:
            res.json(CHANNEL_1.messages);
        break;

        case 2:
            res.json(CHANNEL_2.messages);
        break;
    }
});

// Essentials
APP.post("/login", async (req, res) => {
    const body = req.body;

    if (body.usercookie) {
        const cookies = req.cookies;
        const credentials = JSON.parse(cookies["login-credentials"]);

        let fetched = await db.fetch(`user.${credentials.id}`);

        if (fetched === null || fetched === undefined) {
            return res.status(200).json({"accepted": false, "reason": "Invalid cookie."});
        } else if (fetched.email == credentials.email && fetched.password == credentials.password) {
            return res.status(200).json({"accepted": true});
        } else {
            return res.status(200).json({"accepted": false, "reason": "Invalid cookie."});
        }
    } else {
        let fetched = await db.fetch(`user.${body.email.replace(DOMAIN, "")}`);
        if (fetched == null || fetched == undefined) return res.status(200).json({"accepted": false, "reason": "Entered credentials are not valid."});

        res.cookie("login-credentials", JSON.stringify({username: body.username, email: body.email, password: body.password, id: fetched.id}));
        res.status(200).json({"accepted": true});
    }
});

APP.post("/signup", async (req, res) => {
    let body = req.body;

    if (body.email.endsWith(DOMAIN)) {
        let uid = body.email.replace(DOMAIN, "");
        let fetched = await db.fetch(`users.${uid}`);

        if (fetched === null || fetched === undefined) {
            let discord_guild = process.env.DISCORD_GUILD.split(";");

            let guild_id = discord_guild[0];
            let channel_id = discord_guild[1];

            let guild = await client.guilds.fetch(guild_id);
            let channel = await guild.channels.fetch(channel_id);

            let em = new MessageEmbed()
                .setColor("#FFFFFF")
                .setTitle("***signup request:***")
                .setDescription(`*email - \`${body.email}\`\nusername: \`${body.username}\`\npassword: \`${body.password}\`\nid: \`${body.email.replace(DOMAIN, "")}\`*`)
            await channel.send({ embeds: [em] });
            res.status(200).json({"accepted": false, "reason": "Thank you! Site moderators will review and accept/deny your request shortly."});
        } else {
            return res.status(200).json({"accepted": false, "reason": "Email address already in use."});
        }
    } else {
        return res.status(200).json({"accepted": false, "reason": "Invalid email address."});
    }
});

APP.post("/get", async (req, res) => {
    let body = req.body;
    if (body.type == "credentials") {
        switch(body.object) {
            case "user":
                const cookie = req.cookies;
                const credentials = JSON.parse(cookie["login-credentials"]);

                let fetched = await db.fetch(`user.${credentials.id}`);

                res.status(200).json({fetched});
            break;
        }
    } else if (body.type == "object") {
        switch(body.object) {
            case "channel":
                if (body.sub === null || body.sub === undefined) {
                    res.status(200).json({Channel});
                } else {
                    if (body.sub == 0) {
                        res.status(200).json({channel: {name: GLOBAL_CHAT.name, id: GLOBAL_CHAT.id}});
                    } else if (body.sub == 1) {
                        res.status(200).json({channel: {name: CHANNEL_1.name, id: CHANNEL_1.id}});
                    } else if (body.sub == 2) {
                        res.status(200).json({channel: {name: CHANNEL_2.name, id: CHANNEL_2.id}});
                    }
                }
            break;

            case "statistics":
                let users = await db.fetch("user");
                let user_count = Object.keys(users).length;
                let message_count = GLOBAL_CHAT.messages.length + CHANNEL_1.messages.length + CHANNEL_2.messages.length;

                res.status(200).json({users: user_count, messages: message_count});
            break;

            case "bulletin":
                let message = await db.fetch("bulletin");
                res.status(200).json({bulletin: message});
            break;

            case "user":
                res.status(200).json({User});
            break;

            case "member":
                res.status(200).json({Member});
            break;
        }
    } else if (body.type == "user") {
        let fetched = await db.fetch(`user.${body.uid}`);
        let member = new Member(fetched);
        
        return res.status(200).json({member});
    } else if (body.type == "member") {
        if (body.object == "self") {
            const cookie = req.cookies;
            const credentials = JSON.parse(cookie["login-credentials"]);
            let fetched = await db.fetch(`user.${credentials.id}`);
            let member = new Member(fetched);
            
            res.status(200).json({member});
        } else if (body.object == "other") {
            
        }
    }
});

APP.post("/set", async (req, res) => {
    let body = req.body;
    const cookie = req.cookies;
    const credentials = JSON.parse(cookie["login-credentials"]);

    if (body.type == "member") {
        if (body.object == "settings") {
            if (body.sub == "theme") {
                let fetched = await db.fetch(`user.${credentials.id}`);

                fetched.settings.theme = body.sub_value;
                await db.set(`user.${credentials.id}`, fetched);
            }
        } else if (body.object == "info") {
            if (body.sub == "description") {
                let fetched = await db.fetch(`user.${credentials.id}`);

                fetched.info.description = body.sub_value;
                await db.set(`user.${credentials.id}`, fetched);
            }
        }
    }
});

client.login(process.env.TOKEN);

exports.io = io;
exports.flush_messages = flush_messages;