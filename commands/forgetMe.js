module.exports = {
	name: "forgetme",
	aliases: ["delete name", "forget name", "delete my name", "forget my name", "forgetname", "forget me", "remove name"],
	description: "find a secret",
	// eslint-disable-next-line no-unused-vars
	execute(message, Nickname, args) {
		message.channel.send('Do you want me to forget you?');
		// const filter = m => m.content.includes("whitelist word");
		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { max: 1 });

		collector.on("collect", async m => {
			console.log(m.content);
		});

		collector.on("end", async collected => {
			console.log(collected.size);
			const tag = await Nickname.findOne({ where: { username: message.author.username } });
			if(tag) {
				// eslint-disable-next-line no-unused-vars
				const rowCount = await Nickname.destroy({ where: { username: message.author.username } });

				return message.reply('Nickname forgotten!');
			}
			else{
				return message.reply(`I'm sorry Daddy! I don't remember you :(`);
			}
		});
	},
};