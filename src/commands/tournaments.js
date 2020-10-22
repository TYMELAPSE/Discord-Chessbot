const axios = require("axios");

module.exports = {
    name: "tournaments",
    description: "Gets the users top 5 tournaments in which he/she placed the best",
    
    async execute(message, username, embed){
        try{
            let result = await axios.get(`https://api.chess.com/pub/player/${username}/tournaments`);
            let sortedResult = result.data.finished.sort((a,b) => (a.placement > b.placement) ? 1 : ((b.placement > a.placement) ? -1 : 0)); 

            if(sortedResult.length > 0){
                for(let i = 0; i < 5; i++){
                    let game = sortedResult[i];
                    let formattedTournament =
                    `Placement: ${game.placement} (${game.total_players})
                    WLD: ${game.wins}/${game.losses}/${game.draws}
                    ${game.url}`;

                    embed.addField(urlToReadableTitle(game.url), formattedTournament);
                }
            }else{
                message.channel.send("This user has not partaken in any tournaments.");
                return;
            }
            message.channel.send(embed); 

        }catch(error){
            console.log(error);
            message.channel.send("This user could not be found.");
        }
    }
}

function urlToReadableTitle(url){
    let urlToTitle = url.substring(url.lastIndexOf("/") + 1);
    let splitTitle = urlToTitle.split("-");
    let formattedTitle = "";

    for(let word of splitTitle){
        if(word != ""){
            formattedTitle += word[0].toUpperCase() + word.substring(1) + " ";
        }
    }

    return formattedTitle.trim();
}