<template>
    <section>
      <div class="table"> <!-- 页面表格begin -->
        <div class="crumbs"> <!-- 页面标题begin -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i>用户管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div> <!-- 页面标题end-->
        <div class="container"><!-- 页面内容区begin -->
          <div class="handle-box"> <!-- 搜索区begin -->
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
              <el-form :inline="true" :model="search">
                <el-form-item>
                  用户名： <el-input v-model="search.name"  placeholder="用户名" style="width:200px; heght:30px;" size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                  手机：<el-input v-model="search.phone"   placeholder="手机" style="width:200px; heght:30px;" size="mini"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="getResult(1)" size="mini">搜索</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div> <!-- 搜索区end -->
          <!--新增按钮-->
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleAdd" size="mini" round>新增</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDeleteList" size="mini" round>删除</el-button>
          <template>
            <!--表格数据及操作-->
            <el-table :data="tableData" size="mini"  highlight-current-row border   class="el-tb-edit mgt20" ref="multipleTable" tooltip-effect="dark" v-loading="listLoading" @selection-change="selectChange">
              <!--勾选框-->
              <el-table-column type="selection" width="55">
              </el-table-column>
              <!--索引-->
              <el-table-column type="index" :index="indexMethod">
              </el-table-column>
              <el-table-column prop="id" label="ID" >
              </el-table-column>
              <el-table-column prop="name" label="用户名">
                <template slot-scope="scope">
                  <el-button @click="handleSelect(scope.$index,scope.row)" type="text" size="small">{{scope.row.name}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="rname" align="center"label="角色" >
              </el-table-column>
              <el-table-column prop="image" align="center" label="头像" >
                <template slot-scope="scope">
                  <img :src="scope.row.image" style="width: 50px;height: 50px">
                </template>
              </el-table-column>
              <el-table-column prop="phone"  align="center" label="手机号" >
              </el-table-column>
              <el-table-column prop="email" align="center" label="邮件" >
              </el-table-column>
              <el-table-column prop="sex" align="center" label="性别" :formatter="formatSex" sortable>
              </el-table-column>
              <el-table-column prop="birthday" label="出生日期" align="center" :formatter="this.$common.timestampToTime">
             </el-table-column>
              <el-table-column prop="loginflag" label="是否有效" :formatter="formatState" sortable>
              </el-table-column>

              <el-table-column  fixed="right" label="操作" align="center" width="200">
                <template slot-scope="scope">
                  <el-button  type="primary" plain  size="small" icon="el-icon-edit" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                  <el-button  type="danger" plain  size="small" icon="el-icon-delete" @click="handleDelete(scope.$index,scope.row)">删除</el-button>

                </template>

              </el-table-column>
            </el-table>
          </template>
          <br>
          <br>
          <!-- 分页 -->
          <el-pagination  :current-page="page.page" :page-size="page.limit" layout="total,sizes,prev, pager, next,jumper" :total="page.total" :page-sizes="[10, 20, 30, 40]" @size-change="handleSizeChange" @current-change="handleCurrentChange" >
          </el-pagination>
        </div><!-- 页面内容区end-->
      </div><!-- 页面表格end -->
      <!--新增界面-->
      <el-dialog  :title="formEditTitle" :visible.sync="addFormVisible" @close="closeDialog('addForm')">
        <el-form :inline="true" :model="addForm" :disabled="formEditDisabled" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="addForm.name " auto-complete="off" @change="checkUser"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="addForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="上传图片" prop="image">
            <el-upload
              class="upload-demo"
              action=""
              ref="upload"
              v-model="addForm.image"
              :before-upload="beforeAvatarUpload"
              :http-request='uploadFileMethod'
              multiple
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="addForm.phone" auto-complete="off" @change="checkPhone"></el-input>
          </el-form-item>
          <el-form-item label="邮件" prop="email">
            <el-input v-model="addForm.email" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="sex">
            <el-select v-model="addForm.sex" placeholder="请选择" clearable>
              <el-option  v-for="item in sexOptions"   :key="item.value"  :label="item.label"  :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker  v-model="addForm.birthday" type="date"  placeholder="选择日期"   format="yyyy年MM月dd日"> </el-date-picker>
          </el-form-item>
          &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
          <el-form-item label="角色" prop="rid">
            <el-select v-model="addForm.rid" placeholder="请选择" clearable>
              <el-option  v-for="item in ridOptions"   :key="item.rid"  :label="item.rname"  :value="item.rid" >{{item.rname}}</el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary"  v-if="!formEditDisabled" @click="handleSave" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </section>
</template>

<script>
  import qs from 'qs';
    export default {
        name: "user",
      data(){
        let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
        let validatePhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('号码不能为空!!'))
          }
          setTimeout(() => {
            if (!phoneReg.test(value)) {
              callback(new Error('格式有误'))
            } else {
              callback()
            }
          }, 1000)
        }
          return{
            //搜索区域参数
            search:{
              name:"",
              phone:"",
            },
            //表格数据
            tableData: [],
            //列表Loading加载
            listLoading: false,
            //批量选中data
            selectList: [],
            //分页
            page:[
            ],
            pages:{
              limit:10,
              page:1
            },
            //标题
            formEditTitle:'添加',
            //角色信息
            roleData:[],
            //新增界面是否显示
            addFormVisible: false,
            //操作类型
            dialogType:'',
            //添加按钮Loading加载
            addLoading: false,
            //是否可以编辑
            formEditDisabled:false,


            //性别下拉框
            sexOptions: [
              {
                value: "1",
                label: "男"
              },
              {
                value: "0",
                label: "女"
              }
            ],

            ridOptions:[],
            addForm:{
              name:'',
              password:'',
              image:null,
              sex:null,
              birthday:null,
              rid:null,
              email:'',
              phone:'',
            },
            addFormRules:{
              name: [{ required: true, message: "请输入用户名", trigger: "blur" },
                {min:3,max:8,message:'长度为3到8个字符'}],
              password: [
                { required: true, message: "请输入登录密码", trigger: "blur" },
                {min:3,max:15,message:'长度为3到15个字符'}
              ],
              phone:[ { required: true, validator: validatePhone,  trigger: "blur" }

           ],
              email:[ { required: true, message: "请输入邮箱", trigger: "blur" },
                {
                  type:'email',message:'请输入正确邮箱',trigger:"blur"
                }],
              rid:[ { required: true, message: "请选择角色", trigger: "blur" }],

            }
          }



      },
      methods:{
     //性别显示转换
        formatSex: function(row, column) {
          return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
        },
        //是否有效显示转换
        formatState: function(row, column) {
          return row.loginflag == 1
            ? "有效"
            : row.loginflag == 0 ? "无效" : "";
        },
        getResult: function(val) {
          var _this = this;
          this.listLoading = true;
          let param = Object.assign({},
            {
              page: val,
              limit: 10,
              name: this.search.name,
              phone: this.search.phone,
            }
          );
          this.$axios.get(
            "/sys/user/list",{params:param}
          ).then((res)=> {
            _this.tableData = res.data.data;
            _this.count = res.data.count;
            _this.page=res.data.page
            _this.listLoading = false;
          }).catch((err)=>{
            this.$message({
              message: "查询异常",
              type: "error"
            });
          })
        },
        //table序号
        indexMethod(index) {
          return index + 1;
        },
        //查看详情
        handleSelect: function(index, row) {
          this.addFormVisible=true;
          this.$nextTick(()=>{
            this .formEditDisabled=true;
            this.dialogType='show';
            this.formEditTitle='详情';
            this.addForm=Object.assign({}, row) ;
            this.addForm.sex+='';

          });
          // this.selectFormVisible = true;
          // this.selectForm = Object.assign({}, row);
        },
        //监听提交事件
        handleSave(){
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
        //分页
        handleSizeChange(val) {
          this.pages.limit = val;
          this.getResult(1);
        },
        handleCurrentChange(val) {
          this.pages.page = val;
          this.getResult(1);
        },
        selectChange(val) {
          this.selectList = val;
        },
        //监听添加事件
        handleAdd(){
         this.addFormVisible= true;
          this.$nextTick(()=>{
         this.dialogType='add',
         this.formEditDisabled=false;
         this.formEditTitle='新增';});this.getRole();
        },
        handleEdit(index, rowData) {
          this.addFormVisible= true;
          this.$nextTick(()=>{
            this.dialogType='edit',
              this.formEditDisabled=false;
            this.formEditTitle='修改';
            this.addForm=Object.assign({}, rowData) ;
            this.addForm.sex+='';

          });
          this.getRole();
        },

        checkUser(){
          let parm={ name:this.addForm.name}
          this.$axios.get("/ajax/checkUsername",{params:parm})
            .then((res)=>{
              if (res.data.msg!='OK') {
                this.$message({
                  message: "用户名已经存在",
                  type: "error"
                });
                this.addForm.name = ''
              }
            }).catch((err)=>{
            this.$message({
              message: "查询异常",
              type: "error"
            });
          })
        },
        checkPhone(){
          let parm={ phone:this.addForm.phone}
          this.$axios.get("/ajax/checktelephone",{params:parm})
            .then((res)=>{
              if (res.data.msg!='OK') {
                this.$message({
                  message: "手机号码已经存在",
                  type: "error"
                });
                this.addForm.phone = ''
              }
            }).catch((err)=>{
            this.$message({
              message: "查询异常",
              type: "error"
            });
          })
        },
        handleDelete(index, rowData) {
          let id=rowData.id;
          let param={id:id}
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.get("/sys/user/delete",{params:param}
            )
              .then((data)=>{
                if (data.status=='200'){
                  this.$message({message: '删除成功',type: "success"});
                  this.getResult(1);}
              })
              .catch((err)=>{
                this.$message({message: '执行失败，请重试',type: "error"});
              });

          }).catch(() => {
            this.$message({type: 'info',message: '已取消删除'});
          });

        },
        handleDeleteList() {
          let ids= this.selectList.map(item => item.id).toString();
          if(ids==''){
            this.$message({message: '请选择要删除的项',type: "warn"});
            return;
          }
          let param={
            ids:ids
          };
          this.$confirm('此操作将批量永久删除文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
           this.$axios.get("/sys/user/deletes",{params:param})
              .then((data)=>{
                debugger
                if (data.status=='200'){
                  this.$message({message: '删除成功',type: "success"});
                  this.getResult(1);}
              })
              .catch((err)=>{
                this.$message({message: '执行失败，请重试',type: "error"});
              });

          }).catch(() => {
            this.$message({type: 'info',message: '已取消删除'});
          });

        },


