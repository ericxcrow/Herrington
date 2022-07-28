const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Users = require('../../schemas/Users')
const Guilds = require('../../schemas/Guilds')

module.exports = async (bot, oldMember, newMember) => {
  let guilds = await Guilds.findOne({ guild_id: newMember.guild.id })
  if (newMember.user.bot) return
  let users = await Users.findOne({ guild_id: newMember.guild.id, discord_id: newMember.user.id })
  if(!users) return
  if (newMember?.nickname == null){
    users.nick_name = ``
    users.save().catch(() => null)
  } else {
    users.nick_name = newMember?.nickname
    users.save().catch(() => null)
  }
}
