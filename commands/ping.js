const { CommandType } = require('wokcommands');

module.exports = {
    description: 'Ping Pong Command',
    type: CommandType.BOTH,

    callback() {
        return ({
            content: `Pong!`
        });
    }
};