import jsonp from 'common/js/jsonp'
import {commonParams, oprions} from './config'

// 获取推荐歌曲接口
export function getTopList () {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
    const data = Object.assign({}, commonParams, {
      uin: 0,
      needNewCode: 1,
      platform: 'h5'
    })
    return jsonp(url, data, oprions)
  }