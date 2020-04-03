import Ajax from '../util/ajax';


let Lg = {
    //登录
    login: data => Ajax.axios({ url: '/mplan/ca/user/login', data, type: 'POST' }),

    //注销
    logout: () => Ajax.axios({ url: '/mplan/ca/user/logout', type: 'POST' }),
}

export default Lg;