const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "master-remove",
    description: "Удалить мастер-роль.",

    async run (bot, message, args) {
      let guilds = await Guilds.findOne({ guild_id: message.guild.id })

      let embed = new MessageEmbed()
        .setColor(guilds.color)

      if (!message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner & !message.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
        embed.setDescription(`Ошибка! Недостаточно прав.`);
        return message.reply({ embeds: [embed] })
      }

      let role = message.mentions.roles.first()
      let id = role?.id ?? args[0]

      if (!id){
        embed.setDescription(`Ошибка! Укажите айди роли/упомяните её.`);
        return message.reply({ embeds: [embed] })
      }

      if (args[1]){
        embed.setDescription(`Ошибка! Вы указали более одного аргумента.`);
        return message.reply({ embeds: [embed] })
      }

      if (!guilds.master_roles.includes(id)){
        embed.setDescription(`Ошибка! Указанная роль не является мастер-ролью.`);
        return message.reply({ embeds: [embed] })
      }

      guilds.master_roles.pull(id)
      guilds.save()

      embed.setDescription(`Вы удалили мастер-роль: <@&${id}>.`);

      await message.reply({ embeds: [embed] })
    }
}
