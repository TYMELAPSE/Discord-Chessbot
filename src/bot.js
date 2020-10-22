require("dotenv").config();

const {Client, Collection, MessageEmbed}= require("discord.js");
const fs = require("fs");
const PREFIX = process.env.CHESSBOT_PREFIX;
const client = new Client();

client.login(process.env.CHESSBOT_TOKEN);

client.on("ready", () => {
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('src/commands/').filter(file => file.endsWith("js"));
    for(let file of commandFiles){
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }

    console.log("Chessbot is ready.");
});

client.on("message", (message) => {

    if(!message.author.bot && message.content.startsWith(PREFIX)){
        let filteredMessage = message.content.substring(PREFIX.length);
        let embed = new MessageEmbed();

        if(filteredMessage === "streamers"){
            client.commands.get('streamers').execute(message, embed);

        }else if(filteredMessage.startsWith("leaderboard")){
            let category = filteredMessage.substring("leaderboard".length).replace(/[0-9]/g, '');
            let amount = filteredMessage.replace(/\D/g,'');
            client.commands.get('leaderboard').execute(message, category, amount, embed);

        }else if(filteredMessage.startsWith("playerRatings")){
            let username = filteredMessage.substring("playerRatings".length);
            client.commands.get('playerRatings').execute(message, username, embed);

        }else if(filteredMessage.startsWith("monthlyStats")){
            let username = filteredMessage.substring("monthlyStats".length);
            client.commands.get("monthlyStats").execute(message, username, embed);

        }else if(filteredMessage.startsWith("puzzle")){
            client.commands.get("puzzle").execute(message, embed);

        }else if(filteredMessage.startsWith("help")){
            client.commands.get("help").execute(message, embed);

        }else if(filteredMessage.startsWith("clubs")){
            let username = filteredMessage.substring("clubs".length);
            client.commands.get("clubs").execute(message, username, embed);

        }else if(filteredMessage.startsWith("tournaments")){
            let username = filteredMessage.substring("tournaments".length);
            client.commands.get("tournaments").execute(message, username, embed);
            
        }else if(filteredMessage === "offline"){
            client.user.setStatus("invisible");
            client.user.setPresence({status: 'invisible'});
        }
    }

    
});