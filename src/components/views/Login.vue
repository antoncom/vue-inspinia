<template>
<div class="middle-box text-center loginscreen animated fadeInDown">
    <div>
        <div>
            <h1 class="logo-name">RRS</h1>
        </div>
        <h3>RRS Admin</h3>
        <p>Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views.</p>
        <p>Login in. To see it in action.</p>
        <form class="m-t" role="form">
            <div class="alert alert-danger alert-dismissable" v-show="error">
                {{ error }}
            </div>
            <div class="form-group">
                <input type="text" class="form-control" v-model.trim="params.username" placeholder="Username" name="username" required="">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" v-model="params.password" placeholder="Password" name="password" required="">
            </div>
            <button type="submit" @click.prevent="login" class="btn btn-primary block full-width m-b">登&nbsp;&nbsp;陆</button>

            <a href="#"><small>忘记密码？</small></a>
        </form>
        <p class="m-t"> <small>RRS © 2017</small> </p>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            error: '',
            params: {
                username: '',
                password: '',
            }
        }
    },
    methods: {
        login() {
            this.$store.dispatch('login', this.$data)
        }
    }
}
</script>

<style>
</style>