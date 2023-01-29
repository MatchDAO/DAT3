<template>
	<view>
		<web-view :src="url" ></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: null,
				title:null
			}
		},
		onLoad(options) {
			if (options && options.url) {
				let {url,title} = options
				this.url = url;
				title && uni.setNavigationBarTitle({
					title
				})
				
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
