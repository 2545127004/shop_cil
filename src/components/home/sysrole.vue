<template>
  <div class="table">
    <!-- 页面表格begin -->
    <div class="crumbs">
      <!-- 页面标题begin -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 页面标题end-->
    <div class="container">
      <!-- 页面内容区begin -->
      <div id="app">
        <div style=" width:50%;float:left;">

          角色名称：
          <el-input v-model="s_rolename" label="角色编码" placeholder="角色编码" style="width:200px; heght:30px;" size="mini"></el-input>

          <el-button type="success" icon="el-icon-search" @click="getResult(1)" size="mini">搜索</el-button>
          <br>
          <br>

          <!--新增按钮-->
          <div class="clearfix">
            <el-col :span="1" class="grid">
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleAdd" size="mini" round>新增</el-button>
            </el-col>
          </div>

          <!--表格数据及操作-->
          <el-table :data="tableData" class="mgt20" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark" @row-click="clickRow">
            <!--勾选框-->
            <el-table-column type="radio" width="50">
              <template slot-scope="scope">
                <el-radio v-model="curentroleid" :label="scope.row.rid">{{null}}</el-radio>
              </template>
            </el-table-column>
            <!--索引-->
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="rid" label="角色id" width="50" sortable>
            </el-table-column>
            <el-table-column prop="rname" label="角色名称" width="150">
            </el-table-column>
            <el-table-column prop="introduce" label="角色介绍">
            </el-table-column>
            <el-table-column label="编辑" width="100">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column label="删除" width="100">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" @click="delRole(scope.row)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <br>
          <!--分页条total, sizes, prev, pager, next, jumper-->

          <el-pagination @size-change="handleSizeChange" @current-change="getResult" :current-page="page" :page-size="limit" layout="total, prev, pager, next" :total="roletotal">
          </el-pagination>
          <!--新增界面-->
          <el-dialog :title="formEditTitle" :visible.sync="addFormVisible"  @close="closeDialog('addForm')">
            <el-form :model="addForm" :disabled="formEditDisabled" :rules="addFormRules" ref="addForm" label-width="166px">

              <el-form-item label="角色名称" prop="rname">
                <el-input v-model="addForm.rname" auto-complete="off" style="width:400px;"></el-input>
              </el-form-item>

              <el-form-item label="介绍介绍" prop="introduce">

                <el-input v-model="addForm.introduce" auto-complete="off" style="width:400px;"></el-input>

              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addFormVisible = false">取消</el-button>
              <el-button type="primary" v-if="!formEditDisabled" @click="handleSave" :loading="addLoading">提交</el-button>
            </div>
          </el-dialog>
        </div>
        <div style=" width:45%;float:right;">
          <div class="clearfix">
            <el-col :span="3" class="grid">
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="addRoleUser(1)" size="mini" round>新增</el-button>
            </el-col>
            <el-col :span="1" class="grid">
              <el-button type="danger" icon="el-icon-delete" @click="deleteUserRole" size="mini" round>删除</el-button>
            </el-col>
          </div>

        <el-table :data="roleUserList" class="mgt20" @selection-change="roleuserSelectChange" border style="width: 100%" stripe ref="roleUserList" tooltip-effect="dark">

            <el-table-column type="selection" width="55">
            </el-table-column>
