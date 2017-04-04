<template>
<div class="wrapper wrapper-content animated fadeInRight">
    <transition
      mode="out-in"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
      appear>
      <router-view class="animated"></router-view>
    </transition>
</div>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style>
</style>