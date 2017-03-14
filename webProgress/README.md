### 网站2.0开发进度

**2017年03月08号**
- 工作进度
	+ 联系我们静态页(url: /contactUs)
		> [待UI设计]
	+ 注册页接后台数据
		> 已完成页面跳转，需要绑定事件

**2017年03月09号**
    + 联系我们效果图基本确定

**2017年03月10号**
	+ 完成注册页第一步逻辑与事件

**2017年03月13号**
	+ 完成登录注册功能

**2017年03月13号**
	- 待解决问题
	     （www车辆质押表详情页-还款记录)[https://www.longdai.com/financeDetail.do?id=18890761]
	      问题: 默认的还款记录请求 与 再次点击后还款记录 请求发的不是一个
	      默认请求[https://www.longdai.com/cgi-bin/user-bin/borrow/replaymentPlan]  点击回来发的请求[https://www.longdai.com/borrowDetailList.do]
	      项目地址:longdai/longdai-web/WebRoot/src/javascript/finance-borrow-detail.js
	      应该是与代码中type的取值和window.borrowWay取值有关??

