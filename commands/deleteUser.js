const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const data = new SlashCommandBuilder()
    .setName('delete-user')
    .setDescription("Deletes a user from the chat database.")
    .addStringOption(option => option.setName("id").setDescription("Users id. (email without the @)").setRequired(true))
exports.data = data;

exports.execute = async (client, interaction) => {
    let uid = interaction.options.getString("id");
    let fetched = await db.fetch(`user.${uid}`);


    if (fetched === null || fetched === undefined) {
        let em = new MessageEmbed()
            .setColor("#eb3434")
            .setTitle("***failed:***")
            .setDescription("*user does not exist.*")
        await interaction.reply({ embeds: [em] });
    } else {
        await db.delete(`user.${uid}`);
        
        let em = new MessageEmbed()
            .setColor("#49eb34")
            .setTitle("***successfully deleted user:***")
            .setDescription(`*user has been removed from the database.*`)
        await interaction.reply({ embeds: [em] });
    }
}