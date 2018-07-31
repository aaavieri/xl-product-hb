var instance = axios.create({
  baseURL: '/product/faces'
})
instance.defaults.timeout = 5000

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  var message = error.response.data.errMsg || '未知错误'
  swal({
    title: '操作失败!',
    text: message,
    type: 'error',
    confirmButtonClass: 'md-primary md-button md-raised md-primary md-button-content md-theme-default',
    confirmButtonText: 'OK',
    buttonsStyling: false
  })
  // 对响应错误做点什么
  return Promise.reject(error)
})

const HttpPlugin = {
  install (Vue) {
    instance.$vue = Vue
    Vue.mixin({
      data () {
        return {
          http: instance
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$http', {
      get () {
        return this.$root.http
      }
    })
  }
}

window.HttpPlugin = HttpPlugin
//export default HttpPlugin
