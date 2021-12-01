const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require("../utils/classes.js");
const db = require("quick.db");

const data = new SlashCommandBuilder()
    .setName('give-role')
    .setDescription("Gives a user a role.")
    .addStringOption(option => option.setName("id").setDescription("ID of user.").setRequired(true))
    .addStringOption(option => option.setName("role").setDescription("Role name.").setRequired(true))
exports.data = data;

exports.execute = async (client, interaction) => {
    let uid = interaction.options.getString("id");
    let role = interaction.options.getString("role");

    let fetched = await db.fetch(`user.${uid}`);
    
    if (fetched === null || fetched === undefined) {
        let em = new MessageEmbed()
            .setColor("#eb3434")
            .setTitle("***bulletin not set:***")
            .setDescription("*user not found.*")
        await interaction.reply({ embeds: [em] });
    } else {
        if (role == "clr") {
            fetched.info.roles = [];
            role = "cleared all roles."
        } else {
            fetched.info.roles.push(role);
        }
        await db.set(`user.${uid}`, fetched);

        let em = new MessageEmbed()
            .setColor("#49eb34")
            .setTitle("***managed roles:***")
            .setDescription(`*user \`${fetched.username}/${fetched.id}\`\nrole name: \`${role}\`*`)
        await interaction.reply({ embeds: [em] });
    }
}