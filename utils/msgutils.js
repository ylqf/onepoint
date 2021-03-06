let Msg = {
    file: Msg_file,
    list: Msg_list,
    info: Msg_info,
    json: Msg_json,
    html: Msg_html,
    html_json: Msg_html_json,
    error: Msg_error,
    down: Msg_download,
    constants: {
        'Incomplete_folder_path': 'Incomplete folder path',
        'No_such_command':'No such command',
        'Just_for_mounting':'Just for mounting |-_-',
        'Download_not_allowed':'Download not allowed',
        'File_already_exists':'File already exists',
        'Content_Range_is_invalid':'Content-Range is invalid',
        'Offset_is_invalid':'Offset is invalid',
        'Range_is_invalid':'Range is invalid'
    }
}

function Msg_file(file, url = '?download') {
    return {
        type: 0, //0_file 固定值
        statusCode: 200,//200 固定值
        data: {
            file: file,
            url: url
        }
    }
}

function Msg_list(list, nextToken) {
    return {
        type: 1, //1_dir 固定值
        statusCode: 200,// 固定值
        data: {
            list, nextToken
        }
    };
}

function Msg_info(statusCode, info, headers) {
    let m = {
        type: 2, //2_info 固定值
        statusCode: statusCode,//enum: 200 301 401 403 404 500
        headers: headers,
        data: {
            info: info || statusCode
        }
    };
    return m;
}

function Msg_json(statusCode, obj, headers) {
    let m = {
        type: 2, //2_info 固定值
        statusCode: statusCode,//enum: 200 301 401 403 404 500
        headers: headers,
        data: {
            info: 'json msg',
            json: obj
        }
    };
    return m;
}

function Msg_html(statusCode, html, headers) {
    return {
        type: 3, //3_html 固定值
        statusCode: statusCode,//enum: 200 301 401 403 404 500
        headers: headers || { 'Content-Type': 'text/html' },
        data: {
            html: html//html text
        }
    }
}

function Msg_html_json(statusCode, obj, headers) {
    return {
        type: 3, //3_html 固定值
        statusCode: statusCode,
        headers: headers || { 'Content-Type': 'application/json' },
        data: {
            html: JSON.stringify(obj)
        }
    }
}


function Msg_error(statusCode, info, headers) {
    let m = {
        type: 2,
        statusCode: statusCode,
        headers: headers,
        data: {
            info: info || statusCode
        }
    };
    let e = new Error(m.data.info);
    return Object.assign(e, m);
}

const { axios } = require('./nodeutils');
async function Msg_download(req) {
    // if (authorization) headers.authorization = this.authorization;
    // if (range) headers.range = this.range;
    //@flag 以后支持导出下载链接
    let res = await axios({ url: req.url, headers: req.headers, method: req.method || 'get', responseType: 'stream' });
    return Msg.html(res.status, res.data, res.headers);
}

function urlSpCharEncode(s) {
    if (!s) return s;
    let res = '';
    for (let len = s.length, i = 0; i < len; i++) {
        let ch = s[i];
        switch (ch) {
            case '%':
                res += '%25';
                break;
            case '?':
                res += '%3f';
                break;
            case '#':
                res += '%23';
                break;
            case ' ':
                res += '%20';
                break;
            default:
                res += ch;
        }
    }
    return res;
}
function formatSize(size) {
    if (typeof size !== "number") size = NaN;
    let count = 0;
    while (size >= 1024) {
        size /= 1024;
        count++;
    }
    size = size.toFixed(2);
    size += [' B', ' KB', ' MB', ' GB'][count];
    return size;
};
module.exports = { Msg, formatSize, urlSpCharEncode };
