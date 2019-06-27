'use strict';

(function (pageForm, pageMap, usersAd, mainPin, Service, card) {
  var appStatus = false;
  var adFormStatus = document.querySelector('.ad-form');
  var main = document.querySelector('main');
  var spinner = document.querySelector('.loader');
  var userAds = new Service('https://js.dump.academy/keksobooking/data');

  var onSuccess = function (data) {
    // убираем spinner
    spinner.classList.toggle('loader--show');
    // меняет состояние карты
    pageMap.map.changeMapStatus();
    // меняем состояние форм
    pageForm.changeFormStatus();
    // меняем адрес
    pageForm.fillAddress();
    // меняем состояние страницы
    appStatus = true;
    // рендерим объявления
    usersAd.renderAds(data);
  };

  var onError = function () {
    main.appendChild(card.errorMessage());
  };

  window.addEventListener('load', function () {
    pageForm.fillAddress();
  });

  /**
   * Создаём обработчик для движение мыши по карте
   * getNewCoords - callback функция, которая изменяет координаты pin'a
   * OnMouseMove - функция обработчик события
   */

  var getNewCoords = function (x, y) {
    mainPin.onMouseMove(x, y);
    pageForm.fillAddress();
  };

  function pinMove(callback) {
    return function (evt) {
      pageMap.mapPins.onPinMouseMove(evt, callback);
    };
  }

  var onMouseMove = pinMove(getNewCoords);

  var onMouseUp = function (evt) {
    evt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    pageMap.mapPins.initOffsetCoords();
  };

  var onMouseDown = function (evt) {
    // активируем страницу при первом зажатии главного пина
    if (!appStatus) {
      userAds.request(onSuccess, onError);
      spinner.classList.toggle('loader--show');
    }

    document.addEventListener('mousemove', onMouseMove);
    var x = evt.clientX - parseInt(evt.currentTarget.style.left, 10);
    var y = evt.clientY - parseInt(evt.currentTarget.style.top, 10);
    pageMap.mapPins.initOffsetCoords(x, y);

    document.addEventListener('mouseup', onMouseUp);
  };

  mainPin.pin.addEventListener('mousedown', onMouseDown);

  adFormStatus.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var data = new FormData(evt.target);
    userAds.sendData(evt.target.action, data);
  });

})(window.form, window.map, window.data, window.mainPin, window.load, window.card);
