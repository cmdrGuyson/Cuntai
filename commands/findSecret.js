module.exports = {
	name: "find a secret",
	aliases: ["secret find", "fetch secret", "my secret", "find secret", "findsecret", "mysecret"],
	description: "find a secret",
	// eslint-disable-next-line no-unused-vars
	execute(message, Secrets, args) {
		message.channel.send('Daddy! which secret do you want me to retrieve?');
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
				if (tag) {
				// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
					tag.increment('usage_count');
					return message.channel.send("Your Secret: " + tag.get("description"));
				}
				return message.reply(`Could not find that secret: ${tagName}`);
			}
			else{
				return message.reply(`That secret does not belong to you`);
			}
		});
	},
};