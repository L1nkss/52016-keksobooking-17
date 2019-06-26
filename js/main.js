'use strict';

(function (pageForm, pageMap, usersAd, mainPin) {
  var appStatus = false;
  var activatePage = function () {

    if (!appStatus) {
      // меняет состояние карты
      pageMap.map.changeMapStatus();
      // меняем состояние форм
      pageForm.changeFormStatus();
      // меняем адрес
      pageForm.fillAddress();
      // меняем состояние страницы
      appStatus = true;
      // рендерим объявления
      usersAd.renderAds();
    }
  };

  window.addEventListener('load', function () {
    pageForm.fillAddress();
  });


  mainPin.pin.addEventListener('mousedown', function (evt) {
    // активируем страницу при первом зажатии главного пина
    activatePage();
    document.addEventListener('mousemove', pageMap.mapPins.onPinMouseMove);
    var x = evt.clientX - parseInt(evt.currentTarget.style.left, 10);
    var y = evt.clientY - parseInt(evt.currentTarget.style.top, 10);

    pageMap.mapPins.initOffsetCoords(x, y);

    mainPin.pin.addEventListener('mousemove', function () {
      pageForm.fillAddress();
    });

    document.addEventListener('mouseup', function (evtUp) {
      evtUp.preventDefault();
      document.removeEventListener('mousemove', pageMap.mapPins.onPinMouseMove);
      pageMap.mapPins.initOffsetCoords();
    });
  });

})(window.form, window.map, window.data, window.mainPin);
