const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Users = require('../../schemas/Users')
const Guilds = require('../../schemas/Guilds')

module.exports = async (bot, member) => {
  let guilds = await Guilds.findOne({ guild_id: member.guild.id })
  let roles = []
  if (member.user.bot) return
  let users = await Users.findOne({ guild_id: member.guild.id, discord_id: member.id }) ?? Users.create({ guild_id: member.guild.id, discord_id: member.id, nick_name: member.nickname, mute: { isMuted: false, endDate: null }, ban: { isBanned: false, endDate: null }, private: { PrivateName: `Приват ${member.user.tag}`, PrivateSlots: 0, PrivateIsLocked: false} })

  if(!member.guild.me.permissions.has("MANAGE_NICKNAMES") & !member.guild.me.permissions.has("MANAGE_ROLES")) return

  if(users?.mute?.get('isMuted') & guilds?.moderation?.get('isModerating') & guilds?.moderation?.get('mutes')){
    roles.push(guilds?.moderation?.get('mute_role'))
    if (users?.nick_name == ``){
      await member.edit({ roles: roles }, `Перезаход на сервер.`);
    } else {
      await member.edit({ nick: users?.nick_name, roles: roles }, `Перезаход на сервер.`);
    }
    return
  }

  if (users?.nick_name == null){
    return
  } else {
    await member.edit({ nick: users?.nick_name }, `Перезаход на сервер.`);
  }

  const embed = new MessageEmbed()
    .setColor(guilds.color)

  if(guilds.hello_msg.get('isEnabled') & guilds.hello_msg.get('text') != null) {
    embed.setDescription(guilds.hello_msg.get('text'))
    embed.setTitle(`Добро пожаловать на сервер ${member.guild.name}`)
    let user = await bot.users.fetch(member.id).catch(() => null)
    await user.send({ embeds: [embed] }).catch(() => null)
  } else {
    return
  }

}
