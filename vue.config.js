const path = require('path')
const glob = require('glob')
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

function resolve(dir) {
    return path.join(__dirname, dir)
}
// 配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
    const entries = {}
    let basename; let tmp; let pathname

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry))
        // console.log(entry)
        tmp = entry.split('/').splice(-3)
        console.log(tmp)
        pathname = basename // 正确输出js和html的路径
        entries[pathname] = {
            entry: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[1] + '.js',
            template: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') ? 'public/' + tmp[2] : 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[2],
            filename: tmp[2]
        }
    })
    return entries
}
// 获取多页面
const pages = getEntry('./src/pages/**?/*.html')
// CDN包
const externals = {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios',
    'element-ui': 'ELEMENT',
    'xlsx': 'XLSX'
}
// 配置end
// 配置end
console.log('----------------- process.env.VUE_APP_OutputDir :', process.env.VUE_APP_OutputDir)
console.log('----------------- process.env.NODE_ENV :', process.env.NODE_ENV)

module.exports = {
    lintOnSave: true, // 禁用eslint
    baseUrl: process.env.NODE_ENV === 'production' ? '/Admin/' : '/',
    outputDir: process.env.VUE_APP_OutputDir || 'dev',
    productionSourceMap: !process.env.NODE_ENV === 'production',
    filenameHashing: true,
    pages,
    devServer: {
        index: 'index.html', // 默认启动serve 打开page1页面
        open: process.platform === 'darwin',
        host: '',
        port: 8089,
        https: false,
        hotOnly: false,
        headers: { 'X-Frame-Options': 'SAMEORIGIN' },
        proxy: {
            '/upms/': {
                target: 'http://10.222.21.157:5008/',
                // target: 'http://10.1.49.26:5008/',

                changeOrigin: true,
                pathRewrite: {
                    '^/upms': ''
                }
            },
            '/wa/': {
                target: 'http://api.match.hexun.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/wa': ''
                }
            }
        }, // 设置代理
        before: () => { }
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        // 移除 preload 插件
        config.plugins.delete('preload')
        Object.keys(pages).forEach(entryName => {
            config.plugins.delete(`prefetch-${entryName}`)
        })
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => {
                // 修改它的选项...
                options.limit = 100
                return options
            })

        if (process.env.NODE_ENV === 'production') {
            console.log('----------------- process.env.OutputDir2 :', process.env.VUE_APP_OutputDir)
            config.plugin('extract-css').tap(() => [{
                path: path.join(__dirname, './' + process.env.VUE_APP_OutputDir),
                filename: 'css/[name][hash:8].css'
            }])
        }
    },
    configureWebpack: config => {
        config.resolve = {
            extensions: ['.ts', '.tsx', '.js', '.vue', '.json', '.css'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src')
            }
        }
        config.module.rules = [
            ...config.module.rules,
            ... [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }
            ]
        ]
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
            config.externals = externals
        }
        // 开启Gzip
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
            const plugins = []
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            )
            config.plugins = [
                ...config.plugins,
                ...plugins
            ]
        }
    },
    css: {
        loaderOptions: {
            sass: {
                data: ' @import "@/styles/_variable.scss"; '
            }
        }
    }
}
