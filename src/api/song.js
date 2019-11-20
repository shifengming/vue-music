import {commonParams} from './config'
import axios from 'axios'
export function getLyric (mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json', // 因为是请求本地接口，所以format的json
    g_tk: 1304611190
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    // console.log(res)
    return Promise.resolve(res.data)
  })
}
