import { SlashCommandBuilder, GatewayIntentBits, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import { google } from 'googleapis';
import * as mysql from 'mysql2/promise';
import { token } from '../../../dist/config.json';
require('dotenv').config();
import * as fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf-8'));
const spreadsheetId = process.env.SHEET_ID;

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


const client = new Client({
    
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
    
});
client.login(token);
  
async function addDataToSheet(name: string, license: string, citizenid: string, vehicle: string, plateID: string) {
    const range = 'orders'; 
    const sheet = google.sheets('v4');
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toISOString().slice(11, 19);

    const values = [[name, license, citizenid, vehicle, plateID, currentDate, currentTime]];
    await sheet.spreadsheets.values.append({
        spreadsheetId,
        auth,
        range,
        valueInputOption: "RAW",
        requestBody: {
            values: values
        }
    })

}


const dbPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const dbPool2 = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB2NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function generatePlateNumbers(interaction, customPlate?: string) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    if (customPlate) {
        const isPlateExists = await checkPlateExistence(customPlate);

        if (isPlateExists) {
            await interaction.reply(`Custom plate already exists!`);
            return null;
        }

        if (customPlate.length >= 9) {
            await interaction.reply(`Custom plate too long!`);
            return null;
        }
        if (customPlate.length < 1 ) {
            await interaction.reply(`Custom plate too short!`);
            return null;
        }

        return customPlate;
    }

    // If no custom plate is provided, generate a random one
    let plateID
    let isPlateExists

    for (let i = 0; i < 10; i++) {
        plateID = Array.from({ length: 8 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        isPlateExists = await checkPlateExistence(plateID);
        if (!isPlateExists) {
            break;
        }
    }
    if (isPlateExists) {
        await interaction.reply('Unable to generate a unique plate. Please try again.');
        return null;
    }
    return plateID; // Return the generated plate
}

async function checkPlateExistence(plateID) {
    const [rows] = await dbPool.execute('SELECT COUNT(*) as count FROM player_vehicles WHERE plate = ?', [plateID]);
    return rows[0].count > 0;
}

async function addPlateToDatabase(name, license, citizenid, vehicle, spawnid, plateID) {
    if (citizenid === undefined || plateID === undefined) {
        console.error('Citizen ID or PlateID is undefined.');
        return;  // You may choose to handle this differently based on your requirements
    }
    try {
        await dbPool.execute('INSERT INTO player_vehicles (citizenid, vehicle, plate) VALUES (?, ?, ?)', [citizenid, vehicle, plateID]);
        await addDataToSheet(name, license, citizenid, vehicle, plateID);
        await processOrder(name, license, citizenid, vehicle, spawnid, plateID);
    } catch (error) {
        console.error('Error executing SQL query:', error);
    }
}

async function processOrder(name: string, license: string, citizenid: string, vehicle: string, spawnid: string, plateID: string) {
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toISOString().slice(11, 19);
    
    try {
        const result = await dbPool2.execute('INSERT INTO processed_orders (name, license, citizenid, vehicle, spawnid, plate, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',[name, license, citizenid, vehicle, spawnid, plateID, currentDate, currentTime]);
        console.log('insertion result: ', result)
    } catch (error) {
        console.error('Error executing SQL query:', error);
    }


}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveimport')
        .setDescription('Give a player an imported vehicle.')
        // .addStringOption(option =>
        //     option.setName('discord_id')
        //             .setDescription(`Enter the citizen's Discord ID.`)
        //             .setRequired(true))
        .addIntegerOption(option =>
                option.setName('cid')
                    .setDescription(`Enter the citizen's "Lucky Numbers". `)
                    .setRequired(true))
        .addStringOption(option =>
                option.setName('import_id')
                    .setDescription('Enter the import ID.')
                    .setRequired(true))
        .addStringOption(option =>
                option.setName('cp')
                    .setDescription('Enter a custom license plate.')
                    .setRequired(false)),
    async execute(interaction) {
        // const discordId = interaction.options.getString('discord_id');
        // const discordUser = await checkDiscordUser(discordId);
        const idValue = interaction.options.getInteger('cid');
        const importId = interaction.options.getString('import_id').toLowerCase();
        const allowedRoles = JSON.parse(process.env.ALLOWED_ROLES);
        const license_plate = interaction.options.getString('cp');
        const hasAllowedRole = interaction.member.roles.cache.some(role => allowedRoles.includes(role.name.toLowerCase()));
        if (!hasAllowedRole) {
            return interaction.reply('You do not have the necessary role to use this command.');
        }

        try {

            let generatedPlates;
            // Check if the specified ID is in the database
            const query = 'SELECT * FROM players WHERE cid = ?';
            const importQuery = 'SELECT * FROM vehicles WHERE spawnid = ?';
            const [rows] = await dbPool.execute(query, [idValue]);
            const [importRows] = await dbPool2.execute(importQuery, [importId]);

            const rowData = rows[0] as { cid?: string };
            const importData = importRows[0] as { spawnid?: string; vehicle?: string };

            if (!importData || !importData.spawnid) {
                interaction.reply(`No vehicle with the spawnid of "${importId}" is in the database.`);
                return;
            }
            if (!rowData || !rowData.cid) {
                interaction.reply(`No citizen found with CID: ${idValue}`);
                return;
            }

            const foundImportID = importData.spawnid;
            let vehicleName = importData.vehicle;

            const foundcid = rowData.cid;
            const foundcitizenId = (rows[0] as { citizenid: string }).citizenid;
            const citizenLicense = (rows[0] as { license: string }).license;
            const foundName = (rows[0] as { name: string }).name;


            
            if (foundImportID !== importId.toLowerCase()) {
                interaction.reply(`The ID ${foundImportID} is not associated with any imported vehicle, please try again.`);
                return;
            }

            if (foundcid !== idValue) {
                interaction.reply(`The ID ${idValue} is not associated with any citizen.`);
                return;
            }

            generatedPlates = await generatePlateNumbers(interaction, license_plate);

            if (generatedPlates === null) {
                return;
            }
            
            if (generatedPlates.customPlate === null) {
                generatedPlates = generatePlateNumbers(interaction);
                return;
            }



            // if (!discordUser) {

            //     return interaction.reply('Invalid Discord user ID.');
            // }


            const confirmationEmbed = new EmbedBuilder() 
                .setColor(0x0099FF)
                .setTitle('Confirm Import Order')
                .setDescription(`Do you want to confirm the import order for ${foundName} (cid: ${foundcid}) with license plate ${generatedPlates}?`)
                .addFields(
                    // { name: 'Discord User: ', value: discordUser.tag || 'N/A' },
                    { name: 'Citizen Name: ', value: foundName || 'N/A' },
                    { name: 'License Plate: ', value: generatedPlates || 'N/A' },
                    { name: 'Citizen ID: ', value: foundcitizenId || 'N/A' },
                    { name: 'Citizen Game License: ', value: citizenLicense || 'N/A' },
                )
                .setThumbnail(`https://cdn0.iconfinder.com/data/icons/cars-c/512/Car1-1024.png`);
            const confirmed = new EmbedBuilder()
                .setColor('#57F287')
                .setTitle('Congratulations!')
                .setDescription(`Successfully issued import order to ${foundName} with license plate ${generatedPlates}.`)
                .addFields(
                    // { name: 'Discord User: ', value: discordUser.tag || 'N/A' },
                    { name: 'Citizen Name: ', value: foundName || 'N/A' },
                    { name: 'License Plate: ', value: generatedPlates || 'N/A' },
                    { name: 'Citizen ID: ', value: foundcitizenId || 'N/A' },
                    { name: 'Citizen Game License: ', value: citizenLicense || 'N/A' },
                )
                .setThumbnail(`https://cdn0.iconfinder.com/data/icons/cars-c/512/Car1-1024.png`);
            const cancelled = new EmbedBuilder() 
                .setColor('#E67E22')
                .setTitle('Action Incomplete')
                .setDescription(`Action has been cancelled`)
                .addFields(
                    // { name: 'Discord User: ', value: discordUser.tag || 'N/A' },
                    { name: 'Citizen Name: ', value: foundName || 'N/A' },
                    { name: 'License Plate: ', value: generatedPlates || 'N/A' },
                    { name: 'Citizen ID: ', value: foundcitizenId || 'N/A' },
                    { name: 'Citizen Game License: ', value: citizenLicense || 'N/A' },
                )
                .setThumbnail(`https://cdn0.iconfinder.com/data/icons/cars-c/512/Car1-1024.png`);
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
            const response = await interaction.reply({
                content: 'Please confirm the import order:',
                embeds: [confirmationEmbed],
                components: [row],
            });

            const collectorFilter = i => i.customId == 'confirm' || i.customId == 'cancel';
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000});
            confirmation.deferUpdate();
            async function handleConfirmation(interaction) {
                if (generatedPlates !== null) {
                    await addPlateToDatabase(foundName, citizenLicense, foundcitizenId, vehicleName,importId, generatedPlates);
                    await interaction.channel.send({ embeds: [confirmed] })
                }
            }
            async function handleCancellation(interaction) {
                // Add your logic for handling cancellation here
                await interaction.channel.send({embeds: [cancelled]})
            }
            try {
                if (confirmation?.customId === 'confirm') {
                    await handleConfirmation(interaction);
                } else if (confirmation.customId === 'cancel') {
                    await handleCancellation(interaction);
                } 

            } catch (e) {
                if (confirmation?.customId === 'cancel') {
                    await interaction.channel.send({embeds: [cancelled]})   
                }
	            else {
                    await confirmation.update({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                }

            }
        } catch (error) {
            if (error.code === 'InteractionCollectorError') {
                // Handle inactivity timeout
                await interaction.followUp({ content: 'Confirmation not received within 1 minute, action cancelled', components: [] });
            } else {
                // Handle other errors
                console.error('Error during interaction:', error);
            }
        }
    },
};