const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require("../utils/classes.js");
const db = require("quick.db");

const data = new SlashCommandBuilder()
    .setName('create-user')
    .setDescription("Creates a user in the database.")
    .addStringOption(option => option.setName("email").setDescription("User\'s email address.").setRequired(true))
    .addStringOption(option => option.setName("username").setDescription("User\'s username.").setRequired(true))
    .addStringOption(option => option.setName("password").setDescription("User\'s password.").setRequired(true))
exports.data = data;

async function denyRequest(interaction) {
    await interaction.reply({ content: "Error, you have provided invalid input for one or more of the required arguments, please check all entered args, then try again."});
}

exports.execute = async (client, interaction) => {
    let email = interaction.options.getString("email");
    let username = interaction.options.getString("username");
    let password = interaction.options.getString("password");
    let uid = email.replace(process.env.ACCEPTED_DOMAIN, "");
    
    let fetched = await db.fetch(`user.${uid}`);

    if (fetched === null || fetched === undefined) {
        if (email === null || email == undefined || email === "" || email === " ") {
            return denyRequest(interaction);
        } else if (username === null || username === undefined || username === "" || username === " ") {
            return denyRequest(interaction);
        } else if (password === null || password === undefined || password === "" || password === " ") {
            return denyRequest(interaction);
        } else if (uid === null || uid === undefined || uid === "" || uid === " ") {
            return denyRequest(interaction);
        }
        let user = new User(email, username, password, false);

        let em = new MessageEmbed()
            .setColor("#49eb34")
            .setTitle("***successfully created user:***")
            .setDescription(`*email - \`${email}\`\nusername: \`${username}\`\npassword: \`${password}\`\nid: \`${uid}\`*`)
        await interaction.reply({ embeds: [em] });
    } else {
        let em = new MessageEmbed()
            .setColor("#eb3434")
            .setTitle("***failed:***")
            .setDescription("*user already exists in database.*")
        await interaction.reply({ embeds: [em] });
    }
}