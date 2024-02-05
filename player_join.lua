const playersIdentifiers = {};

function GetPlayerIdentifiers(player) {
    --  // Simulate player identifiers
    return ["steam:steam_id_123", "discord:discord_id_456", "ip:127.0.0.1", "license:license_789"];
}

function GetIdentifiers(player) {
    const identifiers = GetPlayerIdentifiers(player);
    const playerIdentifiers = {
        steam: null,
        discord: null,
        ip: null,
        license: null
    };

    for (const identifier of identifiers) {
        const [type, value] = identifier.split(":");
        playerIdentifiers[type] = value;
    }

    return playerIdentifiers;
}

function playerConnectingHandler(player) {
    const identifiers = GetIdentifiers(player);

    -- // Simulate MySQL.Async.execute
    const rowsChanged = 1;

    if (rowsChanged > 0) {
        console.log("Player identifiers updated in the database.");
    }

    playersIdentifiers[player] = identifiers;
}

-- // Simulate playerConnecting event
const testPlayer = 123;
playerConnectingHandler(testPlayer);

-- // Get stored identifiers
const storedIdentifiers = playersIdentifiers[testPlayer] || {};
console.log("Stored Identifiers for Player " + testPlayer + ":");
for (const [key, value] of Object.entries(storedIdentifiers)) {
    console.log("- " + key + ": " + value);
}