
export const singer = state => state.singer
//getters出来处理这些简单数据，还可以担任计算属性的角色
export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

//通过playlist和currentIndex去取得currentSong
//如果取不到就给它一个默认的{}
export const currentSong = (state) => {
    console.log(state)
    return state.playlist[state.currentIndex] || {}
  }

//修改就要到mutation里，修改之前也是先写mutations-types

export const disc = state => state.disc