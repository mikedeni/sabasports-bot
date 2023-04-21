const {
    CommandType
} = require('wokcommands');

module.exports = {
    name: 'quiz',
    description: 'คำถามที่กระตุ้นให้คิด',
    type: CommandType.BOTH,
    expectedArgs: '<choice 1> <choice 2> <correct answer index> <time in minutes>',
    minArgs: 4,
    callback: ({
        message,
        interaction,
        args
    }) => {
        const question = `คุณไมค์ชอบกินอะไร`;
        const choices = [args[0], args[1]];
        const correctAns = parseInt(args[2]) - 1;
        const timeLimit = parseFloat(args[3]) * 60 * 1000; // In Min

        const target = message || interaction;
        if (!target) {
            console.log('Error: No message or interaction object available.');
            return;
        };

        if (target == message) {
            target.delete();
        };

        target.channel.send(
            `${question}\n\n${choices
                .map((choice, index) => `${index + 1} - ${choice}`)
                .join('\n')}`
        );

        const filter = (m) => {
            return !m.author.bot;
        };

        const collector = target.channel.createMessageCollector({
            filter,
            time: timeLimit,
        });

        const answeredUsers = new Set();

        collector.on('collect', (m) => {
            if (answeredUsers.has(m.author.id)) {
                return m.reply(`ตอบได้เพียงครั้งเดียวเท่านั้น ❌`);
            } else {
                if (m.content !== '1' && m.content !== '2') {
                    return m.reply(`ตอบได้เพียง 1 กับ 2 เท่านั้น 🔃`);
                };
                answeredUsers.add(m.author.id);
                return m.reply(`เราได้บันทึกคำตอบของคุณแล้ว ✅`);
            };
        });

        collector.on('end', (collected) => {
            for (const AllAnswer of collected) {
                console.log(AllAnswer);
            }
        });
    },
};