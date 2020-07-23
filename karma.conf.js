const webpackConfig = require('./webpack.config');

module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        files: ['./test/*.ts', './test/*.js'],

        exclude: [],

        browserNoActivityTimeout: 60000,
        browserDisconnectTimeout: 60000,

        preprocessors: {
            'test/**/*.ts': ['webpack'],
            'test/**/*.js': ['webpack'],
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
            mode: 'development',
            devtool: 'inline-source-map',
        },
        webpackMiddleware: {
            stats: 'errors-only',
        },

        reporters: ['spec', 'summary'],
        specReporter: {
            // maxLogLines: 5,
            suppressErrorSummary: true,
            suppressFailed: false,
            suppressPassed: false,
            suppressSkipped: true,
            showSpecTiming: false,
            failFast: false,
        },
        summaryReporter: {
            show: 'all',
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: false,
        concurrency: Infinity,
    });
};