<!--            索引-->
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="name" label="用户名称" width="100" sortable>
            </el-table-column>
            <el-table-column prop="id" label="用户编号" width="100">
            </el-table-column>
          <el-table-column prop="rname" label="角色" width="100">
          </el-table-column>
            <el-table-column prop="rid" label="rid" width="100">
            </el-table-column>
          </el-table>
          <el-pagination @current-change="getRoleUserList" :current-page="roleuserpage" :page-size="limit" layout="total, prev, pager, next" :total="roleusercount">
          </el-pagination>
          <br>
          <!--新增界面-->
          <el-dialog title="新增用户" :visible.sync="addRoleUserVisible" :close-on-click-modal="false">
            <el-row>
              <el-col :span="200" class="grid">
                <el-input v-model="s_username" label="用户名称" placeholder="请输入内容" style="width:200px; heght:30px;" size="mini"></el-input>
              </el-col>
              <el-col :span="1" class="grid">
                <el-button type="success" @click="addRoleUser(1)" icon="el-icon-search" size="mini">搜索</el-button>
              </el-col>
            </el-row>
            <br>
            <el-table :data="userData" @selection-change="userSelectionChange" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
              <!--勾选框-->
              <el-table-column type="selection" width="55">
              </el-table-column>
              <!--索引-->
              <el-table-column type="index" :index="indexMethod">
              </el-table-column>
              <el-table-column prop="name" label="用户名称" width="180">
              </el-table-column>
              <el-table-column prop="rname" label="角色">
              </el-table-column>
              <el-table-column prop="id" label="用户编号">
              </el-table-column>


            </el-table>
            <el-pagination @current-change="addRoleUser" :current-page="userpage" :page-size="limit" layout="total, prev, pager, next" :total="usercount">
            </el-pagination>
            <br>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="saveUserRole" :loading="addLoading">保存</el-button>
              <el-button @click="addRoleUserVisible= false">关闭</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <!-- 页面内容区end-->
  </div>
  <!-- 页面表格end -->
