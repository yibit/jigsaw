const path = require('path');

module.exports = {
    entry: {
        'awadeu': './src/bin/awadeu.ts',
        'awadec': './src/bin/awadec.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    node: {
        fs: 'empty', child_process: 'empty', __dirname: false,process: false, global: false
    },

    output: {
        path: path.resolve(__dirname, './src/bin/'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },

    resolveLoader: {
        modules: ['node_modules'],
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loaders: ['ts-loader'], exclude: /node_modules/ }
        ]
    },

    externals: {
        "tslib": {
            commonjs: "tslib",
            commonjs2: "tslib",
        },
        "@angular/core": {
            commonjs: "@angular/core",
            commonjs2: "@angular/core"
        },
        "@angular/platform-browser": {
            commonjs: "@angular/platform-browser",
            commonjs2: "@angular/platform-browser"
        },
        "@rdkmaster/jigsaw": {
            commonjs: "@rdkmaster/jigsaw",
            commonjs2: "@rdkmaster/jigsaw"
        },
        "@awade/uid-sdk": {
            commonjs: "@awade/uid-sdk",
            commonjs2: "@awade/uid-sdk"
        },
        "@angular/common/http": {
            commonjs: "@angular/common/http",
            commonjs2: "@angular/common/http"
        },
        "@angular/common": {
            commonjs: "@angular/common",
            commonjs2: "@angular/common"
        },
        "@angular/forms": {
            commonjs: "@angular/forms",
            commonjs2: "@angular/forms"
        },
        "@awade/basics": {
            commonjs: "@awade/basics",
            commonjs2: "@awade/basics"
        },
        "ngx-perfect-scrollbar": {
            commonjs: "ngx-perfect-scrollbar",
            commonjs2: "ngx-perfect-scrollbar"
        }
    }
};
