//  公用api接口
import request from '@/utils/request'

export default {
  get(url, params, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    console.log(url)
    return request({
      url,
      method: 'get',
      params
    })
  },
  post(url, data = {}, pk) {
    url = pk ? url.replace('{pk}', pk) : url;
    return request({
      url,
      method: 'post',
      data
    })
  },
  put(url, data, pk) {
    url = pk ? url.replace('{pk}', pk) : url;
    return request({
      url,
      method: 'put',
      data
    })
  },
  httpDelete(url, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    console.log(url)
    return request({
      url,
      method: 'delete'
    })
  },
  httpPatch(url, data, pk) {
    url = pk ? url.replace('{pk}', pk) : url
    console.log(url)
    return request({
      url,
      method: 'patch',
      data
    })
  }

}
