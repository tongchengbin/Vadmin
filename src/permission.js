import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {getToken} from '@/utils/auth' // getToken from cookie

NProgress.configure({showSpinner: false});// NProgress Configuration


router.beforeEach((to, from, next) => {
    NProgress.start(); // start progress bar
    //  start to
    console.log("jump" + to.path);
    if (to.meta.auth) {
        //需要登录
        if(getToken()){
            //已经登录  判断是否有用户信息  如果没有用户信息 需要加载用户信息  同时再次渲染路由
            if(store.getters.hasinfo){
                next()

            }else{
                store.dispatch("GetUserInfo").then(()=>{
                    next();
                    console.log("加载用户信息")
                });
            }

        }else{
        //    没有登录  跳转到登录页面
            next("/login")
        }

    } else {
        next();

    }
});

router.afterEach(() => {
    NProgress.done() // finish progress bar
});
