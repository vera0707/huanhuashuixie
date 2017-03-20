### 网站2.0地址

- [首页](https://10.10.1.86:8081/index) - localhost:8081/index
- [登录](https://10.10.1.86:8081/login)  - localhost:8081/login
- [注册](https://10.10.1.86:8081/register) - localhost:8081/register
- [公司简介](https://10.10.1.86:8081/company) - localhost:8081/company
- [下载客户端页](https://10.10.1.86:8081/download) - localhost:8081/download
- [合规透明](https://10.10.1.86:8081/comTransparent) - localhost:8081/comTransparent
- [企业荣誉](https://10.10.1.86:8081/honorAgreement) - localhost:8081/honorAgreement
- [资金托管](https://10.10.1.86:8081/supReport) - localhost:8081/supReport
- [合作伙伴](https://10.10.1.86:8081/partners) - localhost:8081/partners
- [平台公告](https://10.10.1.86:8081/companyNotice) - localhost:8081/companyNotice
- [新手引导](https://10.10.1.86:8081/guide) - localhost:8081/guide
- [平台数据](https://10.10.1.86:8081/realTimeData) - localhost:8081/realTimeData
- [新手任务](https://10.10.1.86:8081/noviceTask) - localhost:8081/noviceTask
- [联系我们](https://10.10.1.86:8081/contactUs) - localhost:8081/contactUs
- [活动中心](https://10.10.1.86:8081/activities) - localhost:8081/activities
- [运营报告](https://10.10.1.86:8081/operationReport2015) - localhost:8081/operationReport2015
- [2014年运营报告](https://10.10.1.86:8081/operationReport?id=1) - localhost:8081/operationReport?id=1
- [2016年上半年运营报告](https://10.10.1.86:8081/operationReport?id=20160630) - localhost:8081/operationReport?id=20160630
- [2015年运营报告](https://10.10.1.86:8081/operationReport2015) - localhost:8081/operationReport2015
- [2016年运营报告](https://10.10.1.86:8081/operationReport2016) - localhost:8081/operationReport2016


** wap页面
  - [风险评估](https://10.10.1.86:8081/v2/about/security)  - localhost:8081/v2/about/security
  - [车辆质押标介绍](https://10.10.1.86:8081/v2/borrow/carPledge) - localhost:8081/v2/borrow/carPledge
  - [龙贷体验金介绍页](https://10.10.1.86:8081/v2/testBorrows/describe)  - localhost:8081/v2/testBorrows/describe
  - []()
  - []()

** www页面
  - [风险评估](http://10.10.1.86:1085/carPledge.do) - http://localhost:1085/carPledge.do
  - [landing页面](http://10.10.1.86:1085/landing.do) - http://localhost:1085/landing.do
  - [新手引导页](http://10.10.1.86:1085/guide.do) - http://localhost:1085/guide.do
  - [龙贷下载页](http://10.10.1.86:1085/download.do) - http://localhost:1085/download.do
  - [风险控制页](http://10.10.1.86:1085/security.do) - http://localhost:1085/security.do
  - [新手任务页](http://10.10.1.86:1085/noviceTask.do) - http://localhost:1085/noviceTask.do
  - [车辆质押标介绍页](http://10.10.1.86:1085/carPledge.do) - http://localhost:1085/carPledge.do
  - [帮助中心](http://10.10.1.86:1085/help.do) - http://localhost:1085/help.do
  - [平台数据](http://10.10.1.86:1085/realTimeData.do) - http://localhost:1085/realTimeData.do
  - [龙贷产品](http://10.10.1.86:1085/manageFinance.do) - http://localhost:1085/manageFinance.do
  - [风险告知书](http://10.10.1.86:1085/lenderTips.do) - http://localhost:1085/lenderTips.do
  - [会员介绍](http://10.10.1.86:1085/lenderTips.do) - http://localhost:1085/lenderTips.do


**2017年03月13号**
	- 待解决问题
	     （www车辆质押表详情页-还款记录)[https://www.longdai.com/financeDetail.do?id=18890761]
	      问题: 默认的还款记录请求 与 再次点击后还款记录 请求发的不是一个
	      默认请求[https://www.longdai.com/cgi-bin/user-bin/borrow/replaymentPlan]  点击回来发的请求[https://www.longdai.com/borrowDetailList.do]
	      项目地址:longdai/longdai-web/WebRoot/src/javascript/finance-borrow-detail.js
	      应该是与代码中type的取值和window.borrowWay取值有关??







