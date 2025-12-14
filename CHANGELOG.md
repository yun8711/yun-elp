# 📋 更新历史 



## [1.0.0](https://github.com/yun8711/yun-elp/compare/v0.1.0...v1.0.0) (2025-12-09)


### Bug Fixes

* **component:** :bug: 修复table-search组件问题 ([d39c45b](https://github.com/yun8711/yun-elp/commit/d39c45b3b7e5dff45aad0d3895e1219f31c39026))
* **component:** :bug: 修改table-search组件配置项问题 ([bf9fc16](https://github.com/yun8711/yun-elp/commit/bf9fc16878f29edff7231e56ed6864aaaee6fb93))
* **component:** :bug: 修改table-search组件fold事件参数 ([2bdeb63](https://github.com/yun8711/yun-elp/commit/2bdeb630eeeb96138a1ebebcc2b3a838d34b0d88))
* **core:** :bug: 修复国际化功能不生效问题 ([59d2ef7](https://github.com/yun8711/yun-elp/commit/59d2ef773684e4762ad774b87d461a435eeb3622))
* **core:** :bug: 修复组件构建时的类型错误 ([38d4531](https://github.com/yun8711/yun-elp/commit/38d45311970842efd6b062aec084e1da3501a646))
* **core:** :bug: 修复组件内嵌套引用的问题 ([594e6eb](https://github.com/yun8711/yun-elp/commit/594e6ebf29f382147882f3e9a935cefc8e37b170))
* **core:** :bug: 修复resolver函数加载样式文件失败问题；增加自动导入element-plus组件配置； ([4d06299](https://github.com/yun8711/yun-elp/commit/4d0629931c5cf0d513e73c485bb62267928d60da))
* **core:** :bug: 修复y-column-operation组件构建时的类型错误 ([f4a2212](https://github.com/yun8711/yun-elp/commit/f4a221221e64b163f4c704221857632241a7dc0b))
* **core:** :bug: 修改y-drawer组件实现为受控组件 ([3a75701](https://github.com/yun8711/yun-elp/commit/3a7570110d8b78769e7b96b51f0eb4f430209df5))
* **core:** :bug: 优化组件逻辑 ([fa6d74a](https://github.com/yun8711/yun-elp/commit/fa6d74aa83e1582d35f7c87267604c580d357a5b))
* **style:** :bug: 优化app-wrap中类型注解，避免构建时警告 ([d46139a](https://github.com/yun8711/yun-elp/commit/d46139ac4059d49003410ab1f3b391d171e19e74))
* **utils:** :bug: 修复resolver函数导入错误 ([00a5314](https://github.com/yun8711/yun-elp/commit/00a53142d797b9fda6b176161090836ba403a13e))


### Code Refactoring

* **core:** :recycle: 重构y-button组件，只保留防抖功能 ([17bfb12](https://github.com/yun8711/yun-elp/commit/17bfb120653c15284e67c2e53fee73f5436b01f2))


### Features

* **component:** :sparkles: 完成table-search表格搜索组件 ([16a9488](https://github.com/yun8711/yun-elp/commit/16a9488905e8b6e71b76f48f887076b60b179d02))
* **component:** :sparkles: 新增page-title组件 ([a913b1f](https://github.com/yun8711/yun-elp/commit/a913b1fe13d9f39ff400793a4ba8eab7eebbba1a))
* **component:** :sparkles: 新增simple-select简化选择器组件 ([c838d3a](https://github.com/yun8711/yun-elp/commit/c838d3a77e5c0e28afe15c56636c8cd757bd0335))
* **component:** :sparkles: 增加part-title分区标题组件 ([fc1d8e5](https://github.com/yun8711/yun-elp/commit/fc1d8e5526c804b5e3182c80f6bc90ac03eacd32))
* **core:** :sparkles: 完成“提示文本”text-tooltip组件 ([1513714](https://github.com/yun8711/yun-elp/commit/151371457591c66334a319d04cb6beb399153c31))
* **core:** :sparkles: 完成y-desc描述列表组件 ([1c4b7c7](https://github.com/yun8711/yun-elp/commit/1c4b7c70be46c1f275841ae0245f7318fe0e8f5d))
* **core:** :sparkles: 完成y-empty空状态组件 ([5158c44](https://github.com/yun8711/yun-elp/commit/5158c443d1ae6b031154944720df9ff38d9944ea))
* **core:** :sparkles: 新增 y-button组件 ([4fe5dee](https://github.com/yun8711/yun-elp/commit/4fe5deea3d93412c694402a7bcc5221e32973a6b))
* **core:** :sparkles: 新增column-forms多表单列组件 ([5c9bdc5](https://github.com/yun8711/yun-elp/commit/5c9bdc5087fbd4055907ff33762ee66b9e47ab52))
* **core:** :sparkles: 新增cron-picker定时选择器组件 ([034327c](https://github.com/yun8711/yun-elp/commit/034327c7c392159869806a804470ceb8c5e92e49))
* **core:** :sparkles: 新增row-select行选择器组件 ([2feb827](https://github.com/yun8711/yun-elp/commit/2feb827fae7140dc29072385e68c9ce2a0ff471e))
* **core:** :sparkles: 新增scroll-box可滚动容器组件 ([f45acf3](https://github.com/yun8711/yun-elp/commit/f45acf319d4d376d0b6f0d2fb917caee486e5cfb))
* **core:** :sparkles: 新增simple-radio组件 ([82d7105](https://github.com/yun8711/yun-elp/commit/82d7105c0196bdd4ae98f8a8d0265b1b7fc7b7ff))
* **core:** :sparkles: 新增y-column-filter筛选列组件 ([0727849](https://github.com/yun8711/yun-elp/commit/0727849e58901411e894cce3aea8cac9c9d0f732))
* **core:** :sparkles: 新增y-column-form表单列；优化y-column-forms多表单列 ([35638bb](https://github.com/yun8711/yun-elp/commit/35638bb88e5b25c7c452cf3ee12cd01e6311cfe7))
* **core:** :sparkles: 新增y-column-text文本列组件 ([d8ec9d5](https://github.com/yun8711/yun-elp/commit/d8ec9d5e0e8fb0e9fc0c86195943772e97ab705c))
* **core:** :sparkles: 新增y-dialog对话框组件 ([7d118ff](https://github.com/yun8711/yun-elp/commit/7d118ffd3518892865726f2ad9e59909fb573917))
* **core:** :sparkles: 新增y-drawer抽屉组件 ([e666122](https://github.com/yun8711/yun-elp/commit/e666122a0d5f6c8277507de92018da3bf1e61bff))
* **core:** :sparkles: 新增y-pop弹出框组件 ([184d5eb](https://github.com/yun8711/yun-elp/commit/184d5ebd0b8fee97dcc2573a14b383e2c55ec189))
* **core:** :sparkles: 新增y-step步骤条组件 ([252e6e4](https://github.com/yun8711/yun-elp/commit/252e6e4d9b7f7c1330368d37d55253b26dbc2a25))
* **core:** :sparkles: 新增y-sticky-layout组件 ([8adb64d](https://github.com/yun8711/yun-elp/commit/8adb64d5525f84ff404a25ca5b4bcfdd9816a317))
* **core:** :sparkles: 新增y-table表格组件 ([30b274c](https://github.com/yun8711/yun-elp/commit/30b274cfe19c5a2eed1870f79b2dfd88aa6230f6))
* **core:** :sparkles: 优化组件代码,修复构建时ts报错 ([49039bf](https://github.com/yun8711/yun-elp/commit/49039bfa31effc8d5c037da26d3a249206221a94))
* **core:** :sparkles: 优化text-tooltip的全局tooltip样式 ([bbc133e](https://github.com/yun8711/yun-elp/commit/bbc133e445ca798860a859224a1b2960b6c0a2dc))
* **core:** :sparkles: 优化y-button按钮组件参数配置 ([7c4ec6e](https://github.com/yun8711/yun-elp/commit/7c4ec6e9545888625096e9d166495c2202a4a919))
* **core:** :sparkles: 优化y-desc组件，增加label、content默认插槽 ([5ab73c1](https://github.com/yun8711/yun-elp/commit/5ab73c1bf57d3f7c14f2f5eea0b2518df515e602))
* **core:** :sparkles: 优化y-text-tooltip组件 ([8ae99a7](https://github.com/yun8711/yun-elp/commit/8ae99a74231546bdefabdb3b234a15efe375434d))
* **core:** :sparkles: 增加生成tags.json文件脚本 ([e71c8f7](https://github.com/yun8711/yun-elp/commit/e71c8f7aaa94a5ccad9264ee181be7e1a2c2ba0c))
* **core:** :sparkles: 增加page-footer组件 ([d84d3de](https://github.com/yun8711/yun-elp/commit/d84d3de6dc67db38067dc43f3f203274ef44da2e))
* **core:** :sparkles: 增加y-column-operation操作列组件；完善部分组件文档 ([16d3611](https://github.com/yun8711/yun-elp/commit/16d3611ed8bdb1a8d90b8201d2c5eeed87fb5ddf))
* **core:** :sparkles: y-button增加节流功能、双击处理 ([a3a99a2](https://github.com/yun8711/yun-elp/commit/a3a99a2b70a718982933f803c1f0c49363df41e1))
* **core:** :sparkles: y-button组件增加tooltip功能 ([5e79009](https://github.com/yun8711/yun-elp/commit/5e790093fb7e68cace65b7c9c09ab52978dc31f6))
* **core:** :sparkles: y-desc组件content插槽增加content(内容)参数 ([4fddbed](https://github.com/yun8711/yun-elp/commit/4fddbedccdcce37e1f8fb22784cd7b03abf2c5c7))
* **core:** ✨ 删除select、radio组件；优化组件逻辑；完善组件文档 ([#8](https://github.com/yun8711/yun-elp/issues/8)) ([cc09ff5](https://github.com/yun8711/yun-elp/commit/cc09ff502d148dfa38f04732a05ddce3a71103bb))
* **core:** ✨ 新增page-progress页面进度条组件 ([#7](https://github.com/yun8711/yun-elp/issues/7)) ([a65920a](https://github.com/yun8711/yun-elp/commit/a65920abd9406fccb7a7286a24e19c3614508555))
* **core:** ✨ 新增y-echarts基础图表组件 ([886f8d4](https://github.com/yun8711/yun-elp/commit/886f8d48355caa146340467d522ac710ab0114d1))


### BREAKING CHANGES

* **core:** 移除y-button组件的tooltip功能

## 0.1.0 (2025-06-16)


### Bug Fixes

* **component:** :bug: 完善config-provider组件 ([ca45555](https://github.com/yun8711/yun-elp/commit/ca45555b726cea082817662e262936bce10c9fb5))
* **component:** :bug: app-wrap组件增加默认注入对象，避免报警告 ([d57e961](https://github.com/yun8711/yun-elp/commit/d57e96177e9ea9c72853487c8aeecbbbf2dbc83c))


### Features

* 初始化项目，完成基本框架搭建 ([293d6e4](https://github.com/yun8711/yun-elp/commit/293d6e47e68e3b879ce22bfdf894e5f01bbf9c30))
* **component:** :sparkles: 修改config-provider组件 ([e03101e](https://github.com/yun8711/yun-elp/commit/e03101eb425fc8aa1f9edee5c3b91b9160731a0c))
* **component:** :sparkles: 增加app-wrap、label、border-label组件 ([e6b8d08](https://github.com/yun8711/yun-elp/commit/e6b8d0842bb31c354870f58409424568cd3ede29))
* **style:** :sparkles: 修改部分样式覆盖 ([0105c5e](https://github.com/yun8711/yun-elp/commit/0105c5e5db40d5e4b278f3a2a2edc7b4fc509b5b))
