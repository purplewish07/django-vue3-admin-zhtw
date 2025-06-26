# 簡介
django-vue-admin
fork https://github.com/caoqianming/django-vue-admin

升級支援python3.13 node22 vue3 + 繁體中文化

基於RBAC模型權限控制的中小型應用的基礎開發平台,前後端分離,後端採用django+django-rest-framework,前端採用vue3+ElementPlus.

JWT認證,可使用simple_history實現審計功能,支持swagger

內置模塊有組織機構\用戶\角色\崗位\文件庫\ (移除 數據字典\定時任務)

支持功能權限(控權到每個接口)和簡單的數據權限（全部、本級及以下、同級及以下、本人等）

## 部分截圖
![image](https://github.com/caoqianming/django-vue-admin/blob/master/img/user.png)
![image](https://github.com/caoqianming/django-vue-admin/blob/master/img/dict.png)
![image](https://github.com/caoqianming/django-vue-admin/blob/master/img/task.png)


## 啟動(以下是在windows下開發操作步驟)


### django後端
定位到server文件夾

建立虛擬環境 `python -m venv venv`

激活虛擬環境 `.\venv\scripts\activate`

安裝依賴包 `pip install -r requirements.txt`

修改數據庫連接 `server\settings_dev.py` 

同步數據庫 `python manage.py migrate`

可導入初始數據 `python manage.py loaddata db.json` 或直接使用sqlite數據庫(超管賬戶密碼均為admin)

創建超級管理員 `python manage.py createsuperuser`

運行服務 `python manage.py runserver 8000` 

### vue前端
定位到client文件夾

安裝node.js

安裝依賴
yarn install

本地開發 啟動項目
yarn dev

### nginx
修改nginx.conf

```
listen 8012
location /media {
    proxy_pass http://localhost:8000;
}
location / {
    proxy_pass http://localhost:9528;
}
```

運行nginx.exe

### 運行
打開localhost:8012即可訪問

接口文檔 localhost:8000/docs

後台地址 localhost:8000/admin

## 部署
部署時使用的是settings_pro.py。注意修改

可以前後端分開部署, nginx代理。也可打包之後放在server/vuedist文件夾, 然後執行collectstatic

### docker-compose 方式運行 (未實作)

前端 `./client` 和後端 `./server` 目錄下都有Dockerfile，如果需要單獨構建鏡像，可以自行構建。

這裡主要說docker-compose啟動這種方式。

按照註釋修改docker-compose.yml文件。裡面主要有兩個服務，一個是`backend`後端,一個是`frontend`前端。

默認是用開發模式跑的後端和前端。如果需要單機部署，又想用docker-compose的話，改為生產模式性能會好些。


啟動
```
cd <path-to-your-project>
docker-compose up -d
```

啟動成功後，訪問端口同前面的，接口8000端口，前端8012端口，如需改動，自己改docker-compose.yml

如果要執行裡面的命令
docker-compose exec <服務名> <命令>

舉個栗子：

如果我要執行後端生成數據變更命令。`python manage.py makemigrations`

則用如下語句

```
docker-compose exec backend python manage.py makemigrations
```

### 理念
首先得會使用django-rest-framework, 理解vue-element-admin前端方案

本項目採用前端路由，後端根據用戶角色讀取用戶權限代碼返回給前端，由前端進行加載(核心代碼是路由表中的perms屬性以及checkpermission方法)

後端功能權限的核心代碼在server/apps/system/permission.py下重寫了has_permission方法, 在APIView和ViewSet中定義perms權限代碼

數據權限因為跟具體業務有關,簡單定義了幾個規則,重寫了has_object_permission方法;根據需要使用即可

由於實際情況比較複雜，這裡建議根據不同情況自己寫drf的permission_class

