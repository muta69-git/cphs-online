const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require("../globals.js");
const db = require("quick.db");

const data = new SlashCommandBuilder()
    .setName('edit-user')
    .setDescription("Edit\'s user in database.")
    .addStringOption(option => option.setName("id").setDescription("User\'s id.").setRequired(true))
    .addStringOption(option => option.setName("username").setDescription("User\'s username."))
    .addStringOption(option => option.setName("password").setDescription("User\'s password."))
    .addStringOption(option => option.setName("email").setDescription("User\'s email."))
exports.data = data;

exports.execute = async (client, interaction) => {
    let email = interaction.options.getString("email");
    let username = interaction.options.getString("username");
    let password = interaction.options.getString("password");
    let uid = interaction.options.getString("id");
    
    let fetched = await db.fetch(`user.${uid}`);

    if (fetched !== null || fetched !== undefined) {
        if (email) {
            fetched.email = email;
        } else if (username) {
            fetched.username = username;
        } else if (password) {
            fetched.password = password;
        }

        await db.set(`user.${uid}`, fetched);

        let em = new MessageEmbed()
            .setColor("#49eb34")
            .setTitle("***successfully edited user:***")
            .setDescription(`*email - \`${fetched.email}\`\nusername: \`${fetched.username}\`\npassword: \`${fetched.password}\`\nid: \`${uid}\`*`)
        await interaction.reply({ embeds: [em] });
    } else {
        let em = new MessageEmbed()
            .setColor("#eb3434")
            .setTitle("***failed:***")
            .setDescription("*user does not exist in database.*")
        await interaction.reply({ embeds: [em] });
    }
}