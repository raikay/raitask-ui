import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/scheduler/`

// 接口管理
export const getApi = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params }, config)
}
export const getApiList = (params, config = {}) => {
  return request.get(apiPrefix + 'getlist', { params: params }, config)
}

export const batchRemoveApi = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
export const editApi = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const addApi = (params, config = {}) => {
  return request.post(apiPrefix + 'add', params, config)
}
/**
 * 同步api
 */
export const syncApi = (params, config = {}) => {
  return request.post(apiPrefix + 'sync', params, config)
}
export const getV2SwaggerJson = (params, config = {}) => {
  return request.get('/swagger/V2/swagger.json', { params: params }, config)
}



export const getAllJobs = (params, config = {}) => {
  return request.get(apiPrefix + 'jobs', { params }, config)
}
export const addJobs = (params, config = {}) => {
  return request.post(apiPrefix, params, config)
}


// 批量删除
export function removeJob(data) {
  console.log(data);
  return request({
    url: apiPrefix + 'del',
    method: 'delete',
    data: data
  })
}