//  公用api接口
import request from '@/utils/request'

export default {
  fetchGet(url, params, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    console.log(url)
    return request({
      url,
      method: 'get',
      params
    })
  },
  fetchPost(url, params = {}, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    return request({
      url,
      method: 'post',
      params
    })
  },
  httpUpdate(url, params = {}, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    return request({
      url,
      method: 'put',
      params
    })
  },
  httpDelete(url, params, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    console.log(url)
    return request({
      url,
      method: 'delete',
      params
    })
  }

}
