<template>
  <div class="mint-tabbar">
  	  <router-link 
			:to="'compose'"
			 class="mint-tab-item">
			<i class="foot-icon jcm-xieyoujian"></i>写邮件
	  </router-link>
  </div>
</template>


<script>
export default {
  name: 'jc-footer',
  data(){
  	return {
  		selected: 'foot1'
  	}
  }
}
</script>

<style lang="scss">
.writeEmail{
	height: 53px;
	width: 100%;
	background: #fff;
	border-top: 1px solid #e2e2e2;
	display: flex;
	justify-content: center;
	align-items: center;

	.mint-tab-item-label{
		padding-top: 8px;
		min-height: 30px;
		font-size: 14px;
	}
	.mint-tab-item{
		height: 43px;
		line-height: 43px;
		color: #fff;
		background: #4e8dff;
		margin: 0 15px;
		padding: 0;
		border-radius: 4px;
		font-size: 18px;
	}
	.foot-icon{
		height: 24px;
		width: 24px;
		font-size: 24px;
		margin-right: 2px;
	}
}
</style>
