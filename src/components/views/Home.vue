<template>
<div id="wrapper">
    <nprogress-container></nprogress-container>
    <nav-bar></nav-bar>

    <div id="page-wrapper" class="gray-bg">
        <page-top></page-top>
        <page-main></page-main>
        <page-footer></page-footer>
    </div>
</div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
import { NavBar, PageTop, PageMain, PageFooter } from '../layout'

export default {
    components: {
        NavBar,
        PageTop,
        PageMain,
        PageFooter,
        NprogressContainer
    },

    data() {
        return {}
    }
}
</script>

<style>
</style>