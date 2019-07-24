module.exports = {
	name: "secretforget",
	aliases: ["secret delete", "delete secret", "delete a secret", "forget secret", "forgetsecret", "secret forget", "forget"],
	description: "find a secret",
	// eslint-disable-next-line no-unused-vars
	execute(message, Secrets, args) {
		message.channel.send('Daddy! which secret do you want me to forget?');
		// const filter = m => m.content.includes("whitelist word");
		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { max: 1 });
		let tagName = "";

		collector.on("collect", async m => {
			console.log(m.content);
			tagName = m.content;
		});

		collector.on("end", async collected => {
			console.log(collected.size);
			const tag = await Secrets.findOne({ where: { name: tagName } });
			if(tag.get("username") === message.author.username) {
				const rowCount = await Secrets.destroy({ where: { name: tagName } });
				if (!rowCount) return message.reply('That secret did not exist.');

				return message.reply('Secret Forgotten!');
			}
			else{
				return message.reply(`That secret does not belong to you`);
			}
		});
	},
};