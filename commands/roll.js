module.exports = {
  name: "roll",
  aliases: ["hunt"],
  description: "Test your luck at catching a cunt!",
  // eslint-disable-next-line no-unused-vars
  async execute(message, Masters, Cunts, args) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const dayjs = require("dayjs");
    const { footerGuess } = require("../config.json");

    const username = message.author.username;

    try {
      // If not a master make master
      let master = await Masters.findOne({ where: { username } });
      if (!master) master = await Masters.create({ username });

      master.rollCount++;
      master.lastRoll = dayjs();
      master = await master.save();

      if (master.rollCount > 10) {
        let diff = dayjs().diff(master.lastCaught, "minutes");
        if (diff < 10) {
          message.reply(
            "```css\n[Wait! There's a 10 minute cooldown before you can roll again!]\n```"
          );
        } else {
          message.reply("```css\n[The dice got lost. Roll again!]\n```");
          master.rollCount = 0;
          await master.save();
        }
      } else {
        let body;
        let selectedStar;

        do {
          const randomPage = Math.floor(Math.random() * 1028);

          body = await fetch(
            "https://api.redtube.com/?data=redtube.Stars.getStarDetailedList&output=json&page=" +
              randomPage
          )
            .then((response) => response.json())
            .catch((error) => console.error("Error:", error));

          let randomStar = Math.floor(Math.random() * body.stars.length - 1);

          if (randomStar === -1) randomStar = 0;

          //console.log(randomStar);

          selectedStar = body.stars[randomStar];
        } while (
          selectedStar.star_thumb.endsWith("/no-img-women.jpg") ||
          selectedStar.star_thumb.endsWith("/no-img-men.jpg")
        );

        let cunt = await Cunts.findOne({
          where: { image_url: selectedStar.star_thumb },
        });
        if (!cunt)
          cunt = await Cunts.create({
            image_url: selectedStar.star_thumb,
            name: selectedStar.star,
          });

        let footer = !cunt.owner
          ? "It's a wild one!"
          : `Belongs to ${cunt.owner}`;

        const serverInfoEmbed = new Discord.RichEmbed()
          .setColor("#f357f1")
          .setTitle(selectedStar.star)
          .setImage(selectedStar.star_thumb)
          .setFooter(footer);

        const filter = (reaction, user) => {
          return (
            ["❤️"].includes(reaction.emoji.name) &&
            user.id === message.author.id
          );
        };

        if (!cunt.owner) {
          let embedMessage = await message.channel.send({
            embed: serverInfoEmbed,
          });

          await embedMessage.react("❤️");

          //Collect reaction
          let collected = await embedMessage.awaitReactions(filter, {
            max: 1,
            time: 10000,
            errors: ["time"],
          });

          const reaction = collected.first();

          if (reaction) {
            if (master.lastCaught) {
              let diff = dayjs().diff(master.lastCaught, "minutes");
              if (diff < 10) {
                console.log("diff", diff);
                message.reply(
                  "```css\n[Wait! There's a 10 minute cooldown before you can catch again!]\n```"
                );
                return;
              } else {
                cunt.owner = username;
                await cunt.save();

                master.lastCaught = dayjs();
                await master.save();

                message.reply(
                  "```css\n[Congratulations! You caught " +
                    cunt.name +
                    " ]\n```"
                );
              }
            } else {
              cunt.owner = username;
              await cunt.save();

              master.lastCaught = dayjs();
              await master.save();

              message.reply(
                "```css\n[Congratulations! You caught " + cunt.name + " ]\n```"
              );
            }
          }
        } else {
          await message.channel.send(serverInfoEmbed);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
