const { SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const mysql = require('mysql2');
require('dotenv').config();
const dbConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME
})


module.exports = {
    data: new SlashCommandBuilder()
            .setName('checkdb')
            .setDescription('Checks if Import Bot is connected to the database.'),
    async execute(interaction) {
        try {
            // Assuming dbConnection is available in this scope
            dbConnection.query('SELECT 1', (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    interaction.reply('Error connecting to the database.');
                } else {
                    interaction.reply('Connected to the database.');
                }
            });
        } catch (error) {
            console.error('Error checking database connection:', error);
            interaction.reply('Error checking database connection.');
        }
    }
};