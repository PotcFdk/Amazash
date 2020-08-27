const git = require('git-last-commit');
const util = require('util');

const gitCommit = util.promisify(git.getLastCommit)();

module.exports = (api) => {
    api.registerCommand('build:prerender', async (args) => {
        const committimestamp = (await gitCommit).committedOn;
        api.chainWebpack(config => {
            config.plugin('define').tap(definitions => {
                definitions[0] = Object.assign(definitions[0], {
                    COMMITTIMESTAMP: committimestamp
                });
                return definitions;
            })
        })

        await api.service.run('build', args)
    })
}

module.exports.defaultModes = {
    'build:prerender': 'production'
}