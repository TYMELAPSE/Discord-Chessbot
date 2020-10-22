const axios = require("axios");

module.exports = {
    name: "playerRatings",
    description: "Get a detailed list of a players ratings",
    
    async execute(message, username, embed){
        try{
            let result = await axios.get(`https://api.chess.com/pub/player/${username}/stats`);   
            let formattedResults = [];

            formattedResults.push( 
            `${result.data.chess_rapid.last.rating} (${result.data.chess_rapid.best.rating})
            WLD: ${result.data.chess_rapid.record.win}/${result.data.chess_rapid.record.loss}/${result.data.chess_rapid.record.draw}`);
            
            formattedResults.push(`
            ${result.data.chess_blitz.last.rating} (${result.data.chess_blitz.best.rating})
            WLD: ${result.data.chess_blitz.record.win}/${result.data.chess_blitz.record.loss}/${result.data.chess_blitz.record.draw}`);

            formattedResults.push(`
            ${result.data.chess_bullet.last.rating} (${result.data.chess_bullet.best.rating})
            WLD: ${result.data.chess_bullet.record.win}/${result.data.chess_bullet.record.loss}/${result.data.chess_bullet.record.draw}`);

            embed.setTitle(`${username} ratings`)
            .addField("Rapid", formattedResults[0])
            .addField("Blitz", formattedResults[1])
            .addField("Bullet", formattedResults[2]);

            message.channel.send(embed);

        }catch(error){
            console.log(error);
            message.channel.send("User does not exist or has not played in all three major time classes.");
        }
    
    }
}