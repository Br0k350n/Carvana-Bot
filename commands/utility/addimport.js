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
const mysql = __importStar(require("mysql2/promise"));
// Create a Discord client
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds],
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
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function addImportToDatabase(importName, importID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dbPool.execute('INSERT INTO imports (name, importID) VALUES (?, ?)', [importName, importID]);
            console.log(`Import ${importName} with ID ${importID} added to the database.`);
        }
        catch (error) {
            console.error('Error adding import to the database:', error);
        }
    });
}
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('addimport')
        .setDescription('Add a new import to the database.')
        .addStringOption(option => option.setName('import_name')
        .setDescription('Enter the name of the import.')
        .setRequired(true))
        .addStringOption(option => option.setName('import_id')
        .setDescription('Enter the ID of the import.')
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const importName = capitalizeFirstLetter(interaction.options.getString('import_name'));
            const importID = interaction.options.getString('import_id');
            try {
                const importExists = 'SELECT COUNT(*) as count FROM imports WHERE importID = ?';
                const importNameExists = 'SELECT COUNT(*) as count FROM imports WHERE name = ?';
                const [importRows] = yield dbPool.execute(importExists, [importID]);
                const [importNameRows] = yield dbPool.execute(importNameExists, [importName]);
                if (importRows[0].count > 0) {
                    interaction.reply(`Import ID '${importID}' is already in use.`);
                }
                else if (importNameRows[0].count > 0) {
                    interaction.reply(`Import name '${importName}' is already in use.`);
                }
                else {
                    yield addImportToDatabase(importName, importID);
                    interaction.reply(`Import ${importName} with ID ${importID} has been added to the database.`);
                }
            }
            catch (error) {
                console.error('Error in execute function:', error);
                interaction.reply('An error occurred while processing the command.');
            }
        });
    },
};
