<template>

  <div>

    <el-row class="mgb15">
      <el-button size="small" round type="primary"  @click="handleAdd">新增</el-button>
      <el-button  size="small" round type="danger"  @click="deleteMany">批量删除</el-button>
    </el-row>
    <el-table :data="menu"   border stripe style="width: 100%"   @selection-change="handleSelectionChange" >
      <el-table-column type="selection" minwidth="60">
      </el-table-column>
      <el-table-column prop="id" label="ID" minwidth="60">
      </el-table-column>
      <el-table-column prop="parentId" label="父类id" minwidth="60">
      </el-table-column>
      <el-table-column prop="name" label="菜单名称" minwidth="80" align="center" sortable>
      </el-table-column>
      <el-table-column prop="href" label="路径"align="center" minwidth="50">
      </el-table-column>
      <el-table-column prop="target" label="等级" align="center" width="40">
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
      </el-table-column>
      <el-table-column prop="isShow" label="状态" align="center" width="100">
      </el-table-column>
      <el-table-column prop="permission" label="资源权限" align="center" width="100">
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="230">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" plain type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total,sizes,prev, pager, next,jumper" :current-page="page.page" :page-size="page.limit" :total="page.total" :page-sizes="[10, 20, 30, 40]" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
    <el-dialog  :title="formEditTitle" :visible.sync="dialogEdittVisible" width="700px" @close="closeDialog('formEdit')">
      <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesEdit" :disabled="formEditDisabled" :inline="true" ref="formEdit" :model="formEdit" class="demo-form-inline">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formEdit.name" placeholder="菜单名称" ></el-input>
        </el-form-item>

        <el-form-item label="菜单等级" prop="target">
          <el-select v-model="formEdit.target" placeholder="分类等级" @change="changeMenu">
            <el-option label="一级" value=1></el-option>
            <el-option label="二级" value=2></el-option>
            <el-option label="三级" value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属父类" prop="parentId">
         <!-- <el-select
            ref="cascader"
            v-model="formEdit.parentId" :clearable="true" :disabled="isAble"
            :options="options"  :props="defaultParams" >
          </el-select>-->
          <el-select v-model="formEdit.parentId" :disabled="isAble" placeholder="请选择" clearable>
            <el-option  v-for="item in menuOptions"   :key="item.id"  :label="item.name"  :value="item.id" >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="formEdit.href" placeholder="菜单路径" ></el-input>
        </el-form-item>

        <el-form-item label="菜单图标" prop="href">
          <el-input v-model="formEdit.icon" placeholder="请输入正确的16进制图标" ></el-input>
        </el-form-item>
        <el-form-item label="资源权限" prop="href">
          <el-input v-model="formEdit.permission" placeholder="访问菜单的权限" ></el-input>
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
    name: "menu",
    data(){
      return{
        rulesEdit:  {

          name: [
            { required: true, message: "请输入分类名称", trigger: "blur" }
          ],
          target:[{required:true,megssage:"请选择菜单等级",trigger:"blur"}],
          href:[{required:true,megssage:"请输入路径",trigger:"blur"}],
          icon:[{required:true,megssage:"请输入图标",trigger:"blur"}],
          permission:[{required:true,megssage:"请输入菜单的资源权限",trigger:"blur"}],
        },
        formEditTitle:'编辑',//新增，编辑和查看标题
        formEditDisabled:false,//编辑弹窗是否可编辑
        dialogEdittVisible: false,  //编辑弹框显示
        dialogType:'',
        isAble:false,
        labelPosition: 'right', //lable对齐方式
        labelWidth: '80px', //lable宽度
        formLabelWidth: '120px',

        menuOptions:[],
        formEdit: { //表单编辑
         name:'',
          parentId:null,
          target:null,
          href:'',
          icon:'',
         permission:''
        },
        menu:[
        ],
       /* options:[],

        defaultParams:{
          label:'name',
          value: 'id',
          children:'children'
        },*/
        page:[
        ],
        pages:{
          limit:10,
          page:1
        }

      }
    },
    created: function () {
      this.getMenu();
      this.getMenus();
    },
    methods: {

      // parseValueInt(options){
      //   options.forEach(opt=>{
      //     opt.cid=parseInt(opt.cid);
      //     if(opt.children && opt.children>0){
      //       this.parseValueInt(opt.children);
      //     }
      //   });
      // },
      changeMenu(){
        console.log(this.formEdit.target)

        if( this.formEdit.parentId!=null) {
          if (this.formEdit.target == 3) {
            //this.$refs['cascader'].disabled=true;
            this.isAble=false;
          }
          if (this.formEdit.target == 2) {
            //this.$refs['cascader'].disabled=true;
            this.isAble=false;
          }
        }
        else {
          this.isAble=false;
        }
        if (this.formEdit.target == 1) {
          this.isAble=true;
        }

        console.log(this.formEdit.cparentId)
      },
      getMenus(){
        this.$axios.get("menu/list").then((res)=>{
          // console.log(res.data)
          this.menuOptions=res.data
          // console.log(this.options)
          // console.log(this.defaultParams)
          //this.parseValueInt(this.options);
        })
      },

      getMenu() {
        let param = Object.assign({}, this.formSearch,this.pages);
        this.$axios.get("/sys/menu/list",
          {params
              :param}).then((res)=>{

          this.menu = res.data.data
          this.page=res.data.page
        })
        //   function (data) {
        //   console.log(data)
        //   this.category = data.rows
        // }, "json");
      },
      handleSizeChange(val) {
        this.pages.limit = val;
        this.getMenu();
      },
      /**
       * 分页切换
       */
      handleCurrentChange(val) {
        this.pages.page = val;
        this.getMenu();
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
            this.changeMenu();
            let param = Object.assign({}, this.formEdit);
           this.$axios.post("/sys/menu/update",param)
              .then((data)=>{
                if(data.data.msg=='OK'){
                  this.$message({message: '执行成功',type: "success"});
                  this.dialogEdittVisible = false;
                  this.getMenu();
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
            this.changeMenu();
            let param = Object.assign({}, this.formEdit);
            //console.log(param);
            //apis.categoryApi.addCategory(param)
            this.$axios.post("/sys/menu/add",param)
              .then((data)=>{
                if(data.data.msg=='OK'){
                  this.$message({message: '执行成功',type: "success"});
                  this.dialogEdittVisible = false;
                  this.getMenu();
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
        this.getMenus();
      },

      handleDelete(index, rowData) {
        var id=rowData.id;
        let param={
          id:id
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.$axios.get("/sys/menu/delete",{params:param})
            .then((data)=>{
              if (data.status=='200'){
                this.$message({message: '删除成功',type: "success"});
                this.getMenu();}
            })
            .catch((err)=>{
              this.$message({message: '执行失败，请重试',type: "error"});
            });

        }).catch(() => {
          this.$message({type: 'info',message: '已取消删除'});
        });

      },
      deleteMany() {
        var ids= this.multipleSelection.map(item => item.id).toString();
        if(ids==''){
          this.$message({message: '请选择要删除的项',type: "warn"});
          return;
        }
        let param={
          ids:ids
        }
        this.$confirm('此操作将批量永久删除文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.$axios.get("/sys/menu/deletes",{params:param})
            .then((data)=>{
              if (data.status=='200'){
                this.$message({message: '删除成功',type: "success"});
                this.getMenu();}
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
