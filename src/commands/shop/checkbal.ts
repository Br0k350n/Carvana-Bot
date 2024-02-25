import { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import * as mysql from 'mysql2/promise';
require('dotenv').config();

const dbPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB3NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkbalance')
        .setDescription('Check your current balance.'),
    async execute(interaction) {
        // Get the user's Discord ID
        const userId:string = interaction.user.id;

        try {
            // Query the database to get the user's balance
            const query = 'SELECT coinAmount FROM users WHERE discord = ?';
            const [rows] = await dbPool.execute(query, [userId]);

            const rowData = rows[0] as { discord?: string };
            
            // Check if the user has a balance record in the database
            if (!rowData) {
                return interaction.reply('You do not have a balance record.');
            }

            // Retrieve the user's balance
            const balance = rows[0].coinAmount;

            // Reply with the user's balance
            interaction.reply(`Your current balance is ${balance} credits.`);
        } catch (error) {
            console.error('Error checking balance:', error);
            interaction.reply('An error occurred while checking your balance.');
        }
    },
};