import { SlashCommandBuilder, Client, GatewayIntentBits, ButtonBuilder, ButtonStyle } from 'discord.js';
import * as  mysql from 'mysql2/promise';

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

function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function addImportToDatabase(importName, importID) {
    try {
        await dbPool.execute('INSERT INTO player_vehicles (vehicle, hash) VALUES (?, ?)', [importName, importID]);
        console.log(`Import ${importName} with ID ${importID} added to the database.`);
    } catch (error) {
        console.error('Error adding import to the database:', error);
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('addimport')
        .setDescription('Add a new import to the database.')
        .addStringOption(option =>
            option.setName('import_name')
                .setDescription('Enter the name of the import.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('import_id')
                .setDescription('Enter the ID of the import.')
                .setRequired(true)),
    async execute(interaction) {
        const importName: string = capitalizeFirstLetter(interaction.options.getString('import_name'));
        const importID = interaction.options.getString('import_id');

        try {
            const importExists = 'SELECT COUNT(*) as count FROM imports WHERE importID = ?'
            const importNameExists = 'SELECT COUNT(*) as count FROM imports WHERE name = ?'
            const [importRows] = await dbPool.execute(importExists, [importID]);
            const [importNameRows] = await dbPool.execute(importNameExists, [importName]);

            if (importRows[0].count > 0) {
                interaction.reply(`Import ID '${importID}' is already in use.`);
            } else if (importNameRows[0].count > 0){
                interaction.reply(`Import name '${importName}' is already in use.`);
            } else {
                await addImportToDatabase(importName, importID);
                interaction.reply(`Import ${importName} with ID ${importID} has been added to the database.`);
            }
        } catch (error) {
            console.error('Error in execute function:', error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
