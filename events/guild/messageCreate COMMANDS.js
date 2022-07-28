const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = async (bot, message) => {
  let guilds = await Guilds.findOne({ guild_id: message.guildId })

  if (message.channel.type === "DM") return

  var prefix = guilds.prefix;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = bot.commands.get(command) || bot.aliases.get(command);

	if (!cmd) return;

	cmd.run(bot, message, args);
}
