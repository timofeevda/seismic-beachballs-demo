module.exports = {
    entry: './app/src/boot.ts',
    output: {
        path: './dist',
        filename: 'bundle.js'
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