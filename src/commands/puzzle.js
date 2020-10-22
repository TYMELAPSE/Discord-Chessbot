const axios = require("axios");

module.exports = {
    name: "puzzle",
    description: "Get a random puzzle",
    
    async execute(message, embed){
        let result = await axios.get("https://api.chess.com/pub/puzzle/random");

        embed.setThumbnail(result.data.image)
        .setTitle(result.data.title)
        .addField("Link:", result.data.url);

        message.channel.send(embed);
    }
}