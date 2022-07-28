const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Guilds = require('../../schemas/Guilds')
const Users = require('../../schemas/Users')

module.exports = {
    name: "kick",
    description: "Выгнать пользователя с сервера.",
    async run (bot, message, args) {

      let member = message.mentions.members.first()
      const id = member?.id ?? args[0]

      let guilds = await Guilds.findOne({ guild_id: message.guild.id })
      let users = await Users.findOne({ guild_id: message.guild.id, discord_id: id })

      if(guilds.moderation.get('isModerating') == false) return

      let embed = new MessageEmbed()
        .setColor(guilds.color)
				.setDescription(`Ошибка! Данный пользователь не является участником сервера.`)

			let fetchedMember = await message.guild.members.fetch(id).catch(() => null)
			if (!fetchedMember) return message.reply({ embeds: [embed] })

			if (!message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner & !message.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) & !message.member.roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
				embed.setDescription(`Ошибка! Недостаточно прав.`);
				return message.reply({ embeds: [embed] })
			}

      if(!id){
        embed.setDescription("Ошибка! Укажите, кого Вы хотите выгнать с сервера.");
        return message.reply({ embeds: [embed] });
      }

      if(id === message.author.id){
        embed.setDescription("Ошибка! Невозможно выгнать с сервера себя.");
        return message.reply({ embeds: [embed] });
      }

      if(!message.guild.members.cache.get(id).kickable) {
        embed.setDescription(`Ошибка! У бота недостаточно прав на кик данного пользователю/пользователям в целом. Рекомендуется дать боту права "Администратора".`);
        return message.reply({ embeds: [embed] })
      }

			if(id == botconfig.owner || message.guild.members.cache.get(id).roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) || message.guild.members.cache.get(id).roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
				embed.setDescription("Ошибка! Невозможно выгнать с сервера модератора. Если это необходимо - вы можете сделать это вручную.");
				return message.reply({ embeds: [embed] });
			}

      const reason = args.slice(1).join(" ");
			await message.delete()

			embed.setTitle("Кик")
			embed.setTimestamp()
			embed.setDescription(`Пользователь: <@${id}> \`[ID: ${id}]\`\nМодератор: ${message.author} \`[ID: ${message.author.id}]\`\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
      await message.channel.send({ embeds: [embed] });

			embed.setTitle(`Вас выгнали с сервера ${message.guild.name}`)
			embed.setTimestamp()
			embed.setDescription(`Модератор: ${message.author} \`[ID: ${message.author.id}]\`\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
			await bot.users.cache.get(id).send({ embeds: [embed]  }).catch(() => null);

      await message.guild.members.cache.get(id).kick(`Модератор: ${message.author.tag}. Причина: ${reason != "" ? reason : "причина отсутствует"}.`)

      if(!users) return
      users.punishments.push(`[Кик] <t:${~~(Date.now()/1000)}:F> | Модератор: ${message.author.tag} | Причина: ${reason != "" ? reason : "причина отсутствует"}`)
      users.save().catch(() => null)

    }
}
