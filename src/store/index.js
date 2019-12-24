import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 在控制台打印修改的日志
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
// 调试工具
const debug = process.env.NODE_ENV !== 'production' // 开发环境为true，否则为false

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 严格模式
  plugins: debug ? [createLogger()] : [] // 开发环境下显示vuex的状态修改
})
