'use strict';

(function () {
  var ErrorCodes = {
    404: 'Страница не найдена. Неправильный url',
    SYNTAX_ERROR: 'Невалидные данные с сервера. Попробуйте позже',
    TIMEOUT: 'время подключение истекло. Попробуйте позже'
  }

  var data = [];

  var fillData = function (arr) {
    data = arr;
  }

  var request = function (url, method, onSuccess, onError, body) {
    var http = new XMLHttpRequest();
    http.timeout = 15000;
    var loadCompleted = function() {
      if (http.status === 200) {
        try {
          JSON.parse(http.responseText);
        } catch {
          onError('SyntaxError', ErrorCodes['SYNTAX_ERROR']);
          return false;
        }
        fillData(JSON.parse(http.responseText));
        onSuccess(data);
        return;
      }

      onError(http.status, ErrorCodes[http.status])
    }

    var timeout = function () {
      onError('Timeout', ErrorCodes['TIMEOUT'])
    }

    var sendCompleted = function() {
      if (http.status === 200) {
        onSuccess()
        return;
      }
      onError();
    }

    http.addEventListener('timeout', timeout)

    if (method === 'GET') {
      http.addEventListener('load', loadCompleted);
      http.open(method, url);
      http.send();
    } else {
      http.addEventListener('load', sendCompleted);
      http.open(method, url);
      http.send(body);
    }

  }
  // function AdServise(url) {
  //   this.url = url;
  //   this.data = [];
  //   this.http = null;
  // }

  // AdServise.prototype.request = function (onSuccess, onError) {
  //   this.http = new XMLHttpRequest();
  //   var self = this;
  //   var loadCompleted = function () {
  //     if (self.http.status === 200) {
  //       try {
  //         JSON.parse(self.http.responseText);
  //       } catch {
  //         onError('SyntaxError', ErrorCodes['SYNTAX_ERROR']);
  //         return false;
  //       }
  //       self.fillData(JSON.parse(self.http.responseText));
  //       onSuccess(self.data);
  //       return;
  //     }

  //     onError(self.http.status, ErrorCodes[self.http.status]);
  //   };

  //   this.http.addEventListener('load', loadCompleted);
  //   this.http.open('GET', self.url);
  //   this.http.send();
  // };

  // AdServise.prototype.fillData = function (arr) {
  //   this.data = arr;
  // };

  // AdServise.prototype.sendData = function (url, data) {
  //   this.http = new XMLHttpRequest();
  //   this.http.open('POST', url);
  //   this.http.send(data);
  // };

  // window.load = AdServise;
  window.load = request;
})();
