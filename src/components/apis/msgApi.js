import Axios from 'axios';
import qs from 'qs';

/**
 * 提供msg相关接口
 */
export default {
  add:function({pid,pname,price,pimage,pdate,cid,introduce,pamount,state,ishot}){
         var param=qs.parse({
           pid:pid,
           pname:pname,
           price:price,
           pimage:pimage,
           pdate:pdate,
           cid:cid,
           introduce:introduce,
           pamount:pamount,
           state:state,
           ishot:ishot,
        });
        return Axios.post('/sys/addproduct',param);
    },
  update:function({pid,pname,price,pimage,pdate,cid,introduce,pamount,state,ishot}){
    var param={
      pid:pid,
      pname:pname,
      price:price,
      pimage:pimage,
      pdate:pdate,
      cid:cid,
      introduce:introduce,
      pamount:pamount,
      state:state,
      ishot:ishot,
    };
    return Axios.post('/sys/updateproduct',param);
  },
   delete:function({pid}){
        var param={
            pid:pid
        };
        return Axios.get('/sys/deleteproduct', {params:param});
    },
    deleteBatch:function({pids}){

        var param={
            pids:pids
        };

        return Axios.get('/sys/deleteproducts',{params: param});
    },

}
