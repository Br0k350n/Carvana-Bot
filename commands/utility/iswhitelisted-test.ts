// commands/checkdb.js
import { SlashCommandBuilder } from 'discord.js';
import * as mysql from 'mysql2/promise';
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
    .setName('giveimport')
    .setDescription('Give a player an imported vehicle.')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('Enter the Discord or Steam ID')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('import_id')
                .setDescription('Enter the import ID.')
                .setRequired(true)),
    async execute(interaction) {
        
        const idValue = interaction.options.getString("id");

        try {

            const query = 'SELECT discordID, steamID FROM players WHERE discordID = ? OR steamID = ?';
            const [rows] = await dbPool.execute(query, [idValue, idValue]);

            if (Array.isArray(rows) && rows.length > 0) {

                const foundDiscordId = (rows[0] as { discordID: string }).discordID;
                const foundSteamID = (rows[0] as { steamID: string }).steamID;

                if (foundDiscordId === idValue) {
                    interaction.reply(`The Discord ID "${idValue}" is in the database.`)
                } else if (foundSteamID === idValue) {
                    interaction.reply(`The Steam ID "STEAM_0:1:${idValue}" is in the database.`)
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