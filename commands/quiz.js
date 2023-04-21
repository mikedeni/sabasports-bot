const { CommandType } = require('wokcommands');

module.exports = {
    name: 'quiz',
    description: 'คำถามที่กระตุ้นให้คิด',
    type: CommandType.BOTH,
    expectedArgs: '<choice 1> <choice 2> <correct answer index> <time in minutes>',
    minArgs: 4,
    callback: ({ message, interaction, args }) => {
        const question = `คุณไมค์ชอบกินอะไร`;
        const choices = [args[0], args[1]];
        const correctAns = parseInt(args[2]) - 1;
        const timeLimit = parseFloat(args[3]) * 60 * 1000; // In Min

        // Create and send your message
        const target = message || interaction;
        if (!target) {
            console.log('Error: No message or interaction object available.');
            return;
        }
        target.delete();
        const questionString = `${question}\n\n${choices.map((choice, index) => `${index + 1} - ${choice}`).join('\n')}`;
        target.channel.send(questionString);

        // Listen for the user's response and check if it's correct
        const filter = m => m.author.id === (message ? message.author.id : interaction.user.id);
        const collector = target.channel.createMessageCollector({ filter, time: timeLimit });

        const answeredUsers = new Set();

        // When a player sends a message, check if they have already responded previously
        collector.on('collect', m => {
            // Check if user has already answered
            if (answeredUsers.has(m.author.id)) {
                m.delete();
                m.channel.send(`${m.author}, ตอบได้เพียงครั้งเดียวเท่านั้น ❌`)
                    .then((message) => {
                        setTimeout(() => {
                            message.delete();
                        }, 1500);
                    });
                return;
            } else {
                // Add new user object to set
                answeredUsers.add(m.author.id);
            };

            if (m.content !== '1' && m.content !== '2') {
                m.channel.send(`${m.author} ตอบได้เพียง 1 กับ 2 เท่านั้น! กรุณาตอบใหม่อีกครั้ง ❌`);
                return answeredUsers.delete(m.author.id);
            };
        });

        // After time runs out, calculate number of correct answers and send result message
        collector.on('end', collected => {
            const target = message || interaction;
            if (!target) {
                console.log('Error: No message or interaction object available.');
                return;
            }

            const correctUser = collected.filter(m => parseInt(m.content) - 1 === correctAns);

            console.log(correctUser);

            if (correctUser.size === 0) {
                return target.channel.send(`😢 ไม่มีใครตอบถูกเลย!`);
            }

            const correctUsernames = correctUser.map(m => m.author).join(', ');

            const channel = target.channel;

            channel.send(`
                ❗ มีคนตอบทั้งหมด ${collected.size} คน ถูก ${correctUser.size} คน
                \n\n✅ คำตอบที่ถูกต้องคือ ${correctAns + 1} - ${choices[correctAns]}
                \n\n🎉 ผู้ที่ตอบถูกได้แก่ ${correctUsernames}
            `);
        });
    },
};