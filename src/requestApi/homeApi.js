import Ajax from '../util/ajax';

let ha = {

    //发布消息
    addMeaasgeTask: data => Ajax.axios({ url: 'mplan/ca/mt/addmessage', data, type: 'POST' }),

    //查询我的消息任务
    queryMyMt: data => Ajax.axios({ url: '/mplan/ca/mt/querymymt', data, type: 'POST' }),

    //刪除我的任务消息
    deleteMyMt: data => Ajax.axios({ url: '/mplan/ca/mt/deletemymt', data, type: 'POST' }),

    //查询所有的任务消息
    queryAllMt: () => Ajax.axios({ url: '/mplan/ca/mt/queryallmt', type: 'POST' }),

    //查询信息与评论
    queryMC: data => Ajax.axios({ url: '/mplan/ca/mt/querymc', data, type: 'POST' }),

    //评论信息
    addComment: data => Ajax.axios({ url: '/mplan/ca/comment/add', data, type: 'POST' }),

    //刪除评论
    deleteComment: data => Ajax.axios({ url: '/mplan/ca/comment/delete', data, type: 'POST' }),

};

export default ha;