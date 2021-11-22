const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require("../globals.js");
const db = require("quick.db");

const data = new SlashCommandBuilder()
    .setName('admin')
    .setDescription("Sets a user\'s admin status.")
    .addStringOption(option => option.setName("id").setDescription("ID of user.").setRequired(true))
    .addBooleanOption(option => option.setName("admin").setDescription("Give or take admin from user.").setRequired(true))
exports.data = data;

exports.execute = async (client, interaction) => {
    let uid = interaction.options.getString("id");
    let choice = interaction.options.getBoolean("admin");

    let fetched = await db.fetch(`user.${uid}`);
    
    if (fetched === null || fetched === undefined) {
        let em = new MessageEmbed()
            .setColor("#eb3434")
            .setTitle("***bulletin not set:***")
            .setDescription("*user not found.*")
        await interaction.reply({ embeds: [em] });
    } else {
        if (choice) {
            fetched.info.is_admin = true;
            if (!fetched.info.roles.includes("admin")) {
                fetched.info.roles.push("admin");
            }
            console.log(fetched.info)
        } else {
            fetched.info.is_admin = false;
            if (fetched.info.roles.includes("admin")) {
                fetched.info.roles.splice(fetched.info.roles.indexOf("admin"), 1);
            }
        }

        await db.set(`user.${uid}`, fetched);

        let em = new MessageEmbed()
            .setColor("#49eb34")
            .setTitle("***changed admin status:***")
            .setDescription(`*user \`${fetched.username}/${fetched.id}\`\nadmin: \`${choice}\`*`)
        await interaction.reply({ embeds: [em] });
    }
}