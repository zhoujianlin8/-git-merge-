#!/usr/bin/env node
const parseArgs = require('minimist');
const git = require('./index');
function getRunParameters(){
    return parseArgs(process.argv.slice(2), {
        alias: {
            'message': 'm',
            'branch': 'b',
            authHand: 'a'
        },
        string: ['message','branch'],
        default: {
            message: 'save',
            branch: '',
            authHand: false
        }
    });
}
function run() {
    const param = getRunParameters();
    if(param.v){
        return console.log(require('./package.json').version)
    }
    const a = param._[0];
    if(a === 'pull'){
        return git.gitPull(param)
    }else if(a === 'push'){
        return git.gitPush(param)
    }else if(a === 'pp'){
        return git.gitPP(param)
    }else if(a === 'branch'){
        return git.getCurBranch().then((branch)=>{
            console.log(branch)
        })
    }else if(a === 'develop'){
        param.mergeBranch = 'develop';
        return git.gitMerge(param)
    }else if(a === 'dev'){
        param.mergeBranch = 'dev';
        return git.gitMerge(param)
    }else if(a === 'online'){
        param.mergeBranch = 'online';
        return git.gitMerge(param)
    }else if(a === 'pre'){
        param.mergeBranch = 'pre';
        return git.gitMerge(param)
    }else if(a === 'test'){
        param.mergeBranch = 'test';
        return git.gitMerge(param)
    }else if(a === 'wapa'){
        param.mergeBranch = 'wapa';
        return git.gitMerge(param)
    }else if(a === 'beta'){
        param.mergeBranch = 'beta';
        return git.gitMerge(param)
    }else if(a === 'master'){
        param.mergeBranch = 'master';
        return git.gitMerge(param)
    }else if(param.branch){
        param.mergeBranch = param.branch;
        return git.gitMerge(param)
    }
}
run();
