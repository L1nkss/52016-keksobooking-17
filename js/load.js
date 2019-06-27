'use strict';

(function () {
  function AdServise(url) {
    this.url = url;
    this.data = [];
    this.http = null;
  }

  AdServise.prototype.request = function (onSuccess, onError) {
    this.http = new XMLHttpRequest();
    var self = this;
    var loadCompleted = function () {
      if (self.http.status === 200) {
        self.fillData(JSON.parse(self.http.responseText));
        onSuccess(self.data);
        return;
      }

      onError(self.http.status);
    };

    self.http.addEventListener('load', loadCompleted);
    self.http.open('GET', self.url);
    self.http.send();
  };

  AdServise.prototype.fillData = function (arr) {
    this.data = arr;
  };

  AdServise.prototype.sendData = function (url, data) {
    this.http = new XMLHttpRequest();
    this.http.open('POST', url);
    this.http.send(data);
  };

  window.load = AdServise;
})();
