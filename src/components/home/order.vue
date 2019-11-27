<template>

  <div>
    <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch" :model="formSearch" class="demo-form-inline">
      <el-form-item label="父类名称" prop="telephone">
        <el-input v-model="formSearch.telephone" placeholder="模糊匹配"></el-input>
      </el-form-item>

      <el-form-item label=" " style="margin-left:50px;">
        <el-button type="primary" @click="getOrder">查询</el-button>
        <el-button type="warning" plain @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row class="mgb15">
      <el-button  size="small" round type="danger"  @click="deleteMany">批量删除</el-button>
    </el-row>
    <el-table :data="order"   border stripe style="width: 100%"   @selection-change="handleSelectionChange" >
      <el-table-column type="selection" minwidth="60">
      </el-table-column>
      <el-table-column prop="oid" label="ID" minwidth="60">
      </el-table-column>
      <el-table-column prop="name" label="用户名" minwidth="60">
      </el-table-column>
      <el-table-column prop="ordertime" label="订单时间" minwidth="80" align="center"  :formatter="this.$common.timestampToTime" sortable>
      </el-table-column>
      <el-table-column prop="total" label="金额"align="center" minwidth="50">
      </el-table-column>
      <el-table-column prop="state" label="支付状态" align="center" width="40">
      </el-table-column>
      <el-table-column prop="address" label="收货地址" align="center" width="100">
      </el-table-column>
      <el-table-column prop="telephone" label="手机" align="center" width="100">
      </el-table-column>
      <el-table-column prop="uid" label="用户id" align="center" width="100">
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
        <el-form-item label="订单号" prop="oid">
          <el-input v-model="formEdit.oid" placeholder="订单号" disabled ></el-input>
        </el-form-item>
        <el-form-item label="用户" prop="name">
          <el-input v-model="formEdit.name" placeholder="用户" disabled  ></el-input>
        </el-form-item>

        <el-form-item label="下单时间" prop="ordertime">
          <el-input v-model="formEdit.ordertime" placeholder="下单时间" disabled  ></el-input>
        </el-form-item>

        <el-form-item label="订单金额" prop="total" >
          <el-input v-model="formEdit.total"  disabled  ></el-input>
        </el-form-item>
        <el-form-item label="支付状态" prop="state">
          <el-input v-model="formEdit.state" placeholder="支付状态" ></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="formEdit.address" placeholder="收货地址" ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="telephone">
          <el-input v-model="formEdit.telephone" placeholder="手机号码" ></el-input>
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
    name: "order",
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
        formSearch: { //查询
          telephone: '',
        },

        formEdit: { //表单编辑
          oid:'',
          name:'',
          ordertime:'',
          address:'',
          total:'',
          state:'',
          telephone:'',
        },
        order:[
        ],
        options:[],

        defaultParams:{
          label:'name',
          value: 'id',
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
      this.getOrder();

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

        if( this.formEdit.parentId.length>1) {
          if (this.formEdit.target == 3) {
            //this.$refs['cascader'].disabled=true;
            this.isAble=false;
            this.formEdit.parentId = this.formEdit.parentId[1];
          }
          if (this.formEdit.target == 2) {
            //this.$refs['cascader'].disabled=true;
            this.isAble=false;
            this.formEdit.parentId = this.formEdit.parentId[0];
          }
        }
        else {
          this.isAble=false;
        }
        if (this.formEdit.target == 1) {
          this.formEdit.parentId = 0;
          this.isAble=true;
        }

        console.log(this.formEdit.cparentId)
      },

      getOrder() {
        let param = Object.assign({}, this.formSearch,this.pages);
        this.$axios.get("/sys/orders/list",
          {params
              :param}).then((res)=>{

          this.order = res.data.data
          this.page=res.data.page
        })
        //   function (data) {
        //   console.log(data)
        //   this.category = data.rows
        // }, "json");
      },
      handleSizeChange(val) {
        this.pages.limit = val;
        this.getOrder();
      },
      /**
       * 分页切换
       */
      handleCurrentChange(val) {
        this.pages.page = val;
        this.getOrder();
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

            let param = Object.assign({}, this.formEdit);
            this.$axios.post("/sys/orders/update",param)
              .then((data)=>{
                if(data.data.msg=='OK'){
                  this.$message({message: '执行成功',type: "success"});
                  this.dialogEdittVisible = false;
                  this.getOrder();
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

      onReset(){
        this.$refs['formSearch'].resetFields();
      },
      handleDelete(index, rowData) {
        var oid=rowData.oid;
        let param={
          oid:oid
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get("/sys/orders/delete",{params:param})
            .then((data)=>{
              if (data.status=='200'){
                this.$message({message: '删除成功',type: "success"});
                this.getOrder();}
            })
            .catch((err)=>{
              this.$message({message: '执行失败，请重试',type: "error"});
            });

        }).catch(() => {
          this.$message({type: 'info',message: '已取消删除'});
        });

      },
      deleteMany() {
        var oids= this.multipleSelection.map(item => item.oid).toString();
        if(oids==''){
          this.$message({message: '请选择要删除的项',type: "warn"});
          return;
        }
        let param={
          oids:oids
        }
        this.$confirm('此操作将批量永久删除文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get("/sys/orders/deletes",{params:param})
            .then((data)=>{
              if (data.status=='200'){
                this.$message({message: '删除成功',type: "success"});
                this.getOrder();}
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
