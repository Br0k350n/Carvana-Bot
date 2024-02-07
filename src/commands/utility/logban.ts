import { SlashCommandBuilder, Client, GatewayIntentBits, } from 'discord.js';
import * as  mysql from 'mysql2/promise';
import * as fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

async function executeLuaScript(luaScriptPath: string, ...args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Spawn a child process to execute the Lua script
        const luaProcess = spawn('luvit', [luaScriptPath, ...args]);

        // Handle stdout and stderr of the child process
        luaProcess.stdout.on('data', (data) => {
            console.log(`Lua script output: ${data}`);
        });

        luaProcess.stderr.on('data', (data) => {
            console.error(`Error executing Lua script: ${data}`);
            reject(new Error(`Error executing Lua script: ${data}`));
        });

        // Handle completion of the child process
        luaProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Lua script executed successfully.');
                resolve();
            } else {
                console.error(`Lua script execution failed with code ${code}`);
                reject(new Error(`Lua script execution failed with code ${code}`));
            }
        });
    });
}

require('dotenv').config();
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

async function sendToDiscord(color: number, name: string, message: string, footer: string): Promise<void> {
    const luaScriptPath = path.join(__dirname, '..', '..', 'lua_script', 'playerInfo_carvana.lua');
    try {
        await executeLuaScript(luaScriptPath, color.toString(), name, message, footer);
        console.log('Data sent to Discord successfully.');
    } catch (error) {
        console.error('Error sending data to Discord:', error);
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('logban')
        .setDescription('Bans player from your FiveM server.')
        .addStringOption(option =>
            option.setName('citizen_id')
                .setDescription('citizen ID of the player you are attempting to ban.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('steam_id')
                .setDescription('steam ID of the player you are attempting to ban.')
                .setRequired(true))
        .addIntegerOption(option =>
                option.setName('duration')
                    .setDescription('How long (days) the player will be banned for.')
                    .setRequired(true))
        .addStringOption(option =>
                option.setName('reason')
                    .setDescription('The reason for the ban')
                    .setRequired(false)),        
    async execute(interaction) {
        

        try {
            const cid = interaction.options.getString('cid');
            const duration = interaction.options.getString('duration');
            const reason = interaction.options.getString('reason');

            const [rows] = await dbPool.execute('SELECT * FROM players WHERE cid = ?', [cid]);
            const rowData = rows[0] as { cid?: string };

            if (!rowData || !rowData.cid) {
                interaction.reply(`No citizen found with CID: ${cid}`);
                return;
            }

            // Here you can call your Lua script to perform the ban
            // You may need to adjust this code based on how you invoke Lua scripts in your application
            const luaScriptPath = `${process.env.playinfoPath}playerInfo.lua`; // Path to your Lua script
            // Execute the Lua script passing necessary parameters (e.g., player CID, duration, reason)
            // Example: executeLuaScript(luaScriptPath, cid, duration, reason);
            await executeLuaScript(luaScriptPath, cid, duration, reason);
            // Once the Lua script executes successfully, you can send a message to Discord
            sendToDiscord(0x00ff00, 'Ban Success', `Player with CID ${cid} has been banned for ${duration} days. Reason: ${reason}`, 'Ban Log');

            interaction.reply(`Player with CID ${cid} has been banned for ${duration} days. Reason: ${reason}`);
        } catch (error) {
            console.error('Error in execute function:', error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};
