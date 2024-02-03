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

async function addImportToDatabase(importName, importID) {
    try {
        await dbPool.execute('INSERT INTO imports (name, importID) VALUES (?, ?)', [importName, importID]);
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
        const importName = interaction.options.getString('import_name');
        const importID = interaction.options.getString('import_id');

        try {
            await addImportToDatabase(importName, importID);
    
            interaction.reply(`Import ${importName} with ID ${importID} has been added to the database.`);
        } catch (error) {
            console.error('Error in execute function:', error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
