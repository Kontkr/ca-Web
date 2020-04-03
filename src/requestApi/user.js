import Ajax from '../util/ajax';


let userApi = {
     //注册
     register: data => Ajax.axios({ url: '/mplan/ca/user/register', data, type: 'POST' }),

     //更新用户信息
     updateUser: data => Ajax.axios({ url: '/mplan/ca/user/update', data, type: 'POST' }),

     //更新密码
     updatePassword: data => Ajax.axios({ url: '/mplan/ca/user/updatepassword', data, type: 'POST' }),

     //刪除用户
     delete: () => Ajax.axios({ url: '/mplan/ca/user/delete', type: 'POST' }),

     //查询用户信息
     queryUser: () => Ajax.axios({ url: '/mplan/ca/user/queryuser', type: 'POST' })

}

export default userApi;