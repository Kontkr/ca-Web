import Ajax from '../util/ajax';


let Aa = {
    //审批
    adopt: data => Ajax.axios({ url: '/mplan/ca/approval/adopt', data, type: 'POST' }),

    //驳回
    reject: data => Ajax.axios({ url: '/mplan/ca/approval/reject', data, type: 'POST' }),
}

export default Aa;