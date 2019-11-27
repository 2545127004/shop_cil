<template>
    <div>
      <div id="wrapper" class="login-page">
        <div id="login_form" class="form">
          <form class="register-form">
            <input type="text" placeholder="用户名" value="admin" id="r_user_name"  />
            <input type="password" placeholder="密码" id="r_password" />
            <input type="text" placeholder="电子邮件" id="r_emial" />
            <button id="create">创建账户</button>
            <p class="message">已经有了一个账户? <a href="#">立刻登录</a></p>
          </form>
          <form class="login-form">
            <h2>管理登录</h2>
            <input type="text" placeholder="用户名" value="admin" id="name" v-model="loginFrom.name"/>
            <input type="password" placeholder="密码" id="password" v-model="loginFrom.password"/>
            <button id="login" @click.prevent="login">登　录</button>

            <p class="message">还没有账户? <a href="#">立刻创建</a></p>
          </form>
        </div>
      </div>

    </div>


</template>

<script>
    export default {
        name: "Login",
      data(){
          return{
            input: '',
            loginFrom:{
              name:'',
              password:''
            },
            responseResult:[]
          }
      },
      methods:{
        login () {
          this.$axios.get('wmshop/login', {
              params:{
                "name": this.loginFrom.name ,
                "password": this.loginFrom.password
              }
          }
            ).then(successResponse => {
            console.log(successResponse.data);
            let json =successResponse.data;
            if (successResponse.data.code === 200) {
              const encryptionDesc=json.data.token
             // localStorage.setItem('token',encryptionDesc);
              this.$common.setSessionStorage('token', encryptionDesc);
              this.$common.setSessionStorage('username',json.data.userInfo.name);
              this.$common.setSessionStorage('lev',json.data.sysRoleVoList);
              //存入菜单,渲染菜单
              this.$store.dispatch("add_Menus",json.data.sysMenuVoList);
              //动态设置路由
              this.$store.dispatch("add_Routes", json.data.sysMenuVoList);
              this.$router.replace({ path: "/index" });
            }
          })
            .catch(failResponse => {
              this.$message({message: '登录失败，请重试',type: "error"});
            })


          }

      }
    }
</script>

<style scoped>
@import "../../static/css/login.css";
</style>
