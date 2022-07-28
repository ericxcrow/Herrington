const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "prefix",
    description: "Поменять префикс бота на сервере.",

    async run (bot, message, args) {
      let guilds = await Guilds.findOne({ guild_id: message.guild.id })

      let embed = new MessageEmbed()
        .setColor(guilds.color)

      if (!message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner & !message.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
        embed.setDescription(`Ошибка! Недостаточно прав.`);
        return message.reply({ embeds: [embed] })
      }

      if (!args[0]){
        embed.setDescription(`Ошибка! Укажите новый префикс для бота.`);
        return message.reply({ embeds: [embed] })
      }

      if (args[1]){
        embed.setDescription(`Ошибка! Вы указали более одного аргумента.`);
        return message.reply({ embeds: [embed] })
      }

      guilds.prefix = args[0]
      guilds.save()

      embed.setDescription(`Вы изменили префикс бота на сервере на \`${args[0]}\`.`);

      await message.reply({ embeds: [embed] })
    }
}
