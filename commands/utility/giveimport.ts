import { SlashCommandBuilder, GatewayIntentBits, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } from 'discord.js';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        // Add other necessary intents here
    ],
});
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
    const plateID = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');

    // Check if the generated plateNumber already exists in the database
    const isPlateExists = await checkPlateExistence(plateID);

    // If the plateNumber already exists, recursively call the function to generate a new one
    if (isPlateExists) {
        return generatePlateNumbers();
    }

    // If the plateNumber is unique, return it as an array
    return [plateID];
}

async function checkPlateExistence(plateID) {
    const [rows] = await dbPool.execute('SELECT COUNT(*) as count FROM processed_orders WHERE plateID = ?', [plateID]);
    return rows[0].count > 0;
}

async function addPlateToDatabase(plateID, discordId, steamId) {
    const currentDate = new Date().toISOString().slice(0, 10); 
    const currentTime = new Date().toISOString().slice(11, 19);
    if (discordId === undefined || steamId === undefined) {
        console.error('discordId or steamId is undefined');
        return;  // You may choose to handle this differently based on your requirements
    }

    await dbPool.execute('INSERT INTO processed_orders (plateID, discordID, steamID, order_date, order_time) VALUES (?, ?, ?, ?, ?)', [plateID, discordId, steamId, currentDate, currentTime]);
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
        const isAdmin = interaction.member.roles.cache.some(role => role.name === 'admin');
        const isTester = interaction.member.roles.cache.some(role => role.name === 'tester');

        if (!isAdmin && !isTester) {
            return interaction.reply('You do not have the necessary role to use this command.');
        }

        try {
            // Check if the specified ID is in the database
            const query = 'SELECT discordID, steamID FROM players WHERE discordID = ? OR steamID = ?';
            const [rows] = await dbPool.execute(query, [idValue, idValue]);
            const import_query = 'SELECT importID FROM imports WHERE importID = ?'
            const [importRows] = await dbPool.execute(import_query, [importId]);
            if (!Array.isArray(rows) || rows.length === 0) {
                interaction.reply(`The ID ${idValue} is not in the database.`);
                return;
            }
            if (!Array.isArray(importRows) || importRows.length === 0) {
                interaction.reply(`The ID ${importId} is not in the database.`);
                return;
            }

            const foundDiscordId = (rows[0] as { discordID: string }).discordID;
            const foundSteamID = (rows[0] as { steamID: string }).steamID;
            const foundImportID = (importRows[0] as { importID: string }).importID;

            if (foundDiscordId !== idValue && foundSteamID !== idValue) {
                interaction.reply(`The ID ${idValue} is not associated with the specified Discord or Steam ID.`);
                return;
            }

            if (foundImportID !== importId) {
                interaction.reply(`The ID ${foundImportID} is not associated with any imported vehicle, please try again.`);
                return;
            }

            const generatedPlates = await generatePlateNumbers();

            // Creating a confirmation embed with buttons
            const confirmationEmbed = {
                color: 0x0099FF,
                title: 'Confirm Import Order',
                description: `Do you want to confirm the import order for ${idValue} with license plate ${generatedPlates[0]}?`,
                fields: [
                    { name: 'License Plate: ', value: generatedPlates[0] || 'N/A' },
                    { name: 'Discord ID: ', value: foundDiscordId || 'N/A' },
                    { name: 'Steam ID: ', value: foundSteamID || 'N/A' },
                ],
            };
            const confirmed = {
                color: 0x0099FF,
                title: 'Congratulations!',
                description: `Successfully issued import order to ${idValue} with license plate ${generatedPlates[0]}.`,
                fields: [
                    { name: 'License Plate: ', value: generatedPlates[0] || 'N/A' },
                    { name: 'Discord ID: ', value: foundDiscordId || 'N/A' },
                    { name: 'Steam ID: ', value: foundSteamID || 'N/A' },
                ],
            };
            const cancelled = {
                color: 0x0099FF,
                title: 'Action Incomplete',
                description: `Action has been cancelled`
            };

            // Create a row of buttons
            const confirm: ButtonBuilder = new ButtonBuilder()
			    .setCustomId('confirm')
			    .setLabel('Confirm Order')
			    .setStyle(ButtonStyle.Primary);

		    const cancel: ButtonBuilder = new ButtonBuilder()
			    .setCustomId('cancel')
			    .setLabel('Cancel')
			    .setStyle(ButtonStyle.Danger);

		    const row: ActionRowBuilder = new ActionRowBuilder()
			    .addComponents(cancel, confirm);
            
            // Send the confirmation embed with attached buttons
            const response = await interaction.reply({
                content: 'Please confirm the import order:',
                embeds: [confirmationEmbed],
                components: [row],
            });

            const collectorFilter = i => i.customId == 'confirm' || i.customId == 'cancel';
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000});
            confirmation.deferUpdate();

            async function handleConfirmation(interaction) {
                await addPlateToDatabase(generatedPlates[0], foundDiscordId, foundSteamID);
                await interaction.channel.send({embeds: [confirmed]})
            }
            async function handleCancellation(interaction) {
                // Add your logic for handling cancellation here
                await interaction.channel.send({embeds: [cancelled]})
            }
            try {
                if (confirmation.customId === 'confirm') {
                    await handleConfirmation(interaction);
                } else if (confirmation.customId === 'cancel') {
                    await handleCancellation(interaction);
                } 

            } catch (e) {
                if (confirmation.customId === 'cancel') {
                    await interaction.channel.send({embeds: [cancelled]})   
                }
	            else {
                    await confirmation.update({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                    console.error(e)
                }

            }
        } catch (error) {
            console.error(`Error checking database or generating import: `, error);
            interaction.reply(`Error ${error}`)
        }
    },
};