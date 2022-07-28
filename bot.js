const { Intents, Client, MessageEmbed, Collection, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

const bot = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_WEBHOOKS
	],
	allowedMentions: {
		parse: [
			'users',
			'roles',
		],
		repliedUser: true
	},
	partials: [
		'MESSAGE',
		'CHANNEL',
		'REACTION',
		'USER',
		'GUILD_MEMBER'
	]
});

global.botconfig = require("./config"); // Привязка файла конфига
global.mongoose = require('mongoose');

mongoose.connect(botconfig.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
  console.log('DATABASE | Успешно подключено!')
})

bot.commandsSlash = new Collection(); // Собираем команды в коллекцию
bot.commands = new Collection();
bot.aliases = new Collection();

["command", "events", "slash-commands"].forEach(handler => {
	require(`./handler/${handler}`)(bot)
})

bot.on('ready', async() => {
		bot.user.setStatus("idle"); // dnd idle online invisible
    bot.user.setActivity(`за ${bot.guilds.cache.size} серверами`,{type:"WATCHING"});

		setInterval(async() => {
			bot.user.setStatus("idle"); // dnd idle online invisible
			bot.user.setActivity(`за ${bot.guilds.cache.size} серверами`,{type:"WATCHING"});
		}, 300000)
});

/* Embed функция в боте */
bot.embed = function({ content }) {
	if(content == undefined) return console.error(`ERROR | Неверное использование функции, проверьте аргументы!`)

	let embed = new MessageEmbed()
	.setColor(2066120)
	.setDescription(`**${content}**`)
	return embed;
}

bot.login(botconfig.token);
