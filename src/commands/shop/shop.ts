import { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import * as mysql from 'mysql2/promise';
import { vipCost, vehicleTokenCost } from "../../../shopPrices.json";
require('dotenv').config();

const dbPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB3NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Open the shop to purchase items.')
        .addSubcommand((subcommand) => subcommand
            .setName("vip")
            .setDescription(`Buy the V.I.P Role`))
        .addSubcommand((subcommand) => subcommand
            .setName("vehicle-token")
            .setDescription(`Buy Import Vehicle Tokens to claim Imported Vehicles`)
        ),
    async execute(interaction) {
        // Get the selected item from the interaction
        const selectedItem = interaction.options.getSubcommand();
        // Get the user ID
        const userId = interaction.user.id;

        try {
            // Query the database to get the user's balance
            const query = 'SELECT coinAmount FROM users WHERE discord = ?';
            const [rows] = await dbPool.execute(query, [userId]);

            const rowData = rows[0];
            const rowDiscord = rows[0] as { discord?: string };
            
            // Check if the user has a balance record in the database
            if (!rowDiscord) {
                return interaction.reply(`User not found in the database`);
            }

            const userCoinAmount = rows[0].coinAmount;
            const userVehicleTokens: number = rows[0].vehicleTokens || 0;

            

            // Process the selected item
            switch (selectedItem) {
                case 'vip':
                    if (rowData.hasVip == 0) {
                        // Deduct the price of V.I.P role from the user's coinAmount
                        if (userCoinAmount < vipCost) {
                            return interaction.reply('Insufficient funds to purchase V.I.P role.');
                        }
                        // Logic to assign V.I.P role to the user
                        // Deduct vipPrice from user's coinAmount in the database
                        await dbPool.execute('UPDATE users SET coinAmount = ? WHERE discord = ?', [userCoinAmount - vipCost, userId]);
                        await dbPool.execute('UPDATE users SET hasVip = ? WHERE discord = ?', [1, userId]);
                        interaction.reply('You have purchased the V.I.P role!');
                        const vipRole = await interaction.guild.roles.create({
                            name: process.env.VIP_ROLE,
                            permissions: [],
                            color: 15844367,
                        })
                        interaction.member.roles.add(vipRole);
                        break;
                    } else {
                        interaction.reply('You already have the V.I.P role!');
                        break;
                    }
                case 'vehicle-token':
                    // Deduct the price of imported vehicle from the user's coinAmount
                    if (userCoinAmount < vehicleTokenCost) {
                        return interaction.reply('Insufficient funds to purchase imported vehicle.');
                    }
                    // Logic to add imported vehicle to user's inventory
                    // Deduct vehiclePrice from user's coinAmount in the database
                    await dbPool.execute('UPDATE users SET coinAmount = ? WHERE discord = ?', [userCoinAmount - vehicleTokenCost, userId]);
                    await dbPool.execute('UPDATE users SET vehicleTokens = ? WHERE discord = ?', [userVehicleTokens + 1, userId]);
                    console.log(userVehicleTokens + 1)
                    console.log(typeof (userVehicleTokens + 1))
                    interaction.reply('You have purchased an imported vehicle token!');
                    break;
                default:
                    interaction.reply('Invalid item selected.');
                    break;
            }
        } catch (error) {
            console.error('Error processing shop command:', error);
            interaction.reply('An error occurred while processing your request.');
        }
    },
};