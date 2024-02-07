import { SlashCommandBuilder, Client, GatewayIntentBits } from 'discord.js';
import * as  mysql from 'mysql2/promise';
import * as fs from 'fs';
require('dotenv').config();


const dbpool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME
})

module.exports = {


    
        data: new SlashCommandBuilder()
            .setName('logban')
            .setDescription('Bans player from your FiveM server.')
            .addStringOption(option => 
                option.setName('cid')
                    .setDescription('The lucky number of the player you are attempting to ban.')
                    .setRequired(true))
            .addStringOption(option => 
                option.setName('duration')
                    .setDescription('The duration (in days) of the ban.')
                    .setRequired(true))
            .addStringOption(option => 
                option.setName('reason')
                    .setDescription('The reason for the ban.')
                    .setRequired(true)
                    .setMaxLength(100)),
        async execute(interaction) {
            try {  
                const cid = interaction.options.getString('cid');
                const duration = interaction.options.getString('duration');
                const reason = interaction.options.getString('reason');

                const [rows] = await dbpool.execute('SELECT * FROM players WHERE cid = ?', [cid]);
                const cidData = rows[0] as { cid?: string };
                const nameData = rows[0] as { name?: string };
                const licenseData = rows[0] as { license?: string };

                if (!cidData || !cidData.cid) {
                    interaction.reply(`No citizen found with CID: ${cid}`);
                    return;
                }

            } catch {

            }
        }
    }