local webhookUrl = "https://discord.com/api/webhooks/1204592731918307360/gJydKBEgI9UjepNJVeyerF-FxRt0MCW2Sc2TeAM6e0OtfEyw_AN2_b-hptzqd5IQHGEP"

function sendToDiscord(color, name, message, footer)
    local embed = {
        color = color,
        title = "**".. name .."**",
        description = message,
        footer = {
            text = footer
        }
    }
    PerformHttpRequest(webhookUrl, function(err, text, headers) end, 'POST', json.encode({embeds = {embed}}), { ['Content-Type'] = 'application/json' })
end

AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    -- Fetching player identifiers
    local identifiers = {}
    for k, v in pairs(GetPlayerIdentifiers(source)) do
        table.insert(identifiers, v)
    end

    -- Prepare the message
    local message = "Player "..name.." is connecting to the server.\nIdentifiers:\n"
    for _, identifier in ipairs(identifiers) do
        message = message .. identifier .. "\n"
    end

    -- Send the message to Discord
    sendToDiscord(16753920, "Player Connect", message, "Player Connection")
end)