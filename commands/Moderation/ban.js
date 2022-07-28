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
    name: "ban",
    description: "Заблокировать пользователя на сервере.",
    async run (bot, message, args) {

      let member = message.mentions.members.first()
      const id = member?.id ?? args[0]

      let guilds = await Guilds.findOne({ guild_id: message.guild.id })
      let users = await Users.findOne({ guild_id: message.guild.id, discord_id: id })

			if(guilds.moderation.get('isModerating') == false) return


      let embed = new MessageEmbed()
        .setColor(guilds.color)

			let fetchedMember = await message.guild.members.fetch(id).catch(() => null) || { bannable: true };

      if(guilds.moderation.get('isModerating') == false) return

			if (!message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner & !message.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role)) & !message.member.roles.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
				embed.setDescription(`Ошибка! Недостаточно прав.`);
				return message.reply({ embeds: [embed] })
			}

      if(!id){
        embed.setDescription("Ошибка! Укажите, кого Вы хотите заблокировать.");
        return message.reply({ embeds: [embed] });        }

      if(id === message.author.id){
        embed.setDescription("Ошибка! Невозможно заблокировать себя.");
        return message.reply({ embeds: [embed] });
      }

  		if(id == botconfig.owner || fetchedMember.roles?.cache.some(r => guilds.master_roles.some(role => r.id == role)) || fetchedMember.roles?.cache.some(r => guilds.mod_roles.some(role => r.id == role))){
  			embed.setDescription("Ошибка! Невозможно заблокировать модератора. Если это необходимо - вы можете сделать это вручную.");
  			return message.reply({ embeds: [embed] });
  		}

			if(!fetchedMember.bannable) {
				embed.setDescription(`Ошибка! У бота недостаточно прав на блокировку данного пользователя/пользователей в целом. Рекомендуется дать боту права "Администратора".`);
				return message.reply({ embeds: [embed] })
			}

      let fetchedBan = await message.guild.bans.fetch(id).catch(() => null)

			if(fetchedBan){
        embed.setDescription("Ошибка! Данный пользователь уже в заблокирован. Снять блокировку можно командой !unban, либо вручную.");
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

			embed.setTitle("Блокировка")
			embed.setTimestamp()
			embed.setDescription(`Пользователь: <@${id}> \`[ID: ${id}]\`\nМодератор: ${message.author} \`[ID: ${message.author.id}]\`\nДлительность блокировки: **${time(tim)}**\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
      await message.channel.send({ embeds: [embed] });

			embed.setTitle(`Вы получили блокировку на сервере ${message.guild.name}`)
			embed.setTimestamp()
			embed.setDescription(`Модератор: ${message.author} \`[ID: ${message.author.id}]\`\nДлительность блокировки: **${time(tim)}**\nПричина: **${reason != "" ? reason : "причина отсутствует"}**`);
			await bot.users?.cache.get(id)?.send({ embeds: [embed]  }).catch(() => null);

      await message.guild.bans.create(id, {reason: `Модератор: ${message.author.tag}. Длительность блокировки: ${time(tim)}. Причина: ${reason != "" ? reason : "причина отсутствует"}.`})

			if(!users) return
      users.set(`ban.isBanned`, true)
      users.set(`ban.endDate`, `${Date.now() + tim}`)
      users.punishments.push(`[Бан] <t:${~~(Date.now()/1000)}:F> | Модератор: ${message.author.tag} | Причина: ${reason != "" ? reason : "причина отсутствует"}`)
      users.save().catch(() => null)

    }
}
