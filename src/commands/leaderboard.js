const axios = require("axios");

module.exports = {
    name: "leaderboard",
    description: "Returns a list of the highest rated players in a specified category",

    async execute(message, category, amount, embed){
        
        let result = await axios.get("https://api.chess.com/pub/leaderboards");
        let leaderboard;

        switch(category){
            case 'Rapid':
                leaderboard = result.data.live_rapid; break;
            case 'Blitz':
                leaderboard = result.data.live_blitz; break;
            case 'Bullet':
                leaderboard = result.data.live_bullet; break;
            default:
                message.channel.send("I don't recognize that category. Available categories: Rapid, Blitz, Bullet.");
                return;
        }

        if(amount && amount >= 0 && amount <= 50){
            leaderboard = leaderboard.slice(0, amount);
        }
        
        let formattedResult = "";

        for(let player of leaderboard){
            formattedResult += `${player.rank}. ${player.username} (${player.score})\n`;
        }

        embed.addField("Leaderboard", formattedResult);

        message.channel.send(embed);
    }
}