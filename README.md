# Carvana Discord Bot
**Credits: Eugene & Edward Conroy with E<sup>2</sup> Devlopment (Maldo & Br0k350n)**


## Overview

The Carvana Discord bot is designed to facilitate the management of imported vehicles in your FiveM Discord server. It integrates with Google Sheets for data storage and retrieval, as well as MySQL for database operations related to imported vehicles.

## Features

- **Import Vehicle Command:**
  - Allows authorized users to issue import orders for players.
  - Generates unique license plates for imported vehicles, or the option for a custom license plate.
  - Verifies and validates user input, ensuring data consistency.

- **Google Sheets Integration:**
  - Stores imported vehicle data in a Google Sheet.
  - Uses the Google Sheets API for seamless interaction with the spreadsheet.

- **MySQL Database:**
  - Manages player vehicle data in a MySQL database.
  - Ensures data persistence and accessibility.

- **Discord Interaction:**
  - Utilizes Discord.js for handling slash commands and interactions.
  - Implements buttons for user confirmation and cancellation.

## Prerequisites

Before running the bot, ensure you have the following:

- Node.js installed on your machine.
- Discord bot token obtained from the [Discord Developer Portal](https://discord.com/developers/applications).
- Discord bot application ID obtained from the [Discord Developer Portal](https://discord.com/developers/applications).
- Discord bot guild ID obtained from your [Server ID](https://www.alphr.com/discord-find-server-id/).
- Google Sheets API credentials (`credentials.json`).
- MySQL database credentials.
- Necessary Discord and MySQL permissions for the bot.

Recommended: Nodemon is installed globally

  ```bash
  npm install -g nodemon
  ```
## Setup
1. Clone the repository:

   ```bash
   git clone https://github.com/Br0k350n/Carvana-Bot.git
   ```
2. Install dependencies

    ```bash
    npm install
    ```
    or 
    ```bash
    npm i
    ```
3. rename your .env1 file to .env and fill out all of the requirements. If you're having touble, refer to this [in-depth written tutorial](https://dev.to/ku6ryo/google-sheets-api-in-typescript-setup-and-hello-world-10oh) to understand what values are needed.
4. create a "config.json" file and add the bot token, application ID, and guild id.
    ```json
      {
          "token": "YOUR_DISCORD_BOT_TOKEN_HERE",
          "clientId": "YOUR_DISCORD_BOT_APPLICATION_ID",
          "guildId": "YOUR_DISCORD_BOT_GUILD_ID"
      }
    ```
5. Build the bot
   ```bash
   npm run build
   ```
6. You should see a new folder called "dist". Move your "config.json" file into this folder, but be careful not to put it in "commands" or anywhere else.
7. Move your prevously installed credentials file into the root directory.
8. Start the bot
   ```bash
   node .
   ```
Start the bot (with nodemon)
    ```
    nodemon .
    ```
**Congratulations** You have successfully installed the Carvana Discord Bot! The commands for this bot will automatically be available to anyone with the role of "admin" or "tester".
## Commands
  - **/giveimport(discord_id, cid, import_id, <cp>)**
  - discord_id: The ID of any given Discord User (it looks like this: "1202387754470604821")
    - cid: The ID given to players as they fly in to the city, commonly known in FiveM as your "lucky number".
    - import_id: The ID of the vehicle being given.
    - cp(custom plate): an optional parameter for making a custom license plate.
    - This will not only be added to the database in "players_vehicles", but will also be tracked in your googlesheet.

- **/addimport(import_name, import_id) (coming soon)**
  - add your import to a googlesheet
  - add your import to a database
  - import_name: name of the new vehicle
  - import_id: id used to spawn the vehicle

## Thank You For Reading!
    
