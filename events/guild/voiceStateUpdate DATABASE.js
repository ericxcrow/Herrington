const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Users = require('../../schemas/Users')

module.exports = async (bot, oldState, newState) => {
  if (newState.member.user.bot) return
  let users = await Users.findOne({ guild_id: newState.guild.id, discord_id: newState.member.id }) ?? Users.create({ guild_id: newState.guild.id, discord_id: newState.member.id, nick_name: newState.member.nickname, mute: { isMuted: false, endDate: null }, ban: { isBanned: false, endDate: null }, private: { PrivateName: `Приват ${newState.member.user.tag}`, PrivateSlots: 0, PrivateIsLocked: false} })
}
