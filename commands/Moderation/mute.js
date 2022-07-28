const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Guilds = require('../../schemas/Guilds')
const Users = require('../../schemas/Users')

function endsWithAny(suffixes, string) {
	return suffixes.some((suffix) => string.endsWith(suffix));
}

function time(s) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    s = (s - mins) / 60;
    let hrs = s % 24;
    s = (s - hrs) / 24;
    let days = s;
    let status = true;
    let output = "";

    if (days != 0) {
        if (days.toString().endsWith("1") && !days.toString().endsWith("11")) {
            output += `${days} день`;
        } else if (
            endsWithAny(["2", "3", "4"], days.toString()) &&
            !endsWithAny(["12", "13", "14"], days.toString())
        ) {
            output += `${days} дня`;
        } else {
            output += `${days} дней`;
        }
        status = false;
    }
    if (hrs != 0) {
        if (status) {
            if (hrs.toString().endsWith("1") && !hrs.toString().endsWith("11")) {
                output += `${hrs} час`;
            } else if (
                endsWithAny(["2", "3", "4"], hrs.toString()) &&
                !endsWithAny(["12", "13", "14"], hrs.toString())
            ) {
                output += `${hrs} часа`;
            } else {
                output += `${hrs} часов`;
            }
            status = false;
        }
    }
    if (mins != 0) {
        if (status) {
            if (mins.toString().endsWith("1") && !mins.toString().endsWith("11")) {
                output += `${mins} минута`;
            } else if (
                endsWithAny(["2", "3", "4"], mins.toString()) &&
                !endsWithAny(["12", "13", "14"], mins.toString())
            ) {
                output += `${mins} минуты`;
            } else {
                output += `${mins} минут`;
            }
            status = false;
        }
    }
    if (secs != 0) {
        if (status) {
            if (secs.toString().endsWith("1") && !secs.toString().endsWith("11")) {
                output += `${secs} секунда`;
            } else if (
                endsWithAny(["2", "3", "4"], secs.toString()) &&
                !endsWithAny(["12", "13", "14"], secs.toString())
            ) {
                output += `${secs} секунды`;
            } else {
                output += `${secs} секунд`;
            }
            status = false;
        }
    }
    if (ms != 0) {
        if (status) {
            output += `${ms} ms`;
        }
    }
    return output;
}

