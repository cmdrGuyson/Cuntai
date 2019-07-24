module.exports = {
	name: "findporn",
	aliases: ["find", "find porn", "findpornimg", "pornimg", "porn image", "pornimage"],
	description: "Find a random porn image",
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		const fetch = require("node-fetch");
		const Discord = require("discord.js");
		let tags = "";
		let apiURL = "";

		message.channel.send('What should I look for?');
		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { max: 1 });

		collector.on("collect", async m => {
			console.log(m.content);
			tags = m.content;
		});

		collector.on("end", async collected => {
			console.log(collected.size);

			if(tags === "random") {
				apiURL = "https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&search=hd&tags[]=heels&thumbsize=big";
			}
			else{
				apiURL = "https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&search=" + tags + "&tags[]=teen&thumbsize=big";
			}


			try {
				const body = await fetch(
					apiURL
				)
					.then(response => response.json())
					.catch(error => console.error("Error:", error));

				const resultsPerPage = body.videos.length;
				const randomVideo = Math.floor(Math.random() * resultsPerPage);
				const thumbsPerVideo = body.videos[randomVideo].video.thumbs.length;
				const randomImage = Math.floor(Math.random() * thumbsPerVideo);
				const image = body.videos[randomVideo].video.thumbs[randomImage].src;

				const serverInfoEmbed = new Discord.RichEmbed()
					.setColor("#4BA4F0")
					.setTitle("Random Porn Image")
					.setImage(image)
					.setFooter("Happy Jerking!");

				message.channel.send(serverInfoEmbed);
			}
			catch (error) {
				console.error(error);
				message.channel.send("Sorry Daddy! I couldn't find that!");
			}
		});

	},
};