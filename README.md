
## 安装
* npm install git-merge -g


## 使用
* gm dev 当前分支合并到dev分支
* gm develop 当前分支合并到develop分支
* gm online 当前分支合并到online分支
* gm beta 当前分支合并到beta分支
* gm wapa 当前分支合并到wapa分支
* gm test 当前分支合并到wapa分支
* gm master 当前分支合并到master分支
* gm -b branch 当前分支合并到branch分支 
* gm pull 保存并更新  gm pull -b branch 同步branch分支代码到本地
* gm push 保存并上传
* gm pp 保存同步拉新后保存上传 == gm pull && gm push
* gm branch 当前分支查看
* gm dev -a 过程正常一直进行
* gm dev -m 'xxx' message信息多少
* gm -v

## gm dev -m 'xx' 举例执行过程
* git add . && git commit -m 'xx' && git pull origin curbranchxx
* git add . && git commit -m 'xx' && git push origin curbranchxx
* git checkout dev
* git add . && git commit -m 'xx' && git pull origin dev 
* git add . && git commit -m 'xx' && git pull origin curbranchxx
* git add . && git commit -m 'xx' && git push origin dev
* git checkout curbranchxx
* 过程中出现异常会提示解决 解决后流程可以点继续

## gm pp -m 'xx' 举例执行
* git add . && git commit -m 'xx' && git pull origin curbranchxx
* git add . && git commit -m 'xx' && git push origin curbranchxx
* 过程中出现异常会提示解决 解决后流程可以点继续

## 解决问题
* 自动流程解决合并本地合并分支代码的问题，避免手动执行过程中的遗漏出现问题操作麻烦 ，分支切换执行出现混乱
