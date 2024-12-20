import * as fs from 'fs';
import * as path from 'path';
import { Client, Collection, Events, GatewayIntentBits, PresenceStatusData, ActivityType } from 'discord.js';
require('dotenv').config();
const botConfig = JSON.parse(process.env.BOT_CONFIG);
const token = botConfig.token;
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>;
    }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

function updatePresence() {
    client.user.setPresence({
        activities: [{ name: `${client.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c)} users`, type: ActivityType.Watching }],
        status: 'online' as PresenceStatusData, 
    });
}


client.once("ready", () => {
    updatePresence(); 
});

client.on("guildMemberAdd", async () => {
    updatePresence();
});

client.on("guildMemberRemove", async () => {
    updatePresence();
});

client.commands = new Collection<string, any>();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
            console.error('error: ', error)
        } else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            console.error('error: ', error)
        }
    }
})

client.login(token);


