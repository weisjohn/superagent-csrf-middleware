
module.exports = function(cookie, header) {

    // optional params
    cookie = cookie || 'XSRF-TOKEN';
    header = header || 'X-' + cookie;
    var regex = new RegExp('^' + cookie);

    // the actual middleware
    return function csrf_middleware(req) {

        // optionally set the csrf token
        var csrf = req.agent ? req.agent.csrf : csrf;
        if (csrf) req.set(header, csrf);

        // retain reference to old callback
        var callback = req.callback;

        // patch callback to capture token
        req.callback = function(err, res) {

            // process each cookie
            res.headers['set-cookie'].forEach(function(cookie) {
                if (!regex.test(cookie)) return;

                // split the cookie
                var token = cookie.split('=')[1].split(';')[0];

                // decode value to overcome encoding
                csrf = decodeURIComponent(token);
            });

            // retain reference to new CSRF token
            req.agent.csrf = csrf;

            // invoke original callback ref
            return callback.call(req, err, res);
        };
    };

};
