const { MessageEmbed, Permissions, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "help",
    description: "Помощь по командам бота.",

    async run (bot, message, args) {
      let guilds = await Guilds.findOne({ guild_id: message.guild.id })

      const embed = new MessageEmbed()
        .setColor(guilds.color)

      const help = new MessageSelectMenu()
          .setCustomId('help')
					.setPlaceholder('Ничего не выбрано')
					.addOptions([
						{
							label: 'Модерация',
							description: 'Команды модерации на сервере',
							value: 'moderation',
						},
						{
							label: 'Настройки',
							description: 'Команды настройки бота на сервере',
							value: 'settings',
						},
            {
              label: 'Прочее',
              description: 'Прочие команды бота на сервере',
              value: 'other',
            },
          ])

      const row = new MessageActionRow()
        .addComponents(help)

      embed.setDescription(`Выберите пункт для просмотра команд`)
      await message.reply({ embeds: [embed], components: [row] })
    }
}
