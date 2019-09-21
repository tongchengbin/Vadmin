import {loginByUsername, logout, getUserInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import { asyncRouterMap, constantRouterMap } from '@/router'
const user = {
    state: {
        //是否获取了用户信息
        hasinfo: false,
        uid: '',
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        }
    },

    mutations: {
        SET_UID: (state, uid) => {
            state.uid = uid
        },
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_HASINFO: (state, hasinfo) => {
            console.log("更新用户信息");
            state.hasinfo = hasinfo
        },
        SET_ROLES: (state, roles) => {
            for (const i of roles) {
                state.roles.push(i.name)
            }
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({commit}, userInfo) {
            const username = userInfo.username.trim();
            return new Promise((resolve, reject) => {
                loginByUsername(username, userInfo.password).then(response => {
                    const data = response.data;
                    commit('SET_TOKEN', data.token);
                    setToken(response.data.token);
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetUserInfo({commit}) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(response => {
                    const data = response.data;
                    console.log(data);
                    commit('SET_ROLES', data.roles_vo);
                    commit('SET_UID', data.id);
                    commit('SET_NAME', data.name);
                    commit('SET_AVATAR', data.avatar);
                    commit('SET_INTRODUCTION', data.introduction);
                    commit("SET_HASINFO", true);
                    //写入路由
                    commit('SET_ROUTERS', asyncRouterMap);
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    removeToken();
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },

        // 动态修改权限
        ChangeRoles({commit}, role) {
            return new Promise(resolve => {
                getUserInfo(role).then(response => {
                    commit('SET_ROLES', ['editor'])
                    // const data = response.data
                    // commit('SET_ROLES', data.roles)
                    // commit('SET_NAME', data.name)
                    // commit('SET_AVATAR', data.avatar)
                    // commit('SET_INTRODUCTION', data.introduction)
                    // resolve()
                })
            })
        }
    }
}

export default user
