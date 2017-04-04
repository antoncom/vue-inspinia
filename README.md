# VUE后台管理系统

## 开发

开发环境依赖node.js，所以先安装node，然后依次执行：

1. 安装依赖

`npm install`

2. 开发构建

`npm run build`

3. 启动本地web服务，并在浏览器里打开[http://127.0.0.1:8080/](http://127.0.0.1:8080/)看效果。由于开启了热加载，修改代码不用刷新浏览器即可生效

`npm run watch`


## 部署

执行`npm build:prod`将会在build目录里生成好部署代码，全部拷贝放到服务器web目录即可。
