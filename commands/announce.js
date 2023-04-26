const {
    CommandType
} = require('wokcommands');

module.exports = {
    description: 'คำสั่งประกาศ',
    type: CommandType.SLASH,
    expectedArgs: '<เนื้อหา>',
    minArgs: 1,
    callback: ({
        args,
        channel
    }) => {

        try {
            const Annembed = {
                "title": "📢 Sabasports Announce",
                "description": args[0],
            };

            channel.send({ embeds: [Annembed], content: `@here` });

            return ({ content: `บอทส่งประกาศของคุณแล้ว ✅`, ephemeral: true })
        } catch (err) {
            return `เกิดข้อผิดพลาดในการประกาศ ❌`
        }
    },
};