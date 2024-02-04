import { SlashCommandBuilder, GatewayIntentBits, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import {google, sheets_v4 } from 'googleapis';
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

const checkDiscordUser = async (userId: string) => {
    try {
      const user = await client.users.fetch(userId);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
  };
  
async function addDataToSheet(name: string, discordUser: string, license: string, citizenid: string, vehicle: string, plateID: string) {
    const range = 'orders'; 
    const sheet = google.sheets('v4');
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toISOString().slice(11, 19);

    const values = [[name, discordUser, license, citizenid, vehicle, plateID, currentDate, currentTime]];
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

async function generatePlateNumbers(interaction, customPlate?: string) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    if (customPlate) {
        const isPlateExists = await checkPlateExistence(customPlate);

        if (isPlateExists) {
            await interaction.reply(`Custom plate already exists!`);
            return null;
        }

        if (customPlate.length >= 8) {
            await interaction.reply(`Custom plate too long!`);
            return null;
        }
        if (5 >= customPlate.length) {
            await interaction.reply(`Custom plate too short!`);
            return null;
        }

        return customPlate;
    }

    // If no custom plate is provided, generate a random one
    let plateID
    let isPlateExists

    for (let i = 0; i < 10; i++) {
        plateID = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
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

async function addPlateToDatabase(name, discordUser, license, citizenid, vehicle, plateID) {
    if (citizenid === undefined || plateID === undefined) {
        console.error('Citizen ID or PlateID is undefined.');
        return;  // You may choose to handle this differently based on your requirements
    }
    try {
        await dbPool.execute('INSERT INTO player_vehicles (citizenid, vehicle, plate) VALUES (?, ?, ?)', [citizenid, vehicle, plateID]);
        await addDataToSheet(name, discordUser, license, citizenid, vehicle, plateID);
    } catch (error) {
        console.error('Error executing SQL query:', error);
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveimport')
        .setDescription('Give a player an imported vehicle.')
        .addStringOption(option =>
            option.setName('discord_id')
                    .setDescription(`Enter the citizen's Discord ID.`)
                    .setRequired(true))
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
        const discordId = interaction.options.getString('discord_id');
        const discordUser = await checkDiscordUser(discordId);
        const idValue = interaction.options.getInteger('cid');
        const importId = interaction.options.getString('import_id');
        const isAdmin = interaction.member.roles.cache.some(role => role.name === 'admin');
        const isTester = interaction.member.roles.cache.some(role => role.name === 'tester');
        const license_plate = interaction.options.getString('cp');
        if (!isAdmin && !isTester) {
            return interaction.reply('You do not have the necessary role to use this command.');
        }

        try {
            let generatedPlates;
            // Check if the specified ID is in the database
            const query = 'SELECT * FROM players WHERE cid = ?';
            const [rows] = await dbPool.execute(query, [idValue]);
            const import_query = 'SELECT * FROM player_vehicles WHERE id = ?'
            const [importRows] = await dbPool.execute(import_query, [importId]);

            if (!Array.isArray(rows) || rows.length === 0) {
                interaction.reply(`The ID ${idValue} is not in the database.`);
                return;
            }
            if (!Array.isArray(importRows) || importRows.length === 0) {
                interaction.reply(`The ID ${importId} is not in the database.`);
                return;
            }

            const foundcid = (rows[0] as { cid: string }).cid;
            const foundcitizenId = (rows[0] as { citizenid: string }).citizenid;
            const citizenLicense = (rows[0] as { license: string }).license;
            const foundName = (rows[0] as { name: string }).name;
            const foundImportID = (importRows[0] as { id: string }).id;
            let vehicleName = (importRows[0] as { vehicle: string }).vehicle;
            if (foundcid !== idValue) {
                interaction.reply(`The ID ${idValue} is not associated with any citizen.`);
                return;
            }

            if (String(foundImportID) !== String(importId)) {
                interaction.reply(`The ID ${foundImportID} is not associated with any imported vehicle, please try again.`);
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

            if (!discordUser) {

                return interaction.reply('Invalid Discord user ID.');
            }


            const confirmationEmbed = new EmbedBuilder() 
                .setColor(0x0099FF)
                .setTitle('Confirm Import Order')
                .setDescription(`Do you want to confirm the import order for ${idValue} with license plate ${generatedPlates}?`)
                .addFields(
                    { name: 'Discord User: ', value: discordUser.tag || 'N/A' },
                    { name: 'Citizen Name: ', value: foundName || 'N/A' },
                    { name: 'License Plate: ', value: generatedPlates || 'N/A' },
                    { name: 'Citizen ID: ', value: foundcitizenId || 'N/A' },
                    { name: 'Citizen Game License: ', value: citizenLicense || 'N/A' },
                )
                .setThumbnail(`https://cdn0.iconfinder.com/data/icons/cars-c/512/Car1-1024.png`);
            const confirmed = new EmbedBuilder()
                .setColor('#57F287')
                .setTitle('Congratulations!')
                .setDescription(`Successfully issued import order to ${idValue} with license plate ${generatedPlates}.`)
                .addFields(
                    { name: 'Discord User: ', value: discordUser.tag || 'N/A' },
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
                    { name: 'Discord User: ', value: discordUser.tag || 'N/A' },
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
                    await addPlateToDatabase(foundName, discordUser.tag, citizenLicense, foundcitizenId, vehicleName, generatedPlates);
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
            console.error(`Error checking database or generating import: `, error);
            interaction.reply(`Error ${error}`)
        }
    },
};