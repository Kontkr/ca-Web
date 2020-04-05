export function Format(date) {
    if (!(date instanceof Date))
        date = new Date();
    let year = date.getFullYear();// getFullYear() 返回年
    let month = date.getMonth() + 1;// getMonth() 返回月份 (0 ~ 11)
    let day = date.getDate();// getDate() 返回日 (1 ~ 31)
    let hours = date.getHours(); // getHours() 返回小时 (0 ~ 23)
    let minutes = date.getMinutes();// getMinutes() 返回分(0 ~ 59)
    let seconds = date.getSeconds();// getSeconds() 返回秒(0 ~ 59)
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}