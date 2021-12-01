const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require("../utils/classes.js");
const db = require("quick.db");

const data = new SlashCommandBuilder()
    .setName('set-bulletin')
    .setDescription("Sets developer bulletin.")
    .addStringOption(option => option.setName("message").setDescription("Message to set bulletin to.").setRequired(true))
exports.data = data;

exports.execute = async (client, interaction) => {
    let message = interaction.options.getString("message");
    
    await db.set("bulletin", message);

    let em = new MessageEmbed()
        .setColor("#49eb34")
        .setTitle("***bulletin set:***")
        .setDescription(`*message: \`${message}\`*`)
    await interaction.reply({ embeds: [em] });
}