import baseApi from './baseApi'

export default {
    newClient(mac) {
        return baseApi.post('/tail/newClient', {mac})
    },
    run() {
        return baseApi.post('/tail/run',{})
    },
    open() {
        return baseApi.post('/tail/open',{})
    }
}