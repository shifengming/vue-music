import originJSONP from 'jsonp'


export default function jsonp(url, data, option){
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

    return new Promise((resolve, reject) => {
        //console.log(resolve)
        originJSONP(url, option, (err, data) => {
            console.log(data)
            if(!err){
                resolve(data)
            } else {
                reject(err)
            }
        })
    }) 
}

function param(data) {
    let url = ''
    for (var k in data){
        let value = data[k] !== undefined? data[k] : ''
        url += '&${k}=${encodeURIComponent(value)}'
    }
    return url ? url.substring(1) : ''
}