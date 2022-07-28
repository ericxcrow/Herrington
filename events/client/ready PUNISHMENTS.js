const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Users = require('../../schemas/Users')

module.exports = async (bot) => {
  let users = await Users.find()
  setInterval(async() => {
    for (let index = 0; index < users.length; ++index) {
      if(Date.now() >= users[index].get('mute.endDate') & users[index].get('mute.endDate') != null & users[index].get('mute.isMuted') == true){
        let guild = await bot.guilds.cache.get(users[index].guild_id)

        let fetchedMember = await guild.members.fetch(users[index].discord_id).catch(() => null)
        let fetchedRole = await guild.roles.fetch(users[index].get('moderation.mute_role')).catch(() => null)

        if(!fetchedRole || !fetchedMember){
          users[index].set(`mute.isMuted`, false)
          users[index].set(`mute.endDate`, null)
          users[index].save().catch(() => null)
          return
        }

        await guild.members.cache.get(users[index].discord_id).roles.remove((fetchedRole), `Истёк срок мута.`)

        users[index].set(`mute.isMuted`, false)
        users[index].set(`mute.endDate`, null)
        users[index].save().catch(() => null)

      }
    }
  }, 10000)
  setInterval(async() => {
    for (let index = 0; index < users.length; ++index) {
      if(Date.now() >= users[index].get('ban.endDate') & users[index].get('ban.endDate') != null & users[index].get('ban.isBanned') == true){
        let guild = await bot.guilds.cache.get(users[index].guild_id)

        let fetchedMember = await guild.members.fetch(users[index].discord_id).catch(() => null)
        let fetchedBan = await guild.bans.fetch(users[index].discord_id).catch(() => null)

        if(!fetchedBan || !fetchedMember){
          users[index].set(`ban.isBanned`, false)
          users[index].set(`ban.endDate`, null)
          users[index].save().catch(() => null)
          return
        }

        await guild.bans.remove(users[index].discord_id, {reason: `Истёк срок блокировки.`})

        users[index].set(`ban.isBanned`, false)
        users[index].set(`ban.endDate`, null)
        users[index].save().catch(() => null)

      }
    }
  }, 10000)
}
