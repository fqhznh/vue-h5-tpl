import axios from 'axios'
import qs from 'qs'

class HttpRequest {
  constructor (baseUrl = '') {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      withCredentials: true,
      method: 'get',
      headers: {}
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status, headers } = res
      if (headers) {
        let { code, msg } = headers
        if (code && code !== '0') {
          msg = msg ? decodeURIComponent(msg) : '系统异常'
          let errorInfo = {
            data: data,
            code,
            msg,
            status,
            request: { responseURL: res.request.responseURL }
          }
          return Promise.reject(errorInfo)
        }
      }
      return { data, status, res }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (errorInfo) {
        const { code, msg } = errorInfo.headers || { code: '8000', msg: '系统异常' }
        errorInfo.code = code
        errorInfo.msg = decodeURIComponent(msg)
      } else {
        const { request: { statusText, status }, config, headers } = JSON.parse(JSON.stringify(error))
        const { code, msg } = headers || { code: '8000', msg: statusText }
        errorInfo = {
          data: {},
          code: code,
          msg: decodeURIComponent(msg),
          status,
          request: { responseURL: config.url }
        }
      }
      if (errorInfo.status === 404) {
        errorInfo.status = 200
      }
      return Promise.reject(errorInfo)
    })
  }
  request (options) {
    axios.defaults.withCredentials = true
    const instance = axios.create({
      withCredentials: true,
      async: true,
      crossDomain: true
    })
    options = Object.assign(this.getInsideConfig(), options)
    if (!options.contentType && options.method === 'post') {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      if (options.data) {
        options.data = qs.stringify(options.data)
      }
    } else {
      options.headers['Content-Type'] = options.contentType
      delete options.contentType
    }
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
