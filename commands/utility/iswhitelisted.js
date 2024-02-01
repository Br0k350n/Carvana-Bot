// commands/checkdb.js
const { SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
require('dotenv').config();
const dbPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = {
    data: new SlashCommandBuilder()
    .setName('iswhitelistedb')
    .setDescription('Check if the Discord ID or Steam ID is in the database')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('Enter the Discord or Steam ID')
            .setRequired(true)),
    async execute(interaction) {
        
        const idValue = interaction.options.getString("id");

        try {

            const query = 'SELECT discordID, steamID FROM players WHERE discordID = ? OR steamID = ?';
            const [rows] = await dbPool.execute(query, [idValue, idValue]);

            if (rows.length > 0) {

                const foundDiscordId = rows[0].discordID;
                const foundSteamID = rows[0].steamID;

                if (foundDiscordId === idValue) {
                    interaction.reply(`The Discord ID ${idValue} is in the database.`)
                } else if (foundSteamID === idValue) {
                    interaction.reply(`The Steam ID ${idValue} is in the database.`)
                }

            } else {
                interaction.reply(`The ID ${idValue} is not in the database.`)
            }

        } catch (error) {
            console.error(`Error checking database: `, error);
            interaction.reply(`Error checking the database.`)
        }

       
    },
};