</template>
<script>
  import qs from 'qs';
  export default {
    data() {
      return {
        tableData: [],
        roleTypeData: [],
        roleUserList: [],
        userData: [],
        roleuserSelect: [],
        input: "",
        formEditTitle:'',
        curentroleid: "",
        curentrow: null,
        //列表Loading加载
        listLoading: false,
        //新增界面是否显示
        formEditDisabled:false,//编辑弹窗是否可编辑
        addFormVisible: false,
        //添加按钮Loading加载
        addLoading: false,
        //新增角色用户
        addRoleUserVisible: false,
        roletotal: 0,
        usercount: 0,
        roleusercount: 0,
        page: 1,
        userpage: 1,
        roleuserpage: 1,
        limit: 10,
        dialogType:'',
        //检索字段
        s_rolename: "",
        s_username: "",
        //     s_roleType:"",
        //输入框验证
        addFormRules: {
          rname: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
          introduce: [{ required: true, message: "请输入角色介绍", trigger: "blur" }],
        },
        //新增界面数据
        addForm: [],
        addForm:{
          rid:'',
          rname:'',
          introduce:''
        },
        UserSelection: []
      }
    },

    methods: {

      handleEdit(index,rowData){
        this.addFormVisible = true;
        this.$nextTick(()=>{
          this.dialogType='edit'
          this.formEditTitle='修改';
          this.formEditDisabled=false;
          this.addForm= Object.assign({}, rowData) ;
        });

      },


      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      indexMethod(index) {
        return index;
      },
      //获取角色列表
      getResult: function(val) {

        var _this = this;
        this.listLoading = true;
        let param = Object.assign({},{ page: 1, limit: 10, rname: this.s_rolename});
        this.$axios.get(  "/sys/role/list",{params
            :param}
      ).then(
          function(resultData) {
            _this.tableData = resultData.data.data;
            _this.roletotal = resultData.data.count;
            _this.listLoading = false;
          },

        );

      },
      handleSizeChange(val) {
        this.limit = val;
        this.getResult(1);

      },
      closeDialog(formName){
        this.$refs[formName].resetFields();
      },
      handleSave(){
        console.log(this.dialogType)
        if(this.dialogType=='add'){
          this.addSubmit();
        }
        else if(this.dialogType=='edit'){
          this.update();
        }
        else{
          this.$message({message: '操作异常',type: "error"});
        }
      },
      //新增
      addSubmit() {

        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addLoading = true;
              let param = Object.assign({}, this.addForm);
              param= qs.parse(param);
              this.$axios.post("/sys/role/add",param
              ).then(res => {
                this.addLoading = false;
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getResult(1);
              });
            });
          }
        });
      },
     //新增显示
      handleAdd() {
        this.dialogType='add'
        this.formEditTitle='新增'
        this.addFormVisible = true;

      },
      update() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.addLoading = true;
              let param = Object.assign({}, this.addForm);
              param= qs.parse(param);
              this.$axios.post("/sys/role/update",param
              ).then(res => {
                if(res.data.msg=='OK') {
                  this.addLoading = false;
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  this.$refs["addForm"].resetFields();
                  this.addFormVisible = false;
                  this.getResult(1);
                }
              })
                .catch((err)=>{
                this.$message({message: '执行失败，请重试',type: "error"});
              });

            });
          }
        });
      },
      delRole: function(row) {
        let param = new URLSearchParams();
        param.append("rid", row.rid);
        this.$axios.post("/sys/role/delete", param)
          .then(()=>{
            this.$message({
              message: "删除成功",
              type: "success"
            })
            this.getResult(1);
          })
          .catch(()=>{
            this.$message({
              message: "删除失败",
              type: "error"
            });
          })
        ;

      },
      getRoleUserList: function(val) {
        var _this = this;
        this.listLoading = true;
        let param = Object.assign({}, { page: val, limit: 10, rid: this.curentroleid });
        this.$axios.get("/sys/userrole/list",
          {params: param}
        ).then(
          function(resultData) {

            _this.roleUserList = resultData.data.data;
            _this.roleusercount = resultData.data.count;
            //alert(_this.tableData);
            //_this.listLoading = false;
          }
        );
      },
      clickRow: function(row) {
        this.roleuserSelect = [];
        // var roleid=row.id;
        var _this = this;
        this.curentroleid = row.rid;
        this.curentrow = row;
        _this.getRoleUserList(1)

      },
      addRoleUser: function(val) {
        this.addRoleUserVisible = true;
        var _this = this;
        this.listLoading = true;
        let param = Object.assign({}, { page: val, limit: 10, name: this.s_username });
        this.$axios.get("/sys/user/list",{ params:param}

        ).then(
          function(resultData) {
            _this.userData = resultData.data.data;
            _this.usercount = resultData.data.count;
          }
        );

      },
      userSelectionChange: function(val) {
        //alert(val);
        this.UserSelection = val;
      },
      roleuserSelectChange: function(val) {
        this.roleuserSelect = val;
      },
      saveUserRole: function() {
        if (this.curentroleid == "") {
          alert("请选择要添加的角色，单击选择行。");
        }
        var rows = this.UserSelection;
        if (rows) {
          rows.forEach(row => {
            var _this = this;
            this.listLoading = true;
            let param = Object.assign({}, {  rid: this.curentroleid, id: row.id });
            this.$axios.post("/sys/user/update", param
            ).then((res)=>
               {
                if( res.data.msg=='OK') {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                }
              }
            );
            // alert(row.id)
          });
        }
        // this.$refs["addRoleUser"].resetFields();
        this.addRoleUserVisible = false;
        this.clickRow(this.curentrow);
        //alert(this.UserSelection);
      },
      deleteUserRole: function() {
        var rows = this.roleuserSelect;
        if (rows) {
          rows.forEach(row => {
            var _this = this;
            this.listLoading = true;
            let param = Object.assign({}, {  rid:3, id: row.id });
            this.$axios.post("/sys/user/update", param
            ).then((res)=>
              {
                if( res.data.msg=='OK') {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                }
              }
            ).catch((err)=>{
              this.$message({
                message: "修改异常",
                type: "error"
              });
            })
          });
        }
        this.addRoleUserVisible = false;
        this.clickRow(this.curentrow);
      }
    },
    mounted() {
      //获取列表
      this.getResult();
      // this.getRoleType();

    }
  };
</script>

<style scoped>

</style>
