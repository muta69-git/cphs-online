const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { User } = require("../globals.js");
const db = require("quick.db");

const data = new SlashCommandBuilder()
    .setName('get-user')
    .setDescription("Gets user from the database.")
    .addStringOption(option => option.setName("id").setDescription("User\'s ID. (email without @)").setRequired(true))
exports.data = data;

exports.execute = async (client, interaction) => {
    let uid = interaction.options.getString("id");
    
    let fetched = await db.fetch(`user.${uid}`);

    if (fetched !== null && fetched !== undefined) {
        let em = new MessageEmbed()
            .setColor("#FFFFFF")
            .setTitle("***user:***")
            .setDescription(`*email - \`${fetched.email}\`\nusername: \`${fetched.username}\`\npassword: \`${fetched.password}\`\nid: \`${uid}\`*`)
        await interaction.reply({ embeds: [em] });
    } else {
        let em = new MessageEmbed()
            .setColor("#eb3434")
            .setTitle("***failed:***")
            .setDescription("*user doesnt exist.*")
        await interaction.reply({ embeds: [em] });
    }
}