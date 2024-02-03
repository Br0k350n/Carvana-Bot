"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        // Add other necessary intents here
    ],
});
const mysql = __importStar(require("mysql2/promise"));
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
function generatePlateNumbers(interaction, customPlate) {
    return __awaiter(this, void 0, void 0, function* () {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        if (customPlate) {
            // If a custom plate is provided, check its existence
            const isPlateExists = yield checkPlateExistence(customPlate);
            if (isPlateExists) {
                return interaction.reply(`Custom plate already exists!`);
                ; // Return null to indicate that the plate already exists
            }
            if (customPlate.length >= 8) {
                yield interaction.channel.send(`Custom plate too long!`);
                return null; // Return null to indicate that the plate is too long
            }
            return customPlate; // Return the custom plate
        }
        // If no custom plate is provided, generate a random one
        const plateID = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        // Check if the generated plateNumber already exists in the database
        const isPlateExists = yield checkPlateExistence(plateID);
        // If the plateNumber already exists, recursively call the function to generate a new one
        if (isPlateExists) {
            console.log('Generated plate already exists, regenerating...');
            return generatePlateNumbers(interaction);
        }
        // If the plateNumber is unique, return it as a string
        return plateID;
    });
}
function checkPlateExistence(plateID) {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield dbPool.execute('SELECT COUNT(*) as count FROM player_vehicles WHERE plate = ?', [plateID]);
        return rows[0].count > 0;
    });
}
function addPlateToDatabase(citizenID, vehicle, plateID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Adding plate to database - Citizen ID:", citizenID, "Vehicle:", vehicle, "Plate ID:", plateID);
        const currentDate = new Date().toISOString().slice(0, 10);
        const currentTime = new Date().toISOString().slice(11, 19);
        if (citizenID === undefined || plateID === undefined) {
            console.error('Citizen ID or PlateID is undefined.');
            return; // You may choose to handle this differently based on your requirements
        }
        try {
            // Execute the SQL query
            yield dbPool.execute('INSERT INTO player_vehicles (citizenid, vehicle, plate) VALUES (?, ?, ?)', [citizenID, vehicle, plateID]);
        }
        catch (error) {
            console.error('Error executing SQL query:', error);
        }
    });
}
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('giveimport')
        .setDescription('Give a player an imported vehicle.')
        .addStringOption(option => option.setName('import_id')
        .setDescription('Enter the import ID.')
        .setRequired(true))
        .addStringOption(option => option.setName('citizen_id')
        .setDescription('Enter the citizen ID.')
        .setRequired(true))
        .addStringOption(option => option.setName('cp')
        .setDescription('Enter a custom license plate.')
        .setRequired(false)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const idValue = interaction.options.getString('citizen_id');
            const importId = interaction.options.getString('import_id');
            const isAdmin = interaction.member.roles.cache.some(role => role.name === 'admin');
            const isTester = interaction.member.roles.cache.some(role => role.name === 'tester');
            const license_plate = interaction.options.getString('cp');
            console.log(license_plate);
            if (!isAdmin && !isTester) {
                return interaction.reply('You do not have the necessary role to use this command.');
            }
            try {
                let generatedPlates;
                // Check if the specified ID is in the database
                const query = 'SELECT citizenid FROM players WHERE citizenid = ?';
                const [rows] = yield dbPool.execute(query, [idValue]);
                const import_query = 'SELECT * FROM player_vehicles WHERE id = ?';
                const [importRows] = yield dbPool.execute(import_query, [importId]);
                if (!Array.isArray(rows) || rows.length === 0) {
                    interaction.reply(`The ID ${idValue} is not in the database.`);
                    return;
                }
                if (!Array.isArray(importRows) || importRows.length === 0) {
                    interaction.reply(`The ID ${importId} is not in the database.`);
                    return;
                }
                const foundcitizenId = rows[0].citizenid;
                const foundImportID = importRows[0].id;
                console.log(foundImportID);
                console.log(importId);
                let vehicleName = importRows[0].vehicle;
                if (foundcitizenId !== idValue) {
                    interaction.reply(`The ID ${idValue} is not associated with any citizen.`);
                    return;
                }
                if (String(foundImportID) !== String(importId)) {
                    interaction.reply(`The ID ${foundImportID} is not associated with any imported vehicle, please try again.`);
                    return;
                }
                generatedPlates = yield generatePlateNumbers(interaction, license_plate);
                if (generatedPlates.customPlate === null) {
                    if (generatedPlates === null) {
                        return;
                    }
                    else {
                        generatedPlates = generatePlateNumbers(interaction);
                        return;
                    }
                }
                // Creating a confirmation embed with buttons
                const confirmationEmbed = {
                    color: 0x0099FF,
                    title: 'Confirm Import Order',
                    description: `Do you want to confirm the import order for ${idValue} with license plate ${generatedPlates}?`,
                    fields: [
                        { name: 'License Plate: ', value: generatedPlates || 'N/A' },
                        { name: 'Citizen ID: ', value: foundcitizenId || 'N/A' },
                    ],
                };
                const confirmed = {
                    color: 0x0099FF,
                    title: 'Congratulations!',
                    description: `Successfully issued import order to ${idValue} with license plate ${generatedPlates}.`,
                    fields: [
                        { name: 'License Plate: ', value: generatedPlates || 'N/A' },
                        { name: 'Citizen ID: ', value: foundcitizenId || 'N/A' },
                    ],
                };
                const cancelled = {
                    color: 0x0099FF,
                    title: 'Action Incomplete',
                    description: `Action has been cancelled`
                };
                // Create a row of buttons
                const confirm = new discord_js_1.ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirm Order')
                    .setStyle(discord_js_1.ButtonStyle.Primary);
                const cancel = new discord_js_1.ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(discord_js_1.ButtonStyle.Danger);
                const row = new discord_js_1.ActionRowBuilder()
                    .addComponents(cancel, confirm);
                // Send the confirmation embed with attached buttons
                const response = yield interaction.reply({
                    content: 'Please confirm the import order:',
                    embeds: [confirmationEmbed],
                    components: [row],
                });
                const collectorFilter = i => i.customId == 'confirm' || i.customId == 'cancel';
                const confirmation = yield response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                confirmation.deferUpdate();
                function handleConfirmation(interaction) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (generatedPlates !== null) {
                            yield addPlateToDatabase(foundcitizenId, vehicleName, generatedPlates);
                            yield interaction.channel.send({ embeds: [confirmed] });
                        }
                    });
                }
                function handleCancellation(interaction) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Add your logic for handling cancellation here
                        yield interaction.channel.send({ embeds: [cancelled] });
                    });
                }
                try {
                    if (confirmation.customId === 'confirm') {
                        yield handleConfirmation(interaction);
                    }
                    else if (confirmation.customId === 'cancel') {
                        yield handleCancellation(interaction);
                    }
                }
                catch (e) {
                    if (confirmation.customId === 'cancel') {
                        yield interaction.channel.send({ embeds: [cancelled] });
                    }
                    else {
                        yield confirmation.update({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                        console.error(e);
                    }
                }
            }
            catch (error) {
                console.error(`Error checking database or generating import: `, error);
                interaction.reply(`Error ${error}`);
            }
        });
    },
};
