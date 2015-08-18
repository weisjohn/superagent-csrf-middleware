
module.exports = function(cookie, header) {

    // optional params
    cookie = cookie || 'XSRF-TOKEN';
    header = header || 'X-' + cookie;
    var regex = new RegExp('^' + cookie);

    // the actual middleware
    return function csrf_middleware(req) {

        // optionally set the csrf token
        if (req.agent.csrf) req.set(header, req.agent.csrf);

        // retain reference to old callback
        var callback = req.callback;

        // patch callback to capture token
        req.callback = function(err, res) {

            // process each cookie
            var cookies = res.headers['set-cookie'];
            if (!Array.isArray(cookies)) cookies = [ cookies ];
            cookies.forEach(function(cookie) {
                if (!regex.test(cookie)) return;

                // split the cookie
                var token = cookie.split('=')[1].split(';')[0];

                // retain reference to new CSRF token
                req.agent.csrf = decodeURIComponent(token);
            });

            // invoke original callback ref
            return callback.call(req, err, res);
        };
    };

};
