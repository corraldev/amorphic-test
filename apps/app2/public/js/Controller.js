module.exports.objectTemplateInitialize = function (objectTemplate) {
    objectTemplate.toServerRuleSet = ['app2'];
    objectTemplate.toClientRuleSet = ['app2'];
};


module.exports.Controller = function (objectTemplate) {
    var fs = require('fs');
    var url = require('url');

    var localObjectTemplate = objectTemplate;
    var Controller = objectTemplate.create('Controller', {
        prop: {type: Boolean, value: false},
        propWithValuesAndDescriptions: {type: String,
            values: ['value'],
            descriptions: {
                value: 'Description'
            }
        },
        virtualProp: {type: String, isVirtual: true,
            get: function() {
                return 'I am virtual';
            }
        },

        serverInit: function() {
            this.prop = true;
            daemonController = this;
        },

        processPost: {on: 'server', body: function(uri, body) {
            this.posted = body.myfield;
            return {status: 303, headers: {location: uri.replace(/amorphic.*/, '')}};
        }},

        getObjectTemplate: function() {
            return localObjectTemplate;
        },

        onContentRequest: function(req, res) {
            var path = url.parse(req.originalUrl, true).query.file;
            var file = __dirname + '/./' + path;
            console.log(file)
            try {
                var stat = fs.statSync(file);
            }
            catch (e) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found');
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Length': stat.size
            });
            var readStream = fs.createReadStream(file);
            readStream.pipe(res);
        }
    });

    return {
        Controller: Controller
    };
};
/*
module.exports.Controller = function (objectTemplate, uses) {
    var myModelThatExtends = uses('models/MyModelThatExtends.js', 'MyModelThatExtends', {
        app: 'app1'
    });

    var Model = uses('Model.js', 'Model');

    objectTemplate.create('Controller', {
        mainFunc: {
            on: 'server',
            body: function() {
                return serverAssert();
            }
        },
        someData2: {
            type: String,
            value: 'initial'
        }
    });
};*/