module.exports = {
    name: "mute",
    description: "Замутить пользователя на сервере.",
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
          embed.setDescription("Ошибка! Укажите, кого Вы хотите отправить в тайм-аут.");
          return message.reply({ embeds: [embed] });
        }

        if(id === message.author.id){
          embed.setDescription("Ошибка! Невозможно отправить в тайм-аут себя.");
          return message.reply({ embeds: [embed] });
        }

				if(id == botconfig.owner || message.guild.members.cache.get(id).roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) || message.guild.members.cache.get(id).roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
					embed.setDescription("Ошибка! Невозможно отправить в тайм-аут модератора. Если это необходимо - вы можете сделать это вручную.");
					return message.reply({ embeds: [embed] });
				}

				if(message.guild.members.cache.get(id).isCommunicationDisabled()){
					embed.setDescription("Ошибка! Данный пользователь уже в тайм-ауте. Снять тайм-аут можно командой !unmute, либо вручную.");
					return message.reply({ embeds: [embed] });
				}

				if(!message.guild.members.cache.get(id).moderatable) {
					embed.setDescription(`Ошибка! У бота недостаточно прав на выдачу тайм-аута данному пользователю/пользователям в целом. Рекомендуется дать боту права "Администратора".`);
					return message.reply({ embeds: [embed] })
				}

				const argsToTime = args[1].split("")
					let tim = []
					let value = []
					argsToTime.forEach(function(item, i, arr) {
						if(!isNaN(item)) parseInt(tim.push(item))
					else value.push(item)
				});

				const parsedTime = {
						s: 1000,
						m: 60000,
						h: 60000*60,
						d: 60000*60*24
				}

				if(tim.length == 0) return message.reply("Нима тайма")

				value = value.join("")

				tim = tim.join("") * parsedTime[value]

				if(tim > 60000*60*24*28){
					embed.setDescription("Ошибка! Невозможно отправить в тайм-аут на срок более 28 дней.");
					return message.reply({ embeds: [embed] });
				}

        const reason = args.slice(2).join(" ");
				await message.delete()

				embed.setTitle("Тайм-аут")
				embed.setTimestamp()
				embed.setDescription(`Пользователь: <@${id}> \`[ID: ${id}]\`\nМодератор: ${message.author} \`[ID: ${message.author.id}]\`\nДлительность тайм-аута: **${time(tim)}**\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
        await message.channel.send({ embeds: [embed] });

				embed.setTitle(`Вы получили тайм-аут на сервере ${message.guild.name}`)
				embed.setTimestamp()
				embed.setDescription(`Модератор: ${message.author} \`[ID: ${message.author.id}]\`\nДлительность тайм-аута: **${time(tim)}**\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
				await bot.users.cache.get(id).send({ embeds: [embed]  }).catch(() => null);

        await message.guild.members.cache.get(id).timeout(tim, `Модератор: ${message.author.tag}. Длительность тайм-аута: ${time(tim)}. Причина: ${reason != "" ? reason : "причина отсутствует"}.`)

				if(!users) return
        users.punishments.push(`[Тайм-аут] <t:${~~(Date.now()/1000)}:F> | Модератор: ${message.author.tag} | Причина: ${reason != "" ? reason : "причина отсутствует"}`)
        users.save().catch(() => null)

				return
			} else {

				embed.setDescription(`Ошибка! Указанная роль мута не найдена на сервере.`)
				let fetchedRole = await message.guild.roles.fetch(guilds.moderation.get('mute_role')).catch(()=> null)
				if (!fetchedRole) return message.reply({ embeds: [embed] })

				if(!id){
          embed.setDescription("Ошибка! Укажите, кого Вы хотите замутить.");
          return message.reply({ embeds: [embed] });
        }

        if(id === message.author.id){
          embed.setDescription("Ошибка! Невозможно замутить себя.");
          return message.reply({ embeds: [embed] });
        }

				if(id == botconfig.owner || message.guild.members.cache.get(id).roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) || message.guild.members.cache.get(id).roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
					embed.setDescription("Ошибка! Невозможно замутить модератора.");
					return message.reply({ embeds: [embed] });
				}

				if(!message.guild.members.cache.get(id).manageable) {
					embed.setDescription(`Ошибка! У бота недостаточно прав на выдачу ролей данному пользователю/пользователям в целом. Рекомендуется дать боту права "Администратора".`);
					return message.reply({ embeds: [embed] })
				}

				if(message.guild.members.cache.get(id).roles.cache.has(guilds.moderation.get('mute_role'))){
          embed.setDescription("Ошибка! Данный пользователь уже в муте. Снять мут можно командой !unmute, либо вручную.");
          return message.reply({ embeds: [embed] });
        }

				const argsToTime = args[1].split("")
					let tim = []
					let value = []
					argsToTime.forEach(function(item, i, arr) {
						if(!isNaN(item)) parseInt(tim.push(item))
					else value.push(item)
				});

				const parsedTime = {
						s: 1000,
						m: 60000,
						h: 60000*60,
						d: 60000*60*24
				}

				if(tim.length == 0) return message.reply("Нима тайма")

				value = value.join("")

				tim = tim.join("") * parsedTime[value]

				const reason = args.slice(2).join(" ");
				await message.delete()

				embed.setTitle("Мут")
				embed.setTimestamp()
				embed.setDescription(`Пользователь: <@${id}> \`[ID: ${id}]\`\nМодератор: ${message.author} \`[ID: ${message.author.id}]\`\nДлительность мута: **${time(tim)}**\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
				await message.channel.send({ embeds: [embed] });

				embed.setTitle(`Вы получили мут на сервере ${message.guild.name}`)
				embed.setTimestamp()
				embed.setDescription(`Модератор: ${message.author} \`[ID: ${message.author.id}]\`\nДлительность мута: **${time(tim)}**\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
				await bot.users.cache.get(id).send({ embeds: [embed]  }).catch(() => null);

				await message.guild.members.cache.get(id).roles.add(guilds.moderation.get('mute_role'), `Модератор: ${message.author.tag}. Длительность мута: ${time(tim)}. Причина: ${reason != "" ? reason : "причина отсутствует"}.`)

				if(!users) return
				users.set(`mute.isMuted`, true)
				users.set(`mute.endDate`, Date.now() + tim)
				users.punishments.push(`[Мут] <t:${~~(Date.now()/1000)}:F> | Модератор: ${message.author.tag} | Причина: ${reason != "" ? reason : "причина отсутствует"}`)
				users.save().catch(() => null)
			}

    }
}
