const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "master-add",
    description: "Добавить мастер-роль.",

    async run (bot, message, args) {
      let guilds = await Guilds.findOne({ guild_id: message.guild.id })

      let embed = new MessageEmbed()
        .setColor(guilds.color)

      if (!message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner ){
        embed.setDescription(`Ошибка! Недостаточно прав.`);
        return message.reply({ embeds: [embed] })
      }

      let role = message.mentions.roles.first()
      let id = role?.id ?? args[0]

      let fetchedRole = await message.guild.roles.fetch(id).catch(() => null)

      if (!id){
        embed.setDescription(`Ошибка! Укажите айди роли/упомяните её.`);
        return message.reply({ embeds: [embed] })
      }

      if (args[1]){
        embed.setDescription(`Ошибка! Вы указали более одного аргумента.`);
        return message.reply({ embeds: [embed] })
      }

      if (!fetchedRole){
        embed.setDescription(`Ошибка! Указанная роль не была найдена на сервере.`);
        return message.reply({ embeds: [embed] })
      }

      if (guilds.master_roles.includes(id)){
        embed.setDescription(`Ошибка! Указанная роль уже является мастер-ролью.`);
        return message.reply({ embeds: [embed] })
      }

      guilds.master_roles.push(id)
      guilds.save()

      embed.setDescription(`Вы добавили новую мастер-роль: <@&${id}>.`);

      await message.reply({ embeds: [embed] })
    }
}
