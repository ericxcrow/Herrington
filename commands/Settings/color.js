const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "color",
    description: "Поменять цвет эмбедов.",

    async run (bot, message, args) {
      let guilds = await Guilds.findOne({ guild_id: message.guild.id })
      let regexp = /((#)|(0[xX]))([0-9A-Fa-f]{3,6})/gm;

      let embed = new MessageEmbed()
        .setColor(guilds.color)

      if (!message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner & !message.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
        embed.setDescription(`Ошибка! Недостаточно прав.`);
        return message.reply({ embeds: [embed] })
      }

      if (!args[0]){
        embed.setDescription(`Ошибка! Укажите новый цвет для эмбедов в формате \`HEX\`.`);
        return message.reply({ embeds: [embed] })
      }

      if (args[1]){
        embed.setDescription(`Ошибка! Вы указали более одного аргумента.`);
        return message.reply({ embeds: [embed] })
      }

      if (!args[0].match(regexp)){
        embed.setDescription(`Ошибка! Указанный аргумент не соответствует формату \`HEX\`.`);
        return message.reply({ embeds: [embed] })
      }

      guilds.color = Number(`0x${args[0].replace(/^#/,'').replace(/^0x/,'').replace(/^0X/,'')}`)
      guilds.save()

      embed.setDescription(`Вы изменили цвет эмбедов на \`${args[0]}\`.`);
      embed.setColor(`0x${args[0].replace(/^#/,'').replace(/^0x/,'').replace(/^0X/,'')}`)

      await message.reply({ embeds: [embed] })
    }
}
