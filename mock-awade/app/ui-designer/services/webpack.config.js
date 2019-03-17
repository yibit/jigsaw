const path = require('path');

module.exports = {
    entry: {
        'awade-services': './src/exports.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        path: path.resolve(__dirname, '../server/dist/'),
        filename: '[name].js'
    },

    node: {
        fs: 'empty', child_process: 'empty'
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
