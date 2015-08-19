# superagent-csrf-middleware

easily handle CSRF tokens with superagent

Supports simple CSRF implementations and those which modify the token with each request.

### usage

```javascript

var request = require('superagent');
var csrf = require('superagent-csrf-middleware');
var agent = request(server);

var csrf1 = csrf();
agent.get('/foo')
    .use(csrf1)
    .end(function() {
        agent.post('/bar')
            .use(csrf1)
            .end(function() {
                /* ... */
            });
    });
```

### options

By default, `superagent-csrf-middleware` looks at the `XSRF-TOKEN` cookie and sets the `X-XSRF-TOKEN` header. 

You may optionally define other parameters:

```javascript
var cookie = 'MY-XSRF-COOKIE-NAME';
var header = '_SEASURF';
var csrf = require('superagent-csrf-middleware')(cookie, header);
```

### support

This is known to work with [lusca](https://github.com/krakenjs/lusca)'s CSRF implementation.
