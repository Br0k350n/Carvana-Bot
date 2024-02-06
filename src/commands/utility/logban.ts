import { SlashCommandBuilder, Client, GatewayIntentBits, ButtonBuilder, ButtonStyle } from 'discord.js';
import * as  mysql from 'mysql2/promise';
import * as fs from 'fs';
require('dotenv').config();
// Create a Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// ... (other configurations, database setup, etc.)

// Define your database connection pool
const dbPool = mysql.createPool({
    // Your database connection details
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


module.exports = {
    data: new SlashCommandBuilder()
        .setName('logban')
        .setDescription('Bans player from your FiveM server.')
        .addStringOption(option =>
            option.setName('citizen_id')
                .setDescription('citizen ID of the player you are attempting to ban.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('steam_id')
                .setDescription('steam ID of the player you are attempting to ban.')
                .setRequired(true))
        .addIntegerOption(option =>
                option.setName('duration')
                    .setDescription('How long (days) the player will be banned for.')
                    .setRequired(true))
        .addStringOption(option =>
                option.setName('reason')
                    .setDescription('The reason for the ban')
                    .setRequired(false)),        
    async execute(interaction) {
        

        try {
                
        } catch (error) {
            console.error('Error in execute function:', error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
