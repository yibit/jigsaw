const path = require('path');

module.exports = {
    entry: {
        'out': './src/exports.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },

    resolveLoader: {
        // 去哪些目录下寻找 Loader，有先后顺序之分
        modules: ['node_modules'],
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loaders: ['ts-loader'] }
        ]
    }
};
