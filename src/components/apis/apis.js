
import adminApi from './adminApi';
import shiroApi from './shiroApi';
import mayiApi from './mayiApi';
import msgApi from './msgApi';
import categoryApi from './categoryApi'
/**
 * 接口汇总
 */
export default {
    /**用户,角色,组织等管理接口 */
    adminApi: adminApi,
    /**认证接口 */
    shiroApi: shiroApi,
  categoryApi:categoryApi,
     msgApi:msgApi
    /*/!**蚂蚁种树接口 *!/
    mayiApi:mayiApi,
    /!**消息接口 *!/
    */
}
