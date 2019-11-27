<template>
<div>
  <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch" :model="formSearch" class="demo-form-inline">
    <el-form-item label="品名" prop="pname">
      <el-input v-model="formSearch.pname" placeholder="模糊匹配"></el-input>
    </el-form-item>
    <el-form-item label="类别" prop="cid">
      <el-cascader :clearable="true" :options="options" :show-all-levels="false" :props="defaultParams" v-model="formSearch.cid"></el-cascader>
    </el-form-item>

    <el-form-item label=" " style="margin-left:50px;">
      <el-button type="primary" @click="getproduct">查询</el-button>
      <el-button type="warning" plain @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
  <el-row class="mgb15">
    <el-button size="small" round type="primary"  @click="handleAdd">新增</el-button>
    <el-button  size="small" round type="danger"  @click="deleteMany">批量删除</el-button>
  </el-row>
  <el-table :data="products"   border stripe style="width: 100%"   @selection-change="handleSelectionChange" >
    <el-table-column type="selection" minwidth="60">
    </el-table-column>
    <el-table-column prop="pid" label="ID" minwidth="60">
    </el-table-column>
    <el-table-column prop="pname" label="品名" minwidth="80" align="center" sortable>

    </el-table-column>
    <el-table-column prop="price" label="价格"align="center" minwidth="50">
    </el-table-column>
    <el-table-column prop="pimage" label="图片地址" align="center" width="150">
      <template slot-scope="scope">
        <img :src="scope.row.pimage" style="width: 50px;height: 50px">
      </template>
    </el-table-column>
    <el-table-column prop="pdate" label="上市时间" align="center" :formatter="this.$common.timestampToTime" width="180" sortable>
    </el-table-column>
    <el-table-column prop="cid" label="分类ID" align="center" width="40">
    </el-table-column>
    <el-table-column prop="introduce" label="商品介绍" align="center" width="100">
    </el-table-column>
    <el-table-column prop="pamount" label="库存" align="center" width="100">
    </el-table-column>
    <el-table-column prop="state" label="状态" align="center" width="50">
      <template slot-scope="scope">
        <span>{{ scope.row.state==1?'上架':'下架' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="ishot" label="热销" align="center" width="30">
      <template slot-scope="scope">
        <span>{{ scope.row.ishot==1?'是':'否' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="createby" label="创建人" align="center" width="30">
    </el-table-column>
    <el-table-column prop="createdate" label="创建日期"  width="80" sortable>
    </el-table-column>
    <el-table-column prop="createby" label="修改人" align="center" width="30">
    </el-table-column>
    <el-table-column prop="updatedate" label="更新日期"  width="80" sortable>
    </el-table-column>
    <el-table-column label="操作" fixed="right" min-width="230">
      <template slot-scope="scope">
        <el-button size="mini" plain type="primary" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" plain type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background layout="total,sizes,prev, pager, next,jumper" :current-page="page.page" :page-size="page.limit" :total="page.total" :page-sizes="[10, 20, 30, 40]" @size-change="handleSizeChange" @current-change="handleCurrentChange">
  </el-pagination>
  <el-dialog  :title="formEditTitle" :visible.sync="dialogEdittVisible" width="700px" @close="closeDialog('formEdit')">
    <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesEdit" :disabled="formEditDisabled" :inline="true" ref="formEdit" :model="formEdit" class="demo-form-inline">
      <el-form-item label="品名" prop="pname">
        <el-input v-model="formEdit.pname" placeholder="品名" ></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="formEdit.price" placeholder="价格"></el-input>
      </el-form-item>
     <el-form-item label="上传图片" prop="pimage">
       <el-upload
         class="upload-demo"
         action=""
         ref="upload"
         v-model="formEdit.pimage"
         :on-preview="handlePreview"
         :on-remove="handleRemove"
         :before-upload="beforeAvatarUpload"
         :http-request='uploadFileMethod'
         multiple
         list-type="picture">

         <el-button size="small" type="primary">点击上传</el-button>
         <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>

       </el-upload>
      </el-form-item>

      <el-form-item label="上市时间" prop="pdate">
        <el-date-picker
          v-model="formEdit.pdate"
          type="date"
         value-format="yyyy年MM月dd日">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="分类" prop="cid">
        <el-cascader
          ref="cascader"
          v-model="formEdit.cid" :clearable="true" :options="options" :show-all-levels="false"  :props="defaultParams" ></el-cascader>

      </el-form-item>
      <el-form-item label="库存" prop="pamount">
        <el-input v-model="formEdit.pamount" placeholder="库存"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍" prop="introduce">
        <el-input  v-model="formEdit.introduce" placeholder="商品介绍"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="formEdit.state" placeholder="状态">
          <el-option label="上架" value=1></el-option>
          <el-option label="下架" value=0></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="热销" prop="ishot">
        <el-select v-model="formEdit.ishot" placeholder="热销">
          <el-option label="是"  value=1></el-option>
          <el-option label="否" value=0></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEdittVisible = false">取 消</el-button>
      <el-button v-if="!formEditDisabled" type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>

  </div>
</template>

<script>
  import apis from '../apis/apis';
    export default {
      name: "product",
      data(){
        return{
          rulesEdit:  {
            pname: [
              { required: true, message: "请输入商品名称", trigger: "blur" }
            ],
            price:[{ required: true, message: "请输入价格", trigger: "blur" }],
            pimage: [{ required: true, message: "请添加图片", trigger: "blur" }],
            cid: [{ required: true, message: "请选择类别", trigger: "change" }],
            pdate: [{ required: true, message: "请选择上市时间", trigger: "blur" }],
            introduce: [{ required: true, message: "请输入商品介绍", trigger: "blur" }],
            pamount: [{ required: true, message: "请输入商品库存", trigger: "blur" }],
            state: [{ required: true, message: "请选择状态", trigger: "change" }],
            ishot: [{ required: true, message: "请设置商品热销", trigger: "change" }]
          },
          formEditTitle:'编辑',//新增，编辑和查看标题
          formEditDisabled:false,//编辑弹窗是否可编辑
          dialogEdittVisible: false,  //编辑弹框显示
          dialogType:'',
          labelPosition: 'right', //lable对齐方式
          labelWidth: '80px', //lable宽度
          formLabelWidth: '120px',
          formSearch: { //查询
            pname: '',
            cid:null,
          },
          multipleSelection: [],

          formEdit: { //表单编辑
            pid:null,
            pname: '',
            price:'',
            pamount:'',
            cid:null,
            pimage:null,
            pdate:null,
            introduce:'',
            ishot:null,
            state:null,
          },
          products:[
          ],
          options:[],

          defaultParams:{
            label:'cname',
            value: 'cid',
            children:'children'
          },
          page:[
          ],
          pages:{
            limit:10,
            page:1
          }

        }
      },
      created: function () {
        this.getproduct();
        this.getcategory();
      },
      methods: {
        handleDetail(index,rowData){
          this.dialogEdittVisible = true;
          this.$nextTick(()=>{
            this.dialogType='show';
            this.formEditTitle='详情';
            this.formEditDisabled=true;
            this.formEdit= Object.assign({}, rowData) ;
            this.formEdit.ishot+='';
            this.formEdit.state+='';
            // this.$refs["upload"].files.src=this.formEdit.pimage;
            //this.formEdit.pimage="http://localhost:8088/"+ this.formEdit.pimage
         });

        },
        // parseValueInt(options){
        //   options.forEach(opt=>{
        //     opt.cid=parseInt(opt.cid);
        //     if(opt.children && opt.children>0){
        //       this.parseValueInt(opt.children);
        //     }
        //   });
        // },
        getcategory(){
          this.$axios.get("ajax/category").then((res)=>{
            // console.log(res.data)
            this.options=res.data.category
            // console.log(this.options)
            // console.log(this.defaultParams)
            //this.parseValueInt(this.options);
          })
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        uploadFileMethod(param) {
          let fileObject = param.file;
        // this.formEdit.pimage=fileObject;
          let formData = new FormData();
          formData.append("file", fileObject);
          this.$axios.post('/sys/fileupload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                if (response.data.code==0) {
                  this.formEdit.pimage= "http://localhost:8088/static/images/"+response.data.pimage;
                  this.$message({
                    showClose: true,
                    message: "上传成功。",
                    type: "success"
                  });

                }
               else {
                this.$message.error("上传失败");
              }
              console.log("response==", response);
            })
            .catch(message => {
              console.log("message======================", message);
              this.$message.error("上传失败，请联系管理员");
            });
        },
        getproduct() {
if(this.formSearch.cid!=null &&this.formSearch.cid!='')
{
  this.formSearch.cid=this.formSearch.cid[2];
}
          console.log(this.formSearch.cid)
          let param = Object.assign({}, this.formSearch,this.pages);
          this.$axios.get("sys/productlist",
            {params
              :param}).then((res)=>{

            this.products = res.data.data
            this.page=res.data.page
          })
          //   function (data) {
          //   console.log(data)
          //   this.products = data.rows
          // }, "json");
        },
        handleSizeChange(val) {
          this.pages.limit = val;
          this.getproduct();
        },
        /**
         * 分页切换
         */
        handleCurrentChange(val) {
          this.pages.page = val;
          this.getproduct();
        },
        /**
         * 点击选择
         */
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        update() {

          this.$refs["formEdit"].validate(valid => {
            if(valid){
              //console.log(this.$refs['cascader'].getCheckedNodes()[0].pathLabels)
              if (this.formEdit.cid.length>1)
              {this.formEdit.cid=this.formEdit.cid[2];}
              let param = Object.assign({}, this.formEdit);
              apis.msgApi.update(param)
                .then((data)=>{
                  if(data.data.msg=='OK'){
                    this.$message({message: '执行成功',type: "success"});
                    this.dialogEdittVisible = false;
                    this.getproduct();
                    this.$refs["upload"].clearFiles();
                    return;
                  }
                })
                .catch((err)=>{
                  this.$message({message: '执行失败，请重试',type: "error"});
                });
            }

          });
        },
        handleEdit(index, rowData) {
          //var msg = "索引是:" + index + ",行内容是:" + JSON.stringify(rowData);
          //this.$message({message: msg,type: "success"});
          this.dialogEdittVisible = true;//等dom渲染完，读取data中初始值，然后再复制，这样重置的是data中初始值
          this.$nextTick(()=>{
            this.dialogType='edit';
            this.formEditTitle='编辑';
            this.formEditDisabled=false;
            this.formEdit= Object.assign({}, rowData);
            this.formEdit.ishot+='';//必须转换成字符串才能回显
            this.formEdit.state+='';

          });

        },
        handleSave(){
          if(this.dialogType=='add'){
            this.save();
          }
          else if(this.dialogType=='edit'){
            this.update();
          }
          else{
            this.$message({message: '操作异常',type: "error"});
          }
        },
        closeDialog(formName){
          this.$refs[formName].resetFields();
        },
        save() {

          this.$refs["formEdit"].validate(valid => {
            if(valid){
              this.formEdit.cid=this.formEdit.cid[2];
              let param = Object.assign({}, this.formEdit);
              apis.msgApi.add(param)
                .then((data)=>{
                  if(data.data.msg=='OK'){
                    this.$message({message: '执行成功',type: "success"});
                      this.dialogEdittVisible = false;
                      this.getproduct();
                      this.$refs["upload"].clearFiles();
                      return;
                    }
                })
                .catch((err)=>{
                  this.$message({message: '执行失败，请重试',type: "error"});
                });
            }


          });
        },



        onReset(){
          this.$refs['formSearch'].resetFields();
        },
        handleAdd() {
          this.dialogEdittVisible = true;
          this.$nextTick(()=>{
            this.dialogType='add';
            this.formEditTitle='新增';
            this.formEditDisabled=false;
          });
          this.getcategory();
        },

        handleDelete(index, rowData) {
          var pid=rowData.pid;
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            apis.msgApi.delete({pid:pid})

              .then((data)=>{
                if (data.status=='200'){
                  this.$message({message: '删除成功',type: "success"});
                  this.getproduct();}
              })
              .catch((err)=>{
                this.$message({message: '执行失败，请重试',type: "error"});
              });

          }).catch(() => {
            this.$message({type: 'info',message: '已取消删除'});
          });

        },
        deleteMany() {
          var pids= this.multipleSelection.map(item => item.pid).toString();
          if(pids==''){
            this.$message({message: '请选择要删除的项',type: "warn"});
            return;
          }
          debugger;
          this.$confirm('此操作将批量永久删除文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            apis.msgApi.deleteBatch({pids:pids})
              .then((data)=>{
                debugger
                if (data.status=='200'){
                  this.$message({message: '删除成功',type: "success"});
                  this.getproduct();}
              })
              .catch((err)=>{

                this.$message({message: '执行失败，请重试',type: "error"});
              });

          }).catch(() => {
            this.$message({type: 'info',message: '已取消删除'});
          });

        },
      }
    }
</script>

<style scoped>

</style>
