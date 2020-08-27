const webpack = require("webpack");
const path = require("path");

module.exports = {
    publicPath: '',
    chainWebpack: config => {
        config.resolve.alias.set('@assets', path.join(__dirname, 'src/assets'))
    },
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(require('./package.json').version)
            }),
        ]
    }
}