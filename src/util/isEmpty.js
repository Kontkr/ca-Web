
export function isEmpty(param) {
    if (!param) {//false,空字符串，0，null,undefined,NaN
        return true;
    }
    let type = typeof param;
    //"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
    if (typeof param == 'string') {
        if (param.trim().length == 0) {
            return true;
        }
    } else if (type == 'object') {
        if (Array.isArray(param)) {
            if (param.length == 0) {
                return true;
            }
        }
    } else {//其它类型，后续有需要在处理
        return false;
    }
    return false;
}

export function isNotEmpty(param) {
    return !isEmpty(param);
}



