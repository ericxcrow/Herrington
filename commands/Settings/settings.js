const { MessageEmbed, Permissions, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "settings",
    description: "Настройки бота на сервере.",

    async run (bot, message, args) {
      let guilds = await Guilds.findOne({ guild_id: message.guild.id })
      let roles = guilds.master_roles.map((x) => `<@&${x}>`).join(`, `);
      if (guilds.master_roles.length <=0){
        roles = `\`Отсутствуют\``
      }

      const embed = new MessageEmbed()
        .setColor(guilds.color)

      const settings = new MessageSelectMenu()
          .setCustomId('settings')
					.setPlaceholder('Ничего не выбрано')
					.addOptions([
						{
							label: 'Модерация',
							description: 'Настройки системы модерации на сервере',
							value: 'moderation',
						},
						{
							label: 'Тикеты',
							description: 'Настройки системы тикетов на сервере',
							value: 'tickets',
						},
            {
              label: 'Приваты',
              description: 'Настройки системы приватов на сервере',
              value: 'privates',
            },
            {
              label: 'Приветственное сообщение',
              description: 'Настройки приветствия при входе на сервер',
              value: 'hello_msg',
            },
          ])

      const row = new MessageActionRow()
        .addComponents(settings)

      if (!message.member.permissions.has('ADMINISTRATOR') & message.member.id != botconfig.owner & !message.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
        embed.setDescription(`Ошибка! Недостаточно прав.`)
        return message.reply({ embeds: [embed] })
      }

      embed.setDescription(`Выберите пункт для настройки бота на сервере\nМастер-роли: ${roles}`)
      await message.reply({ embeds: [embed], components: [row] })
    }
}
