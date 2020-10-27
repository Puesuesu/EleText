import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import './common/stylus/index.styl'
import './common/stylus/icon.styl'
import '../src/register'

Vue.use(VueResource)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
