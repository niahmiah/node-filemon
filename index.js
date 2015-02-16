'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var CronJob = require('cron').CronJob;
var fs = require('fs');
var async = require('async');

var files = [];

function Watcher(options){
  this.schedule = options.schedule;
  this.timezone = options.timezone;
  this.files = options.files || files;
  this.cron = null;
}

util.inherits(Watcher, EventEmitter);

Watcher.prototype.start = function start(){
  var self = this;
  if(self.cron) self.stop();
  this.cron = new CronJob(self.schedule, function cronCb() {
    self.fetchData();
  }, null, true, this.timezone);
};

Watcher.prototype.stop = function stop(){
  var self = this;
  if(self.cron){
    self.cron.stop();
  }
  self.cron = null;
};

Watcher.prototype.fetchData = function fetchData(){
  var self = this;
  var watcherJSON = {};
  async.each(self.files, function eachCb(file, cb){
    fs.readFile(file, function readFileCb(err, data){
      if(err) return cb(err);
      watcherJSON[file] = data.toString();
      return cb(null);
    });
  }, function finalCb(err){
    if(err) console.error(err);
    self.emit('data', watcherJSON);
  });
};

module.exports = Watcher;
