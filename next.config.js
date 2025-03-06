const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const envFilePath = path.join(__dirname, `.env.${process.env.NODE_ENV}`);
const envJson = dotenv.parse(fs.readFileSync(envFilePath));

console.log('process.env.envJson', envJson);
const basePath = envJson.APP_ENV === 'local' ? '' : '/payment';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: function (config) {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    basePath,
    assetPrefix: basePath,
    env: envJson,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    },
    compiler: {
        styledComponents: true
    },
    // typescript: {
    //     ignoreBuildErrors: false
    // },

    // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    //     config.plugins.push(
    //         new webpack.DefinePlugin({
    //             'process.env.ASSET_PREFIX': JSON.stringify(basePath)
    //         })
    //     );

    //     // Modify publicPath for resource loaders
    //     config.module.rules.forEach((rule) => {
    //         if (rule.use && Array.isArray(rule.use)) {
    //             rule.use.forEach((useRule) => {
    //                 if (useRule.loader === 'file-loader' || useRule.loader === 'url-loader') {
    //                     useRule.options = {
    //                         ...useRule.options,
    //                         publicPath: `${basePath}${useRule.options?.publicPath || '/_next'}`
    //                     };
    //                 }
    //             });
    //         }
    //     });

    //     return config;
    // },

    // Using webpack transformation
    // webpack: (config, options) => {
    //     config.module.rules.push({
    //         test: /\.(png|jpg|jpeg|gif|svg|ico|eot|ttf|woff|woff2)$/,
    //         use: {
    //             loader: 'url-loader',
    //             options: {
    //                 limit: 100000,
    //                 name: '[name].[ext]',
    //                 publicPath: (url) => `/payment${url}`
    //             }
    //         }
    //     });

    //     return config;
    // },

    // Transform output HTML and CSS
    // async rewrites() {
    //     return {
    //         beforeFiles: [
    //             {
    //                 source: '/payment/:path*',
    //                 destination: '/:path*'
    //             }
    //         ]
    //     };
    // },

    // enable /app
    experimental: {
        appDir: true
    },

    // configuring the output directory for dynamic pages
    output: 'standalone'

    // async rewrites() {
    //     return [];
    // }
};

module.exports = nextConfig;
