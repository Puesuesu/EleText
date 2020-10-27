const webpack = require('webpack')
const appData = require('../vue-sell-cube/data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings
const path = require('path');
function resolve(dir){
    return path.join(__dirname, dir)
}
function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/common/stylus/index.styl'),
      ],
    })
  }
module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  devServer:{
    before(app){
      app.get('/api/seller',function(req,res){
        res.json({
          errno:0,
          data:seller
        })
      })
      app.get('/api/goods',function(req,res){
        res.json({
          errno:0,
          data:goods
        })
      })
      app.get('/api/ratings',function(req,res){
        res.json({
          errno:0,
          data:ratings
        })
      })    
    }
  },
  chainWebpack:config =>{
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))   

  }

}

