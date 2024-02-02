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

async function generatePlateNumbers() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const plateNumber = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');

    // Check if the generated plateNumber already exists in the database
    const isPlateExists = await checkPlateExistence(plateNumber);

    // If the plateNumber already exists, recursively call the function to generate a new one
    if (isPlateExists) {
        return generatePlateNumbers();
    }

    // If the plateNumber is unique, return it as an array
    return [plateNumber];
}

async function checkPlateExistence(plateNumber) {
    const [rows] = await dbPool.execute('SELECT COUNT(*) as count FROM license_plates WHERE plate_number = ?', [plateNumber]);
    return rows[0].count > 0;
}

async function addPlateToDatabase(plateNumber, discordId, steamId) {
    await dbPool.execute('INSERT INTO license_plates (plate_number, discordID, steamID) VALUES (?, ?, ?)', [plateNumber, discordId, steamId]);
}


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
        const idValue = interaction.options.getString('id');
        const importId = interaction.options.getString('import_id');

        try {
            // Check if the specified ID is in the database
            const query = 'SELECT discordID, steamID FROM players WHERE discordID = ? OR steamID = ?';
            const [rows] = await dbPool.execute(query, [idValue, idValue]);

            if (!Array.isArray(rows) || rows.length === 0) {
                interaction.reply(`The ID ${idValue} is not in the database.`);
                return;
            }

            const foundDiscordId = (rows[0] as { discordID: string }).discordID;
            const foundSteamID = (rows[0] as { steamID: string }).steamID;

            if (foundDiscordId !== idValue && foundSteamID !== idValue) {
                interaction.reply(`The ID ${idValue} is not associated with the specified Discord or Steam ID.`);
                return;
            }

            const generatedPlates = await generatePlateNumbers();
            await addPlateToDatabase(generatedPlates[0], foundDiscordId, foundSteamID);

            interaction.reply(`Successfully issued import to ${idValue} with license plate ${generatedPlates[0]}.`);

        } catch (error) {
            console.error(`Error checking database or generating import: `, error);
            interaction.reply(`Error processing the import.`);
        }
    },
};