'use strict';

(function () {
  function AdServise (url) {
    this.url = url;
    this.status = 0;
    this.data = [];
    this.http = new XMLHttpRequest();
  }

  AdServise.prototype.createRequest = function () {
    this.http.open('GET', this.url);
    this.http.send();
  };

  AdServise.prototype.fillData = function (arr) {
    this.data = arr;
  };

  window.service = AdServise;
})();
