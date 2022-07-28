const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Guilds = require('../../schemas/Guilds')
const Users = require('../../schemas/Users')

module.exports = {
    name: "unban",
    description: "Разблокировать пользователя на сервере.",
    async run (bot, message, args) {

      let member = message.mentions.members.first()
      const id = member?.id ?? args[0]

      let guilds = await Guilds.findOne({ guild_id: message.guild.id })
      let users = await Users.findOne({ guild_id: message.guild.id, discord_id: id })

      if(guilds.moderation.get('isModerating') == false) return

      let embed = new MessageEmbed()
        .setColor(guilds.color)

			let fetchedMember = await message.guild.members.fetch(id).catch(() => null)

      if(guilds.moderation.get('isModerating') == false) return

			if (!message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner & !message.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) & !message.member.roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
				embed.setDescription(`Ошибка! Недостаточно прав.`);
				return message.reply({ embeds: [embed] })
			}

      if(!id){
        embed.setDescription("Ошибка! Укажите, кого Вы хотите разблокировать.");
        return message.reply({ embeds: [embed] });
      }

      if(id === message.author.id){
        embed.setDescription("Ошибка! Невозможно разблокировать себя.");
        return message.reply({ embeds: [embed] });
      }

      let fetchedBan = await message.guild.bans.fetch(id).catch(() => null)

			if(!fetchedBan){
        embed.setDescription("Ошибка! Данный пользователь не заблокирован. Заблокировать можно командой !ban, либо вручную.");
        return message.reply({ embeds: [embed] });
      }

      const reason = args.slice(1).join(" ");
			await message.delete()

			embed.setTitle("Снятие блокировки")
			embed.setTimestamp()
			embed.setDescription(`Пользователь: <@${id}> \`[ID: ${id}]\`\nМодератор: ${message.author} \`[ID: ${message.author.id}]\`\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
      await message.channel.send({ embeds: [embed] });

      await message.guild.bans.remove(id, `Модератор: ${message.author.tag}. Причина: ${reason != "" ? reason : "причина отсутствует"}.`)

			if(!users) return
			users.set(`ban.isBanned`, false)
			users.set(`ban.endDate`, null)
			users.save().catch(() => null)

    }
}
