module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'postcss-loader'],
            },
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'astroturf/loader'],
            }
        ]
    }
}