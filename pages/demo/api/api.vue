<template>
  <view class="container">
    <button @click="showModel">uni.showModal</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      showModel() {
        uni.showModal({
          content: this.$t('api.message'),
          success: (res) => {
            console.log(res);
          }
        })
      }
    }
  }
</script>

<style>

</style>
