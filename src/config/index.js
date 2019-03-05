export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'title',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 30,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: '/api/',
    pro: 'http://localhost:10881/api'
  }
}
