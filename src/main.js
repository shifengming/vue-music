// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'

// Vue.config.productionTip = false

/* eslink-disable no-unused-vars */
// import vConsole from 'vconsole'

// import './common/js/vconsole'

console.log('test')

fastclick.attach(document.body)

Vue.use(VueLazyLoad,{
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  
  // components: { App },
  // template: '<App/>'
  render: h => h(App),
  store,
  router
})
