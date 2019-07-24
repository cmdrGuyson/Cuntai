module.exports = {
	name: "hey",
	aliases: ["howdy", "hi", "hello"],
	description: "greet!",
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		message.channel.send('```bash\n"Hey there daddy!"\n```');
	},
};