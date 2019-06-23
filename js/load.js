(function () {
  function adServise (url) {
    this.url = url;
    this.status = 0;
    this.data = [];
    this.http = new XMLHttpRequest();
    this.http.addEventListener('progress', this.test);
  }

  adServise.prototype.createRequest = function () {
    this.http.open('GET', this.url);
    this.http.send();
  }

  adServise.prototype.fillData = function (arr) {
    this.data = arr;
  }

  adServise.prototype.test = function (callback) {
    callback();
  }

  window.service = adServise;
})();
