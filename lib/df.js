'use strict';
var shell = require('shelljs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

if(!shell.which('df')){
  throw new Error('hwmon requires df');
}

function DF(options){
  this.interval = options.interval;
  this.timer = null;
}

util.inherits(DF, EventEmitter);

DF.prototype.start = function(){
  var self = this;
  self.stop();
  self.timer = setInterval(function(){
    self.fetchData();
  }, self.interval);
  self.timer.unref();
};

DF.prototype.stop = function(){
  var self = this;
  if(self.timer){
    clearInterval(self.timer);
    self.timer = null;
  }
};

DF.prototype.fetchData = function(){
  var self = this;
  var df = shell.exec('df -m', {async: true, silent: true});
  df.stdout.on('data', function(data){
    var lines = data.split('\n');
    var headers = lines[0].split(/\s+/);

    var dfJSON = {
    };

    for(var i=1;i<lines.length;i++){
      var use = lines[i].split(/\s+/);
      if(use[0].indexOf('/dev') >= 0){
        dfJSON[use[0]] = {};
        for(var j=1;j<use.length;j++){
          dfJSON[use[0]][headers[j]] = use[j];
        }
      }
    }

    self.emit('df', dfJSON);
  });
};

module.exports = DF;