const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Guilds = require('../../schemas/Guilds')
const Users = require('../../schemas/Users')

module.exports = {
    name: "warnlog",
    description: "Посмотреть историю наказаний пользователя на сервере.",
    async run (bot, message, args) {

      let member = message.mentions.members.first()
      const id = member?.id ?? args[0] ?? message.author.id

      let guilds = await Guilds.findOne({ guild_id: message.guild.id })
      let users = await Users.findOne({ guild_id: message.guild.id, discord_id: id })

      if(guilds.moderation.get('isModerating') == false) return

      let embed = new MessageEmbed()
        .setColor(guilds.color)

			if (id != message.member.id & !message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner & !message.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) & !message.member.roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
				embed.setDescription(`Ошибка! Недостаточно прав.`);
				return message.reply({ embeds: [embed] })
			}

      let desc = ""
      if(users?.punishments?.length <= 0 || !users){
        embed.setDescription(`У данного пользователя пустой варнлог.`)
        return message.reply({ embeds: [embed] })
      } else {
        let i = 0
        embed.setDescription(`**Варнлог пользователя <@${id}>**\n\n${users.punishments.map((x) => `${++i}) ${x}`).join(`\n`)}`)
        return message.reply({ embeds: [embed] })
      }

    }
}
