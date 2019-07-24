module.exports = {
	name: "keep a secret",
	aliases: ["secret", "keep secret", "add secret", "addsecret", "keepsecret"],
	description: "keep a secret",
	// eslint-disable-next-line no-unused-vars
	execute(message, Secrets, args) {
		message.channel.send('Tell me your deepest, darkest secrets!');
		// const filter = m => m.content.includes("whitelist word");
		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { max: 1 });
		let tagName = "";
		let tagDescription = "";

		collector.on("collect", async m => {
			console.log(m.content);
			tagName = "SECRET: " + Math.floor(Math.random() * 1000);
			tagDescription = m.content;
		});

		collector.on("end", async collected => {
			console.log(collected.size);
			try {
				const secret = await Secrets.create({
					name: tagName,
					description: tagDescription,
					username: message.author.username,
				});

				return message.reply(`${secret.name} added.`);
			}
			catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.reply("Please daddy! That's too much of a secret");
				}
				return message.reply("Daddy there's an error! : " + e.name);
			}
		});
	},
};
