module.exports = {
	name: "who's your mommy?",
	aliases: ["mom", "mommy", "mother"],
	description: "who's your mommy?",
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		message.channel.send('```bash\n"Neith is my Mommy!"\n```');
	},
};