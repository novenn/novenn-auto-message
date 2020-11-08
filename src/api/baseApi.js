// const BASE = process.env.NODE_ENV==='development' ? 'http://localhost:8080' : 'https://auto.novenn.com'
const BASE = 'https://auto.novenn.com'
const superagent = require('superagent')

export default {
    get(url, data = {}) {
        const queryStr = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&') 
        url = /\?/.test(url)? `${url}&${queryStr}` : `${url}?${queryStr}`

        return new Promise((resolve, reject) => {
            superagent.get(BASE + url).end((err, res) => {
                if(err) {
                    return reject(err)
                }
                console.log(res.text)
                resolve(res.text && JSON.parse(res.text))
            })
        })
    },

    post(url, data = {}) {
        return new Promise((resolve, reject) => {
            superagent.post(BASE + url, data).end((err, res) => {
                if(err) {
                    return reject(err)
                }

                resolve(res.text && JSON.parse(res.text))
            })
        })
    }
}