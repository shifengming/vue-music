import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
//createLogger通过mutations的方法去修改state,它会在控制台打印一个log
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

//调试工具，这个模式开启会有性能损耗，所以是不建议在线上使用的，还是在开发环境下使用
const debug = process.env.NODE_ENV !== 'production' // 开发环境为true，否则为false

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 严格模式
  plugins: debug ? [createLogger()] : [] // 开发环境下显示vuex的状态修改
})
