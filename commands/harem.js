module.exports = {
  name: "harem",
  aliases: ["my harem"],
  description: "View my harem of cunts!",
  // eslint-disable-next-line no-unused-vars
  async execute(message, Masters, Cunts, args) {
    const fetch = require("node-fetch");
    const Discord = require("discord.js");
    const dayjs = require("dayjs");
    const { footerGuess } = require("../config.json");

    const username = message.author.username;
    const avatar = message.author.avatarURL;

    try {
      // If not a master make master
      let master = await Masters.findOne({ where: { username } });
      if (!master) master = await Masters.create({ username });

      let cunts = await Cunts.findAll({ where: { owner: username } });

      if (cunts.length <= 0) {
        message.reply("```css\n[You haven't caught any cunts!]\n```");
      } else {
        let cunt_string = "";

        cunts.forEach((cunt) => {
          cunt_string += "‣ " + cunt.name + "\n";
        });

        const serverInfoEmbed = new Discord.RichEmbed()
          .setColor("#f357f1")
          .setThumbnail(cunts[0].image_url)
          .setDescription(cunt_string)
          .setAuthor(`${username}'s Harem`, avatar);

        await message.channel.send(serverInfoEmbed);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
