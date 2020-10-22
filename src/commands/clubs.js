const axios = require("axios");

module.exports = {
    name: "clubs",
    description: "Get all user clubs",
    
    async execute(message, username, embed){
        try{
            let result = await axios.get(`https://api.chess.com/pub/player/${username}/clubs`);

            if(result.data.clubs.length > 0){
                embed.setTitle(`${username} clubs`);
                embed.setThumbnail(result.data.clubs[0].icon);
            }else{
                message.channel.send("This user is not in any clubs.");
                return;
            }

            for(let club of result.data.clubs){
                embed.addField(club.name, club.url);
            }

            message.channel.send(embed);
        }catch(error){
            console.log(error);
            message.channel.send("Sorry, this user could not be found.");
        }
    }
}