module.exports = {
	name: "love",
	description: "tell me who you love?",
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		if(!message.mentions.users.size) {
			return message.reply(`tell me who you love.`);
		}
		const taggedUser = message.mentions.users.first();
		message.channel.send(`${message.author} loves ${taggedUser} very much!`);
	},
};