module.exports = {
  name: "guess",
  aliases: ["guesscunt", "guess cunt", "whodis", "guess star"],
  description: "Guess who the porn star is!",
  // eslint-disable-next-line no-unused-vars
  async execute(message, args) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const { footerGuess } = require("../config.json");

    const randomPage = Math.floor(Math.random() * 100);

    try {
      const body = await fetch(
        "https://api.redtube.com/?data=redtube.Stars.getStarDetailedList&output=json&page=" +
          randomPage
      )
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));

      const resultPerPage = body.stars.length;
      const randomStar = Math.floor(Math.random() * resultPerPage);
      const answer = body.stars[randomStar].star;
      const answerExp = answer.toLowerCase();
      console.log(answerExp);

      const serverInfoEmbed = new Discord.RichEmbed()
        .setColor("#f357f1")
        .setTitle("Guess the Porn Star")
        .setImage(body.stars[randomStar].star_thumb)
        .setFooter(footerGuess);

      message.channel.send(serverInfoEmbed);

      const filter = (m) => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector(filter, {
        max: 1,
      });
      let userAnswer = "";

      collector.on("collect", (m) => {
        userAnswer = m.content;
      });

      // eslint-disable-next-line no-unused-vars
      collector.on("end", (collected) => {
        if (userAnswer.toLowerCase() == answerExp) {
          const result = new Discord.RichEmbed()
            .setColor("#f357f1")
            .setDescription(
              "Damn daddy! That's Correct! You watch a lot of porn"
            );
          message.channel.send(result);
        } else {
          const result = new Discord.RichEmbed()
            .setColor("#f357f1")
            .setDescription("I'm sorry thats wrong! it was " + answer);
          message.channel.send(result);
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
};
