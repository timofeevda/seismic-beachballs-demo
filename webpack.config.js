var webpack = require('webpack')

module.exports = {
    entry: {
      app : './app/src/boot.ts',
      vendors : './app/src/vendors.ts'
    },
    output: {
        path: './dist',
        filename: '[name].js'
    },
    node: {
        fs: "empty"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    }
};
