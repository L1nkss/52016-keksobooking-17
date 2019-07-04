'use strict';

(function () {
  var ErrorCodes = {
    404: 'Страница не найдена. Неправильный url',
    SYNTAX_ERROR: 'Невалидные данные с сервера. Попробуйте позже',
    TIMEOUT: 'время подключение истекло. Попробуйте позже'
  };

  var data = [];

  var fillData = function (arr) {
    data = arr;
  };

  var request = function (url, method, onSuccess, onError, body) {
    var http = new XMLHttpRequest();
    http.timeout = 15000;
    var loadCompleted = function () {
      if (http.status === 200) {
        try {
          JSON.parse(http.responseText);
        } catch (e) {
          onError('SyntaxError', ErrorCodes['SYNTAX_ERROR']);
          return;
        }
        fillData(JSON.parse(http.responseText));
        onSuccess(data);
        return;
      }

      onError(http.status, ErrorCodes[http.status]);
    };

    var timeout = function () {
      onError('Timeout', ErrorCodes['TIMEOUT']);
    };

    var sendCompleted = function () {
      if (http.status === 200) {
        onSuccess();
        return;
      }
      onError();
    };

    http.addEventListener('timeout', timeout);

    if (method === 'GET') {
      http.addEventListener('load', loadCompleted);
      http.open(method, url);
      http.send();
    } else {
      http.addEventListener('load', sendCompleted);
      http.open(method, url);
      http.send(body);
    }
  };

  window.request = request;
})();
