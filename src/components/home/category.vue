<template>

 <div>
    <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch" :model="formSearch" class="demo-form-inline">
      <el-form-item label="父类名称" prop="cname">
        <el-input v-model="formSearch.cname" placeholder="模糊匹配"></el-input>
      </el-form-item>

      <el-form-item label=" " style="margin-left:50px;">
        <el-button type="primary" @click="getCategory">查询</el-button>
        <el-button type="warning" plain @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="mgb15">
      <el-button size="small" round type="primary"  @click="handleAdd">新增</el-button>
      <el-button  size="small" round type="danger"  @click="deleteMany">批量删除</el-button>
    </el-row>
    <el-table :data="category"   border stripe style="width: 100%"   @selection-change="handleSelectionChange" >
      <el-table-column type="selection" minwidth="60">
      </el-table-column>
      <el-table-column prop="cid" label="CID" minwidth="60">
      </el-table-column>
      <el-table-column prop="cname" label="分类名称" minwidth="80" align="center" sortable>

      </el-table-column>
      <el-table-column prop="clevel" label="分类等级"align="center" minwidth="50">
      </el-table-column>
      <el-table-column prop="cparentId" label="父类ID" align="center" width="40">
      </el-table-column>
      <el-table-column prop="parentName" label="父类名称" align="center" width="100">
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
        <el-form-item label="分类名称" prop="cname">
          <el-input v-model="formEdit.cname" placeholder="分类名称" ></el-input>
        </el-form-item>

        <el-form-item label="分类等级" prop="clevel">
          <el-select v-model="formEdit.clevel" placeholder="分类等级" @change="changeCategory">
            <el-option label="一级" value=1></el-option>
            <el-option label="二级" value=2></el-option>
            <el-option label="三级" value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属父类" prop="cparentId">
          <el-cascader
            ref="cascader"
            v-model="formEdit.cparentId" :clearable="true" :disabled="isAble"
            :options="options" :show-all-levels="false"  :props="defaultParams" ></el-cascader>

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
    name: "category",
    data(){
      return{
        rulesEdit:  {
          cname: [
            { required: true, message: "请输入分类名称", trigger: "blur" }
          ],
          clevel:[{ required: true, message: "请输入分类等级", trigger: "blur" }],
          cparentId:[{ required: true, message: "请输入分类等级", trigger: "blur" }],
        },
        formEditTitle:'编辑',//新增，编辑和查看标题
        formEditDisabled:false,//编辑弹窗是否可编辑
        dialogEdittVisible: false,  //编辑弹框显示
        dialogType:'',
        isAble:false,
        labelPosition: 'right', //lable对齐方式
        labelWidth: '80px', //lable宽度
        formLabelWidth: '120px',
        formSearch: { //查询
          cname: '',
        },

        formEdit: { //表单编辑
          cid:null,
          cname: '',
          clevel:'',
          cparentId:'',
        },
        category:[
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
      this.getCategory();
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
      changeCategory(){
        console.log(this.formEdit.clevel)
        if( this.formEdit.cparentId.length>1) {
          if (this.formEdit.clevel == 3) {
            //this.$refs['cascader'].disabled=true;
            this.formEdit.cparentId = this.formEdit.cparentId[1];
          }
          if (this.formEdit.clevel == 2) {
            //this.$refs['cascader'].disabled=true;
            this.formEdit.cparentId = this.formEdit.cparentId[0];
          }
        }
          if (this.formEdit.clevel == 1) {
            this.formEdit.cparentId = 0;
            this.isAble=true;
          }

        console.log(this.formEdit.cparentId)
      },
      getcategory(){
        this.$axios.get("ajax/category").then((res)=>{
          // console.log(res.data)
          this.options=res.data.category
          // console.log(this.options)
          // console.log(this.defaultParams)
          //this.parseValueInt(this.options);
        })
      },

      getCategory() {
        let param = Object.assign({}, this.formSearch,this.pages);
        this.$axios.get("/sys/category/list",
          {params
              :param}).then((res)=>{

          this.category = res.data.data
          this.page=res.data.page
        })
        //   function (data) {
        //   console.log(data)
        //   this.category = data.rows
        // }, "json");
      },
      handleSizeChange(val) {
        this.pages.limit = val;
        this.getCategory();
      },
      /**
       * 分页切换
       */
      handleCurrentChange(val) {
        this.pages.page = val;
        this.getCategory();
      },
      /**
       * 点击选择
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
        /*  this.$message({
             message: '选中的项是:' + JSON.stringify(this.multipleSelection),
           type: "success"
          });*/
      },
      update() {
        this.$refs["formEdit"].validate(valid => {
          if(valid){
            this.changeCategory();
            let param = Object.assign({}, this.formEdit);
            apis.categoryApi.update(param)
              .then((data)=>{
                if(data.data.msg=='OK'){
                  this.$message({message: '执行成功',type: "success"});
                  this.dialogEdittVisible = false;
                  this.getCategory();
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
            //this.formEdit.cparentId=this.formEdit.cparentId[2];
           this.changeCategory();
            let param = Object.assign({}, this.formEdit);
            console.log(param);
            apis.categoryApi.addCategory(param)
              .then((data)=>{
                if(data.data.msg=='OK'){
                  this.$message({message: '执行成功',type: "success"});
                  this.dialogEdittVisible = false;
                  this.getCategory();
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
        var cid=rowData.cid;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          apis.categoryApi.delete({cid:cid})

            .then((data)=>{
              if (data.status=='200'){
                this.$message({message: '删除成功',type: "success"});
                this.getCategory();}
            })
            .catch((err)=>{
              this.$message({message: '执行失败，请重试',type: "error"});
            });

        }).catch(() => {
          this.$message({type: 'info',message: '已取消删除'});
        });

      },
      deleteMany() {
        var cids= this.multipleSelection.map(item => item.cid).toString();
        if(cids==''){
          this.$message({message: '请选择要删除的项',type: "warn"});
          return;
        }
        debugger;
        this.$confirm('此操作将批量永久删除文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          apis.categoryApi.deleteBatch({cids:cids})
            .then((data)=>{
              debugger
              if (data.status=='200'){
                this.$message({message: '删除成功',type: "success"});
                this.getCategory();}
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
