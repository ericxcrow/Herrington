const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Users = require('../../schemas/Users')

module.exports = async (bot, message) => {
  if (message.channel.type === "DM") return
  if (message.author.bot) return
  let users = await Users.findOne({ guild_id: message.guildId, discord_id: message.author.id }) ?? Users.create({ guild_id: message.guildId, discord_id: message.author.id, nick_name: message.member.nickname, mute: { isMuted: false, endDate: null }, ban: { isBanned: false, endDate: null }, private: { PrivateName: `Приват ${message.author.tag}`, PrivateSlots: 0, PrivateIsLocked: false} })
}
