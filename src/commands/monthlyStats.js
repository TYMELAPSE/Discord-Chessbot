const axios = require("axios");

module.exports = {
    name: "monthlyStats",
    description: "Get a detailed list of a players monthly stats",
    
    async execute(message, username, embed){
        
        try{
            let currentDate = new Date();
            let currentYear = currentDate.getFullYear();
            let currentMonth = (currentDate.getMonth() + 1 > 12 ? '0' : (currentDate.getMonth() + 1).toString());

            if(currentMonth.length == 1){
                currentMonth.padStart(2, '0');
            }

            const result = await axios.get(`https://api.chess.com/pub/player/${username}/games/${currentYear}/${currentMonth}`);

            let whiteWins = 0;
            let blackWins = 0;
            let currentWinStreak = 0;
            let biggestWinStreak = 0;
            let losses = 0;
            let draws = 0;
            let totalMatches = 0;
            let startingElo = 0;
            let eloBottom = Number.MAX_SAFE_INTEGER;
            let eloPeak = 0;
            let currentElo = 0;
            let firstMatch = true;

            let formattedResults = [];
            let timeClasses = ['rapid', 'blitz', 'bullet'];
            let lcName = username.toLowerCase();

            for(let i = 0 ; i < 3; i++){
                for(let game of result.data.games){
                    if(game.time_class == timeClasses[i]){
                        if(game.pgn.toLowerCase().includes(`${lcName} won`)){
                            if(game.white.username.toLowerCase() == lcName){
                                whiteWins++;
                            }else{
                                blackWins++;
                            }

                            currentWinStreak++;

                            if(currentWinStreak > biggestWinStreak){
                                biggestWinStreak = currentWinStreak;
                            }

                        }else if(game.pgn.includes("draw")){
                            draws++;
                            currentWinStreak = 0;
                        }else{
                            losses++;
                            currentWinStreak = 0;
                        }

                        if(game.white.username.toLowerCase() == lcName){
                            //Separated if-statements in case user only played one match
                            if(game.white.rating > eloPeak){
                                eloPeak = game.white.rating;
                            }
                            
                            if(game.white.rating < eloBottom){
                                eloBottom = game.white.rating;
                            }

                            if(firstMatch){
                                firstMatch = false;
                                startingElo = game.white.rating;
                            }

                            currentElo = game.white.rating;

                        }else if(game.black.username.toLowerCase() == lcName){
                            if(game.black.rating > eloPeak){
                                eloPeak = game.black.rating;
                            }
                            
                            if(game.black.rating < eloBottom){
                                eloBottom = game.black.rating;
                            }

                            if(firstMatch){
                                firstMatch = false;
                                startingElo = game.black.rating;
                            }

                            currentElo = game.black.rating;
                        }
                        
                        totalMatches++;
                    }
                }
                
                if(totalMatches > 0){
                    formattedResults.push(
                        `
                        Matches played: ${totalMatches}
                        Wins: ${whiteWins + blackWins}
                        Lossses: ${losses}
                        Draws: ${draws}
                        
                        Wins as white: ${whiteWins}
                        Wins as black: ${blackWins}
                        Longest win-streak: ${biggestWinStreak}
                        
                        ELO Peak: ${eloPeak}
                        ELO Bottom: ${eloBottom}
                        
                        ELO Change: ${currentElo - startingElo}
                        Starting ELO: ${startingElo}
                        Current ELO: ${currentElo}`
                    )
                }else{
                    formattedResults.push("User did not play in this category.");
                }

                whiteWins = 0;
                blackWins = 0;
                currentWinStreak = 0;
                biggestWinStreak = 0;
                losses = 0;
                draws = 0;
                totalMatches = 0;
                startingElo = 0;
                eloBottom = Number.MAX_SAFE_INTEGER;
                eloPeak = 0;
                currentElo = 0;
                firstMatch = true;
            }

            embed.setTitle(`Monthly stats for ${username}`)
            .addField('Rapid', formattedResults[0])
            .addField('Blitz', formattedResults[1])
            .addField('Bullet', formattedResults[2]);

            message.channel.send(embed);

      }catch(error){
            console.log(error);
            message.channel.send("User does not exist or has not played in all three major time classes.");
      }
    }
}