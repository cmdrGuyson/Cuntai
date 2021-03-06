const fs = require("fs");
const Discord = require("discord.js");
const Sequelize = require("sequelize");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
client.commands = new Discord.Collection();

// START DATABASE

const sequelize = new Sequelize("database", "user", "password", {

	host: "localhost",
	dialect: "sqlite",
	logging: false,
	operatorsAliases: false,
	storage: "database.sqlite",

});

const Nickname = sequelize.define("nicknames", {
	name: Sequelize.STRING,
	username: {
		type: Sequelize.STRING,
		unique: true,
	},
});

const Secrets = sequelize.define("tags", {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.STRING,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

// END DATABASE

client.once("ready", ()=>{
	Nickname.sync();
	Secrets.sync();
	console.log("Daddy I'm ready for you!");
});

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("message", message =>{

	if(!message.content.startsWith(prefix) || message.author.bot) return;

	// const args = message.content.slice(prefix.length).toLowerCase().split(/ +/);
	const args = message.content.slice(prefix.length).toLowerCase();
	const commandName = args;
	console.log(commandName);


	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	console.log(command);

	if(!command) return;

	try {
		if (command.name === "hey" || command.name === "forgetme") {
			command.execute(message, Nickname, args);
		}
		else {
			command.execute(message, Secrets, args);
		}
	}
	catch (error) {
		console.log(error);
		message.reply("I'm sorry daddy! I can't execute that command :(");

	}

});

client.login(token);
