module.exports = {
  name: "hey",
  aliases: ["howdy", "hi", "hello"],
  description: "greet!",
  // eslint-disable-next-line no-unused-vars
  execute(message, Nickname, args) {
    message.channel.send("```bash\nHellooo!\n```");
    const filter = (m) => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {
      max: 1,
    });

    collector.on("collect", async (m) => {
      console.log(m.content);
    });

    collector.on("end", async (collected) => {
      console.log(collected.size);
      try {
        const tag = await Nickname.findOne({
          where: { username: message.author.username },
        });
        if (tag) {
          return message.reply("I missed you " + tag.get("name"));
        } else {
          message.channel.send("What would you like me to call you honey?");
          const collector2 = message.channel.createMessageCollector(filter, {
            max: 1,
          });
          let nickname = "";

          collector2.on("collect", async (m) => {
            console.log(m.content);
            nickname = m.content;
          });

          collector2.on("end", async (collected2) => {
            console.log(collected2.size);
            try {
              const tagName = await Nickname.create({
                name: nickname,
                username: message.author.username,
              });

              return message.reply(`I'll call you ${tagName.name} from now on`);
            } catch (e) {
              if (e.name === "SequelizeUniqueConstraintError") {
                return message.reply("I don't know what's wrong");
              }
            }
          });
        }
      } catch (e) {
        return message.reply("Daddy there's an error! : " + e.name);
      }
    });
  },
};
