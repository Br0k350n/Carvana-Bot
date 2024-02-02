"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var mysql = require("mysql2/promise");
require('dotenv').config();
var dbPool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
function generatePlateNumbers() {
    return __awaiter(this, void 0, void 0, function () {
        var characters, plateNumber, isPlateExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    plateNumber = Array.from({ length: 6 }, function () { return characters[Math.floor(Math.random() * characters.length)]; }).join('');
                    return [4 /*yield*/, checkPlateExistence(plateNumber)];
                case 1:
                    isPlateExists = _a.sent();
                    // If the plateNumber already exists, recursively call the function to generate a new one
                    if (isPlateExists) {
                        return [2 /*return*/, generatePlateNumbers()];
                    }
                    // If the plateNumber is unique, return it as an array
                    return [2 /*return*/, [plateNumber]];
            }
        });
    });
}
function checkPlateExistence(plateNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbPool.execute('SELECT COUNT(*) as count FROM license_plates WHERE plate_number = ?', [plateNumber])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows[0].count > 0];
            }
        });
    });
}
function addPlateToDatabase(plateNumber, discordId, steamId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dbPool.execute('INSERT INTO license_plates (plate_number, discordID, steamID) VALUES (?, ?, ?)', [plateNumber, discordId, steamId])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('giveimport')
        .setDescription('Give a player an imported vehicle.')
        .addStringOption(function (option) {
        return option.setName('id')
            .setDescription('Enter the Discord or Steam ID')
            .setRequired(true);
    })
        .addStringOption(function (option) {
        return option.setName('import_id')
            .setDescription('Enter the import ID.')
            .setRequired(true);
    }),
    execute: function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var idValue, importId, query, rows, foundDiscordId, foundSteamID, generatedPlates, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idValue = interaction.options.getString('id');
                        importId = interaction.options.getString('import_id');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        query = 'SELECT discordID, steamID FROM players WHERE discordID = ? OR steamID = ?';
                        return [4 /*yield*/, dbPool.execute(query, [idValue, idValue])];
                    case 2:
                        rows = (_a.sent())[0];
                        if (!Array.isArray(rows) || rows.length === 0) {
                            interaction.reply("The ID ".concat(idValue, " is not in the database."));
                            return [2 /*return*/];
                        }
                        foundDiscordId = rows[0].discordID;
                        foundSteamID = rows[0].steamID;
                        if (foundDiscordId !== idValue && foundSteamID !== idValue) {
                            interaction.reply("The ID ".concat(idValue, " is not associated with the specified Discord or Steam ID."));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, generatePlateNumbers()];
                    case 3:
                        generatedPlates = _a.sent();
                        return [4 /*yield*/, addPlateToDatabase(generatedPlates[0], foundDiscordId, foundSteamID)];
                    case 4:
                        _a.sent();
                        interaction.reply("Successfully issued import to ".concat(idValue, " with license plate ").concat(generatedPlates[0], "."));
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error("Error checking database or generating import: ", error_1);
                        interaction.reply("Error processing the import.");
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
};
