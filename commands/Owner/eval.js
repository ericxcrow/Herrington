module.exports = {
    name: 'eval',
    description: 'Компилятор кода',
    run: async (bot, message, args) => {

        if (message.author.id != botconfig.owner) {
            return message.reply('<:mda:891981612395417631> Ты кринж');
        }

        function generate_token(length) {
            let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.-".split("");
            let b = [];
            for (var i = 0; i < length; i++) {
                let j = (Math.random() * (a.length - 1)).toFixed(0);
                b[i] = a[j];
            }
            return b.join("");
        }

        const code = args.join(' ');
        let result, success, start, stop;
        try {
            start = new Date();
            result = await eval(code.includes('await') ? `(async()=>{${code}})()` : code);
            stop = new Date();
            if (typeof result !== 'string') result = require('util').inspect(result, { depth: 0 });
            if (result.length > 1990) result = result.slice(0, 1990);
            success = true;
        } catch (err) {
            start = new Date();
            result = `${err}`;
            success = false;
        }
        message.reply({
            embeds: [{
                description: `\`\`\`js\n${result.replace(new RegExp(bot.token.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "gi"), generate_token(60))}\`\`\``,
                color: success ? `#2f3136` : `#dc3a3a`,
                footer: { text: `${success ? 'Время обработки: ' + (stop - start) + ' ms' : ''}` }
            }],
            allowedMentions: { repliedUser: false }
        });

    }
}
