const path = require('path');
const createServiceIndexes = require('./webpack-task/service-extractor');

createServiceIndexes(`${__dirname}/src`, `${__dirname}/../server`);

module.exports = {
    entry: {
        'awade-services': './src/exports.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        path: path.resolve(__dirname, '../server/dist'),
        filename: '[name].js'
    },

    resolveLoader: {
        // 去哪些目录下寻找 Loader，有先后顺序之分
        modules: ['node_modules', './webpack-task'],
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loaders: ['ts-loader', 'attach-console-definition'] }
        ]
    }
};
