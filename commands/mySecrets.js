module.exports = {
	name: "mysecrets",
	aliases: ["secrets", "fetch secrets", "my secrets", "all secrets"],
	description: "tell me who you love?",
	// eslint-disable-next-line no-unused-vars
	async execute(message, Secrets, args) {
		const username = message.author.username;
		const tag = await Secrets.findAll({ where: { username: username } });
		const tagString = tag.map(t => t.name).join(', ') || 'No secrets kept.';
		return message.channel.send(`List of secrets: ${tagString}`);
	},
};