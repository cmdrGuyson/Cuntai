module.exports = {
  name: "see",
  aliases: ["view", "find"],
  description: "Checkout a cunt!",
  // eslint-disable-next-line no-unused-vars
  async execute(message, Masters, Cunts, args) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const dayjs = require("dayjs");
    const { footerGuess } = require("../config.json");

    let tags;

    message.channel.send("What should I look for?");
    const filter = (m) => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {
      max: 1,
    });

    collector.on("collect", async (m) => {
      console.log(m.content);
      tags = m.content;
    });

    collector.on("end", async (collected) => {
      try {
        let cunt = await Cunts.findOne({ where: { name: tags } });

        if (!cunt) {
          message.reply(
            "```css\n[Looks like this cunt hasn't spawned in the server yet!]\n```"
          );
        } else {
          let footer = !cunt.owner
            ? "It's a wild one!"
            : `Belongs to ${cunt.owner}`;

          const serverInfoEmbed = new Discord.RichEmbed()
            .setColor("#f357f1")
            .setTitle(cunt.name)
            .setImage(cunt.image_url)
            .setFooter(footer);

          await message.channel.send(serverInfoEmbed);
        }
      } catch (error) {
        console.error(error);
      }
    });
  },
};
