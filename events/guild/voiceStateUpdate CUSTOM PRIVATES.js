const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Guilds = require('../../schemas/Guilds')
const Users = require('../../schemas/Users')

module.exports = async (bot, oldState, newState) => {
  let guilds = await Guilds.findOne({ guild_id: newState.guild.id })
  let users = await Users.findOne({ guild_id: newState.guild.id, discord_id: newState.member.id })

  if(!guilds.privates.get('isEnabled')) return

  if(!newState.guild.me.permissions.has("MANAGE_CHANNELS") & !newState.guild.me.permissions.has("CREATE_INSTANT_INVITE") & !newState.guild.me.permissions.has("MOVE_MEMBERS")) return newState.user.send({ content: `Ошибка! У меня нет прав на управление каналами/создание приглашений/перемещение участников... Рекомендуется дать мне права "Администратора".`, ephemeral: true }).catch(() => null)

  if(newState.channel?.id == guilds?.privates?.get('channelVoice') & newState.channel?.parent?.id == guilds?.privates?.get('category')){
    if (!users?.private?.get('PrivateIsLocked')){
      newState.guild.channels.create(users?.private?.get('PrivateName'),{
          type:'GUILD_VOICE',
          parent:guilds.privates.get('category'),
          userLimit:guilds.privates.get('PrivateSlots'),
          permissionOverwrites:[
            {
              id:newState.member.id,
              allow: ["MANAGE_CHANNELS","MOVE_MEMBERS","DEAFEN_MEMBERS", "MUTE_MEMBERS"]
          },
          {
            id:newState.guild.roles.everyone.id,
            allow: ["VIEW_CHANNEL","CONNECT"]
          },
        ]
      }).then(async(channel) => {
          newState.setChannel(channel)
      })
    }
    if (users?.private?.get('PrivateIsLocked')){
      newState.guild.channels.create(users?.private?.get('PrivateName'),{
          type:'GUILD_VOICE',
          parent:guilds.privates.get('category'),
          userLimit:guilds.privates.get('PrivateSlots'),
          permissionOverwrites:[
            {
              id:newState.member.id,
              allow: ["MANAGE_CHANNELS","MOVE_MEMBERS","DEAFEN_MEMBERS", "MUTE_MEMBERS"]
            },
            {
              id:newState.guild.roles.everyone.id,
              deny: ["VIEW_CHANNEL","CONNECT"]
            },
        ]
      }).then(async(channel) => {
          newState?.setChannel(channel)
      })
    }
  }
  if(oldState.channel?.id != guilds.privates.get('channelVoice') && oldState.channel?.parent?.id == guilds.privates.get('category') && !oldState.channel?.members.size) oldState.channel?.delete();
}
