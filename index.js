const exec = require('./exec');
const inquirer = require('inquirer');
async function execLog(str){
    console.log(str);
    return await exec(str)
}
function handMessage(message) {
    message = message || ''
    if (message.indexOf('"') === -1) {
        return `"${message}"`
    }
    return `'${message}'`
}
async function gitPush(obj){
    obj = Object.assign({
        branch: '',
        message: 'save',
        authHand : false
    },obj);
    if(!obj.branch){
        const branch = await getCurBranch();
        if(!branch){
            return 
        }else{
            obj.branch = branch
        }
    }
    const str = `git add . && git commit -m ${handMessage(obj.message)}`;
    try{
        await execLog(str);
    }catch(e){
        if(e && e.stderr){
            console.error(e.stderr);
            return true
        }else if(e && e.stdout){
            console.log(e.stdout)
        }   
    }
    try{
        const res = await execLog(`git push origin ${obj.branch}`);
        if(res.stderr){
            //rejected 失败判断 权限
            if(res.stderr.indexOf('[rejected]') !== -1 || res.stderr.indexOf('have the correct access rights') !== -1 || res.stderr.indexOf('error:') !== -1){
                console.error(res.stderr)
                return true
            }else{
                console.log(res.stderr)
            }
        }else{
            console.log(res.stdout)
        }
    }catch(e){
        console.error(e)
        return true
    }
    
}
async function gitPull(obj){
    obj = Object.assign({
        branch: '',
        message: 'save',
        authHand : false
    },obj);
    if(!obj.branch){
        const branch = await getCurBranch();
        if(!branch){
            return 
        }else{
            obj.branch = branch
        }
    }
    try{
        await execLog(`git add . && git commit -m ${handMessage(obj.message)}`);
    }catch(e){
        if(e && e.stderr){
            console.error(e.stderr)
            return true
        }else if(e && e.stdout){
            console.log(e.stdout)
        }   
    }
    try{
        const res = await execLog(`git pull origin ${obj.branch}`);
        if(res.stderr){
            if(res.stderr.indexOf('have the correct access rights') !== -1 || res.stderr.indexOf('error:') !== -1){
                console.error(res.stderr)
                return true
            }
            console.log(res.stderr)
        }else{
            console.log(res.stdout)
        }
    }catch(e){
        console.error(e)
        return true
    }
}
async function check(message){
    const res = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'check',
            message: message || 'go on',
            default: true
        }
    ])
    return res.check
}
async function gitPP(obj){
    obj = Object.assign({
        branch: '',
        message: 'save',
    },obj);
    if(!obj.branch){
        const branch = await getCurBranch();
        if(!branch){
            return 
        }else{
            obj.branch = branch
        }
    }
  let isFalse =  await gitPull(obj);
  if(isFalse){
    isFalse = !await check('hand over go on')
  } 
  if(!isFalse){
    isFalse = await gitPush(obj);
    if(isFalse){
        isFalse = !await check('hand over go on');
        if(!isFalse){
            isFalse = await gitPush(obj);
        }
      }
  }
  return isFalse
}
async function getCurBranch(){
    const res = await exec(`git branch -l`);
    if(!res.stderr && res.stdout){
       // develop\n  feature-bug\n* feature-merge-live-cc\n  master\n
       let branch = '';
       res.stdout.replace(/\*\s([^\s]+)(\s|$)/g,function(w,$1){
        branch = $1;
       })
        return branch
    }
    if(res.stderr){
        console.error(res.stderr)
        return 
    }
}
async function gitMerge(obj){
     obj = Object.assign({
        mergeBranch: '',
        message: 'save',
        authHand : false
    },obj);
    const branch = await getCurBranch();
    if(!branch){
        return 
    }
    obj.curBranch = branch;
    let isFalse;
    //curBranch
    isFalse = await gitPP({
        branch: obj.curBranch,
        message: obj.message,
        authHand: obj.authHand
    });
    if(isFalse) return;
    //切换到合并分支
    try{
        await execLog(`git checkout ${obj.mergeBranch}`);
    }catch(e){
       if(e && e.stderr && e.stderr.indexOf('did not match') !== -1){
           if(obj.authHand){
                await execLog(`git checkout -b ${obj.mergeBranch}`);
           }else{
               console.log(`branch ${obj.mergeBranch} not found`);
               const checkIt = await execLog(`create branch ${obj.mergeBranch}`);
               if(checkIt){
                await execLog(`git checkout -b ${obj.mergeBranch}`);
               }else{
                   return;
               }
           }
       }else{
           console.error(e.stderr)
       }
    }
    //mergeBranch
    isFalse = await gitPull({
        branch: obj.mergeBranch,
        message: obj.message,
        authHand: obj.authHand
    });
    if(isFalse){
        isFalse = !await check('hand over go on');
        if(isFalse) {
            console.log(`branch now is ${obj.mergeBranch}`)
            return 
        }
    }
    //gitPull curBranch
    isFalse = await gitPull({
        branch: obj.curBranch,
        message: obj.message,
        authHand: obj.authHand
    })
    if(isFalse){
        isFalse = !await check('hand over go on');
        if(isFalse) {
            console.log(`branch now is ${obj.mergeBranch}`)
            return 
        }
    }else if(!obj.authHand){
        isFalse = !await check('go on push it');
        if(isFalse) {
            console.log(`branch now is ${obj.mergeBranch}`)
            return 
        }
    }

    isFalse = await gitPush({
        branch: obj.mergeBranch,
        message: obj.message,
        authHand: obj.authHand
    })

    if(isFalse){
        isFalse = !await check('hand over go on');
        if(isFalse) {
            console.log(`branch now is ${obj.mergeBranch}`)
            return 
        }
        isFalse = await gitPush({
            branch: obj.mergeBranch,
            message: obj.message,
            authHand: obj.authHand
        })
        if(isFalse) {
            console.log(`branch now is ${obj.mergeBranch}`)
            return 
        }
    }
    //重新切换到当前分支
    await execLog(`git checkout ${obj.curBranch}`);
}
module.exports = {
    gitMerge,
    gitPush,
    gitPP,
    gitPull,
    getCurBranch
};