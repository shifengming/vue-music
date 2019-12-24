import jsonp from 'common/js/jsonp'
import {commonParams, oprions} from './config'
/**
 * jsonp 抓取热门搜索数据
 * 接口：https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg
 * 提供方：https://m.y.qq.com/#search
 */
export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return jsonp(url, data, oprions)
}
// /**
//  * jsonp 抓取搜索检索数据
//  * 接口：https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
//  * 提供方：https://m.y.qq.com/#search
//  */
// export function search (query, page, zhida, perpage) {
//   const url = 'http://s.music.qq.com/fcgi-bin/music_search_new_platform'
//
//   const data = Object.assign({}, commonParams, {
//     g_tk: 5381,
//     uin: 0,
//     platform: 'h5',
//     needNewCode: 1,
//     w: query,
//     zhidaqu: 1,
//     catZhida: zhida ? 1 : 0,
//     t: 0,
//     flag: 1,
//     ie: 'utf-8',
//     sem: 1,
//     aggr: 0,
//     perpage: perpage,
//     n: perpage,
//     p: page,
//     remoteplace: 'txt.mqq.all'
//   })
//   return jsonp(url, data, oprions)
// }
/**
 * jsonp 抓取搜索检索数据
 * 接口：https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
 * 提供方：https://m.y.qq.com/#search
 */
export function search (query, page, perpage, zhida) {
  let url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
  let data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    n: perpage,
    perpage,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 1,
    uin: 0,
    platform: 'h5',
    uid: 0,
    needNewCode: 1,
    remoteplace: 'txt.mqq.all',
    g_tk: 5381
  })
  return jsonp(url, data, oprions)
}
