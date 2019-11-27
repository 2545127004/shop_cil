import Axios from 'axios';
import qs from 'qs';
export default {
  addCategory:function ({cid,cname,clevel,cparentId}) {
    var param=qs.parse({
      cid:cid,cname:cname,clevel:clevel,cparentId:cparentId

    })
    return Axios.post('/sys/category/add',param);
  },
  update:function ({cid,cname,clevel,cparentId}) {
    var param=qs.parse({
      cid:cid,cname:cname,clevel:clevel,cparentId:cparentId

    })
    return Axios.post('/sys/category/update',param);
  },
delete:function ({cid}) {
  var param={
    cid:cid
  };
return Axios.get('/sys/category/delete', {params:param});
},
  deleteBatch:function ({cids}) {
    var param={
      cids:cids
    };
    return Axios.get('/sys/category/deletes', {params:param});
  },
}
