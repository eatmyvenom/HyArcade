const methods = { https : require('https'), http : require('http') }

module.exports = function webRequest(url) {
    return new Promise((resolve,reject) => {
        let method = 'http';
        if((""+url).startsWith('https')) {
            method = 'https'
        }
        methods[method].get(url, (res) => {
            let reply = '';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve({data : reply, headers : res.headers, status : res.statusCode})});
            res.on('error',err=>{reject(err)});
        });
    });
}