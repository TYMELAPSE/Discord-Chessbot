const axios = require("axios");

module.exports = {
    name: "help",
    description: "Get a list of available commands",
    
    async execute(message, embed){

        const PREFIX = process.env.CHESSBOT_PREFIX

        embed.setTitle("Chessbot Commands")
        .addField(`${PREFIX}playerRatings[PlayerUsername]`,
        `Displays a players current and all-time best ratings. 
        \n(${PREFIX}playerRatingsHikaru)`)
        .addField(`${PREFIX}monthlyStats[PlayerUsername]`, 
        `Displays a detailed list of a users statistics for the current month. 
        \n(${PREFIX}monthlyStatsHikaru)`)
        .addField(`${PREFIX}leaderboard[Category][Amount]`, 
        `Displays a leaderboard of the currently highest ranked players in a certain category. The amount parameter determines how many players will be displayed.
        \n(${PREFIX}leaderboardRapid10)`)
        .addField(`${PREFIX}streamers`, 
        `Displays a list of all chess.com featured streamers currently online.
        \n(${PREFIX}streamers)`)
        .addField(`${PREFIX}puzzle`, `Links to a random puzzle.
        \n(${PREFIX}puzzle)`)
        .addField(`${PREFIX}tournaments[PlayerUsername]`,
        `Displays a users 10 highest rated tournaments.
        \n(${PREFIX}tournamentsHikaru)`);

        message.channel.send(embed);
    }
}