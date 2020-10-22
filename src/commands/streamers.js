const axios = require("axios");

module.exports = {
    name: "streamers",
    description: "Get list of all featured streamers currently live.",
    
    async execute(message, embed){
        let result = await axios.get("https://api.chess.com/pub/streamers");
        let liveStreamers = [];

        for(let streamer of result.data.streamers){
            if(streamer.is_live){
                liveStreamers.push(streamer);
            }else{
                //result is sorted by live status so after first encounter breaking the loop is OK
                break;
            }
        }
        
        let formattedString = "";

        for(let streamer of liveStreamers){
            formattedString += `${streamer.username}:\n${streamer.twitch_url}\n`;
        }

        embed.addField("Streamers", formattedString);

        message.channel.send(embed);
    }
}