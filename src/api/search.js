import jsonp from 'common/js/jsonp'
import {commonParams, oprions} from './config'

export function getHotKey(){
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1
    })
    return jsonp(url, data, oprions)
}
export function search(query, page, zhida){
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

    const data = Object.assign({}, commonParams, {
        w: query,
        p: page,
        // n: perpage,
        // perpage,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,
        catZhida: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        // uin: 0,
        // platform: 'h5',
        // uid: 0,
        // needNewCode: 1,
        perpage: 20,
        n: 20,
        remoteplace: 'txt.mqq.all',
        // g_tk: 5381
    })
}