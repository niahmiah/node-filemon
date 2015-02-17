'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Iostat = require('./lib/iostat');
var Free = require('./lib/free');
var iostat;
var free;

function Hwmon(options){
  this.interval = options.interval;
}

util.inherits(Hwmon, EventEmitter);

Hwmon.prototype.start = function(){
  var self = this;
  iostat = new Iostat({interval: self.interval});
  iostat.start();
  iostat.on('iostat', function(json){
    self.emit('iostat', json);
  });
  free = new Free({interval: self.interval});
  free.start();
  free.on('free', function(json){
    self.emit('free', json);
  });
};

Hwmon.prototype.stop = function(){
  if(iostat) { iostat.stop(); }
  if(free) { free.stop(); }
};

module.exports = Hwmon;