const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { io, flush_messages } = require("../index.js");
const db = require("quick.db");

const data = new SlashCommandBuilder()
    .setName('clear-channel')
    .setDescription("Clear all messages from specified channel.")
    .addBooleanOption(option => option.setName("global-chat").setDescription("Clear global chat\'s messages."))
    .addBooleanOption(option => option.setName("channel-1").setDescription("Clear channel 1\'s messages."))
    .addBooleanOption(option => option.setName("channel-2").setDescription("Clear channel 2\'s messages."))
exports.data = data;

exports.execute = async (client, interaction) => {
    let option_global = interaction.options.getBoolean("global-chat");
    let option_one = interaction.options.getBoolean("channel-1");
    let option_two = interaction.options.getBoolean("channel-2");

    if (option_global) {
        flush_messages(0);
        await db.set("channel.0", []);
        io.emit("channel-flushed", {channel: 0});
    } else if (option_one) {
        flush_messages(1);
        await db.set("channel.1", []);
        io.emit("channel-flushed", {channel: 1});
    } else if (option_two) {
        flush_messages(2);
        await db.set("channel.2", []);
        io.emit("channel-flushed", {channel: 2});
    }
    

    let em = new MessageEmbed()
        .setColor("#49eb34")
        .setTitle("***successfully cleared channel:***")
        .setDescription("*all messages have been deleted from specified channel.*")
    await interaction.reply({ embeds: [em] });
}