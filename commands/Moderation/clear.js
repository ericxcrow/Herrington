const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Guilds = require('../../schemas/Guilds')
const Users = require('../../schemas/Users')

module.exports = {
    name: "clear",
    description: "Очистить определённое количество сообщений.",
    async run (bot, message, args) {

      if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: `Ошибка! У меня нет прав на управление сообщениями. Рекомендуется дать боту права "Администратора"...`, ephemeral: true })

      let member = message.mentions.members.first()
      const id = member?.id ?? args[1]

      let guilds = await Guilds.findOne({ guild_id: message.guild.id })
      let users = await Users.findOne({ guild_id: message.guild.id, discord_id: id })

      if(guilds.moderation.get('isModerating') == false) return

      let embed = new MessageEmbed()
        .setColor(guilds.color)

      let fetchedMember = await message.guild.members.fetch(id).catch(() => null);

      if(!args[0]){
        embed.setDescription(`Ошибка! Для очистки сообщений - необходимо указать количество сообщений:\n\`!clear 100\`\n\nТак же, можно указать пользователя, чьи сообщения удалятся в диапазоне указанного значения:\n\`!clear @user/id amount\``)
        return message.reply({ embeds: [embed] })
      }

      await message.delete()

      if(!id){
        message.channel.bulkDelete(Number(args[0]))

        embed.setTitle(`Очистка сообщений`)
        embed.setDescription(`Модератор: ${message.member} \`[ID: ${message.member.id}]\`\nКоличество: \`${Number(args[0])} сообщений\``)
        await message.channel.send({ embeds: [embed] })
      } else {
        message.channel.messages.fetch({ limit: Number(args[0]) }).then(async(messages) => {
          message.channel.bulkDelete(messages.filter(m => m.author.id === id));

          embed.setTitle(`Очистка сообщений`)
          embed.setDescription(`Модератор: ${message.member} \`[ID: ${message.member.id}]\`\nПользователь: <@${id}> \`[ID: ${id}]\`\nКоличество: \`${messages.filter(m => m.author.id === id).size} сообщений\` от пользователя <@${id}> за последние \`${Number(args[0])} сообщений\``)
          await message.channel.send({ embeds: [embed] })
        })
      }


    }
}
