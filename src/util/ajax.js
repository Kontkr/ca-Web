import $ from 'jquery';
import axios from 'axios';
import { notification } from 'antd';

let Ajax = {
    /** jquery */
    jquery: param => {
        $.ajax({
            async: param.async || "true",
            type: param.type || 'post',
            url: param.url,
            // contentType: param.contentType || 'application/x-www-form-urlencoded',
            data: param.data,
            // dataType:param.dataType || 'json',
            success: param.success
        });
    },
    /** axios */
    axios: param => {
        //返回一个Promise对象
        return new Promise((resolve, reject) => {
            let promise;
            let data = param.data ? param.data : {};
            if (param.type === 'GET') { //执行get请求
                promise = axios.get(param.url, {
                    params: data
                })
            } else {
                promise = axios.post(param.url, data)
            }
            promise.then(response => {
                resolve(response.data);
            }).catch(error => {
                notification.error({
                    description: error.message,
                    message: "服务器异常",
                })
            })
        });
    },

    /**原生的 ajax */
    ajax: param => {

    }
}
export default Ajax