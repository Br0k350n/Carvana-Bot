import { SlashCommandBuilder, Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require('dotenv').config();


module.exports = {
    data: new SlashCommandBuilder()
            .setName('user')
            .setDescription('Looks at user info')
            .addUserOption( option => 
                option
                    .setName('target')
                    .setDescription('The user to get info from.')
                    .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        if (!target) {
            interaction.reply(`Please mention a user.`);
        }

        const userId = target.id;

        interaction.reply(`The Discord ID of ${target} is ${userId}`);
    }
};