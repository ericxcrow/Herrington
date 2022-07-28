const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Guilds = require('../../schemas/Guilds')
const Users = require('../../schemas/Users')

module.exports = {
    name: "unmute",
    description: "Размутить пользователя на сервере.",
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

      if(guilds.moderation.get('mutes') == false) {

        if(!id){
          embed.setDescription("Ошибка! Укажите, кому Вы хотите снять тайм-аут.");
          return message.reply({ embeds: [embed] });
        }

        if(id === message.author.id){
          embed.setDescription("Ошибка! Невозможно снять тайм-аут самому себе.");
          return message.reply({ embeds: [embed] });
        }

				if(id == botconfig.owner || message.guild.members.cache.get(id).roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) || message.guild.members.cache.get(id).roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
					embed.setDescription("Ошибка! Невозможно снять тайм-аут модератору. Если это необходимо - вы можете сделать это вручную.");
					return message.reply({ embeds: [embed] });
				}

        if(!message.guild.members.cache.get(id).moderatable) {
          embed.setDescription(`Ошибка! У бота недостаточно прав на снятие тайм-аута данному пользователю/пользователям в целом. Рекомендуется дать боту права "Администратора".`);
          return message.reply({ embeds: [embed] })
        }

				if(!message.guild.members.cache.get(id).isCommunicationDisabled()){
          embed.setDescription("Ошибка! Данный пользователь ещё не в в тайм-ауте. Отправить в тайм-аут можно командой !mute, либо вручную.");
          return message.reply({ embeds: [embed] });
        }

        const reason = args.slice(2).join(" ");
				await message.delete()

				embed.setTitle("Снятие тайм-аута")
				embed.setTimestamp()
				embed.setDescription(`Пользователь: <@${id}> \`[ID: ${id}]\`\nМодератор: ${message.author} \`[ID: ${message.author.id}]\`\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
        await message.channel.send({ embeds: [embed] });

				embed.setTitle(`Вам сняли тайм-аут на сервере ${message.guild.name}`)
				embed.setTimestamp()
				embed.setDescription(`Модератор: \`${message.member.displayName}\` \`[ID: ${message.author.id}]\`\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
				await bot.users.cache.get(id).send({ embeds: [embed]  }).catch(() => null);

        await message.guild.members.cache.get(id).timeout(null, `Модератор: ${message.author.tag}. Причина: ${reason != "" ? reason : "причина отсутствует"}.`)

				return
			} else {

				embed.setDescription(`Ошибка! Указанная роль мута не найдена на сервере.`)
				let fetchedRole = await message.guild.roles.fetch(guilds.moderation.get('mute_role')).catch(()=> null)
				if (!fetchedRole) return message.reply({ embeds: [embed] })

				if(!id){
          embed.setDescription("Ошибка! Укажите, кого Вы хотите размутить.");
          return message.reply({ embeds: [embed] });
        }

        if(id === message.author.id){
          embed.setDescription("Ошибка! Невозможно размутить себя.");
          return message.reply({ embeds: [embed] });
        }

				if(id == botconfig.owner || message.guild.members.cache.get(id).roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) || message.guild.members.cache.get(id).roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
					embed.setDescription("Ошибка! Невозможно размутить модератора.");
					return message.reply({ embeds: [embed] });
				}

				if(message.guild.members.cache.get(id).roles.cache.has(guilds.moderation.get('mute_role'))){
          embed.setDescription("Ошибка! Данный пользователь ещё не муте. Замутить можно командой !mute, либо вручную.");
          return message.reply({ embeds: [embed] });
        }

        if(!message.guild.members.cache.get(id).manageable) {
          embed.setDescription(`Ошибка! У бота недостаточно прав на снятие ролей данному пользователю/пользователям в целом. Рекомендуется дать боту права "Администратора".`);
          return message.reply({ embeds: [embed] })
        }

				const reason = args.slice(2).join(" ");
				await message.delete()

				embed.setTitle("Снятие мута")
				embed.setTimestamp()
				embed.setDescription(`Пользователь: <@${id}> \`[ID: ${id}]\`\nМодератор: ${message.author} \`[ID: ${message.author.id}]\`\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
				await message.channel.send({ embeds: [embed] });

				embed.setTitle(`Вам сняли мут на сервере ${message.guild.name}`)
				embed.setTimestamp()
				embed.setDescription(`Модератор: \`${message.member.displayName}\` \`[ID: ${message.author.id}]\`\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
				await bot.users.cache.get(id).send({ embeds: [embed]  }).catch(() => null);

				await message.guild.members.cache.get(id).roles.remove(guilds.moderation.get('mute_role'), `Модератор: ${message.author.tag}. Причина: ${reason != "" ? reason : "причина отсутствует"}.`)

				users.set(`mute.isMuted`, false)
				users.set(`mute.endDate`, null)
				users.save().catch(() => null)
			}

    }
}
