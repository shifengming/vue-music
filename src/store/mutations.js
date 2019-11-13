import * as types from './mutation-types'

const mutations = {
    // state是状态中的state，singer是传递的payload
    // 歌手信息
    [types.SET_SINGER] (state, singer) {
      state.singer = singer
    }
}

export default mutations
