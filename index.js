// Module Imports
const express = require("express");
const db = require('quick.db');
const fs = require("fs");
const cookieParser = require("cookie-parser");

// Routers
const accountRouter = require('./routes/account.js');

// Class Imports.
const { Channel, User, Member, DM } = require("./utils/classes.js");
const { Command } = require("./utils/methods.js");
const { Client, Intents, MessageEmbed, Collection } = require("discord.js");

// Global Constants
const ADMIN_CREDENTIALS_1 = process.env.ADMIN_CREDENTIALS_1.split(";");
const ADMIN_CREDENTIALS_2 = process.env.ADMIN_CREDENTIALS_2.split(";");
const DOMAIN = process.env.ACCEPTED_DOMAIN;
const app = express();
const PORT = 3000;

// Predefined Channel Instances.
const GLOBAL_CHAT = new Channel("global", 0);
const CHANNEL_1 = new Channel("channel 1", 1);
const CHANNEL_2 = new Channel("channel 2", 2);
const ADMIN_CHAT = new Channel("admin", 3);

// Predefined User Instances.
const ADMIN_USER_1 = new User(ADMIN_CREDENTIALS_1[0], ADMIN_CREDENTIALS_1[1], ADMIN_CREDENTIALS_1[2], ["owner", "developer", "admin"]);
const ADMIN_USER_2 = new User(ADMIN_CREDENTIALS_2[0], ADMIN_CREDENTIALS_2[1], ADMIN_CREDENTIALS_2[2], ["owner", "developer", "admin"]);

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

// Express app configuration.
app.use(express.static("public"));""
app.use(express.json());
app.use(cookieParser());


// Routers
app.use(accountRouter);

const server = app.listen(PORT, async () => {
    console.clear();
    console.log(`App listening at port ${PORT}.`);
});
const io = require("socket.io")(server);

// Socket connection events.
io.on("connection", socket => {    
    socket.on("message", async data => {
        let msg = data.message;
        if (msg.content.startsWith('/')) return command(msg);
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
app.post("/load-messages", (req, res) => {
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


app.post("/get", async (req, res) => {
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

app.post("/set", async (req, res) => {
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
exports.client = client;
exports.flush_messages = flush_messages;