//获取角色
        getRole(){
          this.$axios.get(
            "/ajax/role"
          ).then((res)=>{
            this.ridOptions=res.data.role;
            //console.log( this.ridOptions);
          }).catch((err)=>{
            this.$message({
              message: "查询异常",
              type: "error"
            });
          })

        },
        //上传图片
        uploadFileMethod(param) {
          let fileObject = param.file;
          // this.formEdit.pimage=fileObject;
          let formData = new FormData();
          formData.append("file", fileObject);
          this.$axios.post('/sys/imageload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
              if (response.data.code==0) {
                this.addForm.image= "http://localhost:8088/static/images/"+response.data.image;
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
        closeDialog(formName){
          this.$refs[formName].resetFields();
        },


        addSubmit(){
          this.$refs.addForm.validate(valid => {
            if (valid) {
              this.$confirm("确认提交吗？", "提示", {}).then(() => {
                this.addLoading = true;
                let param = Object.assign({}, this.addForm);
                param= qs.parse(param);
                this.$axios.post("/sys/user/add",param
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
        update(){
          this.$refs.addForm.validate(valid => {
            if(valid) {
              this.$confirm("确认修改吗？", "提示", {}).then(() => {
                this.addLoading = true;
                let param = Object.assign({}, this.addForm);
                param= qs.parse(param);
                this.$axios.post("/sys/user/update",param
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
      },

      mounted() {
        //初始加载
        this.getResult(1);
      }
    }
</script>

<style scoped>

</style>
