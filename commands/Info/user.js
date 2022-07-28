const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "user",
    description: "Посмотреть информацию о пользователе.",

    async run (bot, message, args) {
      let guilds = await Guilds.findOne({ guild_id: message.guild.id })

      const user = message.mentions.users.first();
      let id = user?.id ?? args[0] ?? message.author.id
      let fetched_user = await bot.users.fetch(id, { force: true })
      let fetched_member = await message.guild.members.fetch(id).catch(() => null)
      const avatarUrl = await fetched_user.avatarURL({ dynamic: true, size: 1024} );
      const bannerUrl = await fetched_user.bannerURL({ dynamic: true, size: 4096 });

      let embed = new MessageEmbed()
        .setColor(guilds.color)

      if (args[1]){
        embed.setDescription(`Ошибка! Вы указали более одного аргумента.`);
        return message.reply({ embeds: [embed] })
      }

      let userinfo = [
          `${fetched_user.bot ? '**Информация о боте:**' : '**Информация о пользователе:**'}`,
          `**✮** ${fetched_user.bot ? 'Имя бота' : 'Имя пользователя'}: **\`${fetched_user.username}#${fetched_user.discriminator}\`**`,
          `**✮** ID: **\`${fetched_user.id}\`**`,
          `**✮** Профиль: **${fetched_user}** [**\`--> Ссылка <--\`**](https://discordapp.com/users/${fetched_user.id})`,
          `**✮** Аккаунт создан: <t:${~~(fetched_user.createdTimestamp/1000)}:F>`,
      ].map((x) => x).join(`\n`)

      if(!fetched_member){
        embed.setDescription(`${userinfo}`)
        embed.setImage(bannerUrl)
        embed.setThumbnail(avatarUrl)

        return message.reply({ embeds: [embed] });
      }

      let server_user_info = [
          `**Серверная информация:**`,
          `**✮** Серверный никнейм: **\`${fetched_member.nickname ? fetched_member.nickname : "Никнейм отсутствует"}\`**`,
          `**✮** Зашел на сервер: <t:${~~(fetched_member.joinedTimestamp/1000)}:F>`,
      ].map((x) => x).join(`\n`)

      let userRoles = fetched_member.roles.cache.sort((a, b) => b.position - a.position).map((x) => x).filter((z) => z.name !== "@everyone").join(`\n`);

      let user_roles = [
          `**Роли пользователя:**`,
          `${userRoles}`
      ].map((x) => x).join(`\n`)

      let color = fetched_member.displayHexColor;
      try {
        if (color == '#000000') color = (fetched_user.hoistRole.hexColor);
        } catch (error) {
            color = `#2f3136`
        }

          if (userRoles.length > 3000) {
              userRoles = "🥴 Я столько считать не умею....их так много...голова кружится...";
          }

          let bust = fetched_member.premiumSince
          if (!fetched_member.premiumSince) bust = "Сейчас не бустит сервер"
          if (fetched_member.premiumSince) bust = "Является бустером сервера на данный момент"

          let memberStatm;
          let memberStat = fetched_member.presence?.status;
          if (memberStat === "online") memberStatm = `Онлайн 🟢`;
          if (memberStat === "offline") memberStatm = `Офлайн ⚫️`;
          if (memberStat === "idle") memberStatm = `Отошёл 🌙`;
          if (memberStat === "dnd") memberStatm = `Не беспокоить ⛔`;
          if (!memberStat) memberStatm = `Офлайн ⚫️`;

          let status_pc = `\`Не в сети\``;
          let status_web = `\`Не в сети\``;
          let status_mobile = `\`Не в сети\``;

          let client_status = fetched_member.presence?.clientStatus
          if (client_status) {
            let client_status_pc = client_status.desktop
            let client_status_web = client_status.web
            let client_status_mobile = client_status.mobile

            if (client_status_pc) status_pc = `🖥️`
            if (client_status_web) status_web = `📡`
            if (client_status_mobile) status_mobile = `📱`
          }
          if (!client_status) {
            status_pc = `\`Не в сети\``;
            status_web = `\`Не в сети\``;
            status_mobile = `\`Не в сети\``;
          }

          let user_status = [
            `**Статусы:**`,
            `**✮** ${memberStatm}`,
            ` `,
            `**✮** ПК клиент: ${status_pc}`,
            `**✮** ВЕБ Клиент: ${status_web}`,
            `**✮** МОБильный клиент: ${status_mobile}`
          ].map((x) => x).join(`\n`)

          let user_bust = [
            `**Буст сервера:**`,
            `**✮** ${bust}`
          ].map((x) => x).join(`\n`)

          embed.setColor(color)
          embed.setDescription(`${userinfo}\n\n${server_user_info}\n\n${user_roles}\n\n${user_status}\n\n${user_bust}`)
          embed.setImage(bannerUrl)
          embed.setThumbnail(avatarUrl)

          await message.reply({ embeds: [embed] });

    }
}
