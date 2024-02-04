import { SlashCommandBuilder, Client, GatewayIntentBits, ButtonBuilder, ButtonStyle } from 'discord.js';
import * as  mysql from 'mysql2/promise';
import * as fs from 'fs';

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
    database: process.env.DB2NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

function formatString(template: string, ...values: string[]): string {
    let result = template;
    values.forEach((value, index) => {
      result = result.replace(`%s`, value);
    });
    return result;
  }

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function addImportToVehicleLua(import_id: string, import_name: string, import_make: string, import_cat: string) {
    let import_price: number = 0;
    // let importData = `model = '${import_id}', name = '${import_name}', brand = '${import_make}', price = ${import_price}, category = '${import_cat}', type = '${import_cat}', shop = 'none'`;

    let impData = "{ model = '%s',name = '%s',brand = '%s', price = 0,  category = '%s', type = '%s', shop = 'none' },";

    let exportVehicleData = formatString(impData, import_id, import_name, import_make,import_cat,import_cat);

    console.log(exportVehicleData);

    try {
        let fileContent = fs.readFileSync('./vehicles.lua', 'utf-8').toString();

        const importIndex = fileContent.indexOf('--Imports');

        if (importIndex !== -1) {
            const isNewlineAfterComment = fileContent[importIndex + '--Imports'.length].toString() === '\n';
            fileContent =
                fileContent.slice(0, importIndex + '--Imports'.length + (isNewlineAfterComment ? 1 : 0)) +
                `\n\t${exportVehicleData}` +
                fileContent.slice(importIndex + '--Imports'.length + (isNewlineAfterComment ? 1 : 0));
            fs.writeFileSync('./vehicles.lua', fileContent);
            // fs.writeFileSync('./vehicles.lua', exportVehicleData);
            console.log(`Import ${import_name} with ID ${import_id} added to the vehicles.lua file.`);
        }
    } catch (error) {
        console.error('Error adding import to the vehicles.lua:', error);
    }
}

async function addImportToDatabase(import_id: string, import_name: string) {
    try {
        await dbPool.execute('INSERT INTO vehicles (vehicle, spawnid) VALUES (?, ?)',[import_name, import_id]);
        
    } catch (error) {
        console.error('Error executing SQL query:', error);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addimport')
        .setDescription('Add a new import to the database.')
        .addStringOption(option =>
            option.setName('import_id')
                .setDescription('Enter the name of the import.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('import_name')
                .setDescription('Enter the ID of the import.')
                .setRequired(true))
        .addStringOption(option =>
                option.setName('import_make')
                    .setDescription('Enter the name of the import.')
                    .setRequired(true))
        .addStringOption(option =>
                option.setName('import_cat')
                    .setDescription('Enter the ID of the import.')
                    .setRequired(true)),        
    async execute(interaction) {
        const import_name: string = interaction.options.getString('import_name').toLowerCase();
        const import_id = interaction.options.getString('import_id').toLowerCase();
        const import_make = interaction.options.getString('import_make').toLowerCase();
        const import_cat = interaction.options.getString('import_cat').toLowerCase();

        try {
                await addImportToVehicleLua(import_id, import_name, import_make, import_cat);
                await addImportToDatabase(import_id, import_name)
                interaction.reply(`Import ${import_name} with ID ${import_id} has been added to the vehicles.lua file and database.`);
        } catch (error) {
            console.error('Error in execute function:', error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
