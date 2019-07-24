module.exports = {
	name: "who's your daddy?",
	aliases: ["daddy", "dad", "father"],
	description: "who's your daddy?",
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		message.channel.send('```bash\n"Guyson is my Daddy!"\n```');
	},
};