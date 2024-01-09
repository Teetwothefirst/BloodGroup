const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/script.js',
    output: {
        path: path.resolve(__dirname, 'dist/main.js'),
        filename: 'bundle.js'
    }
}