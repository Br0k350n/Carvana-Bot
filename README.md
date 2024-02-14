# Carvana Discord Bot

## Overview

The Carvana Discord bot is designed to facilitate the management of imported vehicles in your FiveM Discord server. It integrates with Google Sheets for data storage and retrieval, as well as MySQL for database operations related to imported vehicles.

### Credits
- Eugene & Edward Conroy with E<sup>2</sup> Development (Maldo & Br0k350n)

## Features

### Import Vehicle Command

- Allows authorized users to issue import orders for players.
- Generates unique license plates for imported vehicles, or the option for a custom license plate.
- Verifies and validates user input, ensuring data consistency.

### Google Sheets Integration

- Stores imported vehicle data in a Google Sheet.
- Uses the Google Sheets API for seamless interaction with the spreadsheet.

### MySQL Database

- Manages player vehicle data in a MySQL database.
- Ensures data persistence and accessibility.

### Discord Interaction

- Utilizes Discord.js for handling slash commands and interactions.
- Implements buttons for user confirmation and cancellation.

## Prerequisites

Before running the bot, ensure you have the following:

- Node.js installed on your machine.
- Discord bot token obtained from the [Discord Developer Portal](https://discord.com/developers/applications).
- Discord bot client ID obtained from the [Discord Developer Portal](https://discord.com/developers/applications).
- Discord bot guild ID obtained from your [Server ID](https://www.alphr.com/discord-find-server-id/).
- Google Sheets API credentials (`credentials.json`).
- MySQL database credentials.
- Necessary Discord and MySQL permissions for the bot.
- Make sure your Google Sheet looks just like [this](https://docs.google.com/spreadsheets/d/109znreK_uf8wyWw8QslsLin__uYj__d_3E3bWB9Kl00/edit?usp=sharing)

**Recommended:** Nodemon is installed globally

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
3. rename your ```.env1``` file to ```.env``` and fill out all of the requirements. If you're having touble, refer to this [in-depth written tutorial](https://dev.to/ku6ryo/google-sheets-api-in-typescript-setup-and-hello-world-10oh) to understand what googlesheet values are needed. 

**[IMPORTANT]** **You should replace the ```vehicleLuaPath``` in your .env with the ```ABSOLUTE PATH``` to your ```vehicles.lua``` file.**

4. Rename the ```example_config.json``` file to ```config.json``` and add the bot token, cleint ID (also called application ID), and guild id. 
    ```json
      {
          "token": "YOUR_DISCORD_BOT_TOKEN_HERE",
          "clientId": "YOUR_DISCORD_BOT_CLIENT_ID",
          "guildId": "YOUR_DISCORD_BOT_GUILD_ID"
      }
    ```
5. Create the ```import_vehicles``` database. You need to run the ```import_vehicles.sql``` file so that you have access to a second database used for storing processed orders and any added vehicles. 
  [**IMPORTANT**]: **It's very important that the database is not renamed.**

6. Build the bot
   ```bash
   npm run build
   ```
    (Remember to use ```CTRL+C``` to exit once you get the message that the two commands have been reloaded successfully.)
7. Move your prevously installed credentials file into the root directory.
8. Start the bot
   ```bash
   node .
   ```
   Start the bot (with ```nodemon```)
   ```
   nodemon .
   ```
(optional) 9. change the roles allowed to use the /giveimport and /addimport commands. go to your ```.env``` file, and in ```ALLOWED_ROLES``` change what roles you'd like to have access to these commands.

**Congratulations** You have successfully installed the Carvana Discord Bot! The commands for this bot will automatically be available to anyone with the role of "admin" or "tester".
## Commands
  - **```/giveimport(cid, import_id, cp?)```**
    - ```cid```: The ID given to players as they fly in to the city, commonly known in FiveM as your "lucky number".
    - ```import_id```: The spawnid of the vehicle being given.
    - ```cp(custom plate)```: an optional parameter for making a custom license plate.
    - This will not only be added to the database in "players_vehicles", but will also be tracked in your googlesheet. On top of this, the processed orders will go into the "processed_orders" table of the "imported_vehicles" database.

- **```/addimport(import_id, import_name, import_make, import_cat)```**
  - ```import_id```: The spawnid you set for the new vehicle.
  - ```import_name```: The name you set for the new vehicle.
  - ```import_make```: The "brand" of your new vehicle.
  - This new vehicle will be added into the "vehicles.lua" as well as the ```vehicles``` table in the ```imported_vehicles``` database.

## Thank You For Reading!
    
