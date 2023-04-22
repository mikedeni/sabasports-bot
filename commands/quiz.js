const {
    CommandType
} = require('wokcommands');

module.exports = {
    name: 'quiz',
    description: 'คำถามที่กระตุ้นให้คิด',
    type: CommandType.BOTH,
    expectedArgs: '<question> <choice 1> <choice 2> <correct choice> <time in minutes>',
    minArgs: 5,
    callback: ({
        args,
        channel,
        message
    }) => {
        if (message) {
            message.delete();
        };

        const question = args[0];
        const choices = [args[1], args[2]];
        const correctAns = parseInt(args[3]) - 1;
        const timeLimit = parseFloat(args[4]) * 60 * 1000; // In Min

        const embed = {
            "title": "💡 Quiz! - คำถามชวนคิด",
            "description": `> ถามว่า ${question}`,
            "color": null,
            "fields": [
                {
                    "name": "ข้อที่ 1",
                    "value": `${choices[0]}`,
                    "inline": true
                },
                {
                    "name": "ข้อที่ 2",
                    "value": `${choices[1]}`,
                    "inline": true
                }
            ],
            "footer": {
                "text": `🕐 ให้เวลาตอบ ${parseFloat(args[4])} นาที`
            }
        }

        channel.send({ embeds: [embed] });

        const filter = (m) => {
            return !m.author.bot;
        };

        const collector = channel.createMessageCollector({
            filter,
            time: timeLimit,
        });

        const answeredUsers = new Set();
        const correctUsers = [];

        console.log(`[CMD] Run Quiz!!`);

        collector.on('collect', (m) => {
            if (answeredUsers.has(m.author.id)) {
                return m.reply(`ตอบได้เพียงครั้งเดียวเท่านั้น ❌`);
            } else {
                if (m.content !== '1' && m.content !== '2') {
                    return m.reply(`ตอบได้เพียง 1 กับ 2 เท่านั้น 🔃`);
                };

                if (parseInt(m.content) == correctAns + 1) {
                    console.log(`${m.author} Ans: ${parseInt(m.content)}`);
                    console.log(`${m.author} Correct!`);
                    correctUsers.push(m.author);
                } else {
                    console.log(`${m.author} Ans: ${parseInt(m.content)}`);
                    console.log(`${m.author} Incorrect!`);
                };

                m.author.send(`🙏 ขอบคุณที่ร่วมสนุก กับคำถาม ${question} เราจะประกาศผลในอีก ${parseFloat(args[4])} นาที`);
                answeredUsers.add(m.author.id);
                return m.reply(`เราได้บันทึกคำตอบของคุณแล้ว ✅`);
            };
        });

        collector.on('end', (collected) => {
            console.log(`User answered: ${answeredUsers.size}`);
            console.log(`User Correct: ${correctUsers.join(', ')}`);
            console.log(`User Correct amount: ${correctUsers.length}`);

            const embed = {
                "title": "✨ Timeout! - หมดเวลา",
                "description": `${question} คำตอบคือ: ${choices[correctAns]}`,
                "color": null,
                "fields": [
                    {
                        "name": "เข้าร่วม",
                        "value": `${answeredUsers.size} คน`,
                        "inline": true
                    },
                    {
                        "name": "ตอบถูก",
                        "value": `${correctUsers.length} คน`,
                        "inline": true
                    }
                ],
                "footer": {
                    "text": `🙏 ขอบคุณทุกท่านที่เข้าร่วม`
                }
            }

            if (correctUsers.length != 0) {
                channel.send({ embeds: [embed], content: `🎉 คำถามจบลงแล้ว ผู้ที่ตอบถูกคือ ${correctUsers}` });
            } else {
                channel.send({ embeds: [embed], content: `🎉 คำถามจบลงแล้ว ไม่มีผู้ที่ตอบถูก 😢` });
            };
        });
    },
};