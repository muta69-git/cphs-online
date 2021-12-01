const express = require('express');
const db = require("quick.db");
const router = express.Router();
const { client } = require('../index.js');


const DOMAIN = process.env.ACCEPTED_DOMAIN;

router
    .post("/account/login", async (req, res) => {
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
    })

    .post("/account/signup", async (req, res) => {
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

                res.status(200).json({"accepted": true});
            } else {
                return res.status(200).json({"accepted": false, "reason": "Email address already in use."});
            }
        } else {
            return res.status(200).json({"accepted": false, "reason": "Invalid email address."});
        }
    });
module.exports = router;