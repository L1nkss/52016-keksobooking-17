'use strict';

(function (pageForm, pageMap, usersAd, mainPin, Service, utilities) {
  var appStatus = false;
  var ads = new Service('https://js.dump.academy/keksobooking/data');
  var spinner = new utilities.Spinner(document.querySelector('.loader'));

  var activatePage = function (data) {

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
      usersAd.renderAds(data);
    }
  };

  window.addEventListener('load', function () {
    pageForm.fillAddress();
  });

  // ads.http.upload.addEventListener('progress', function(e) {
  //   spinner.show();
  //   console.log(e);
  // });

  ads.http.addEventListener('load', function() {
    if (this.status === 200) {
      spinner.show();
      ads.fillData(JSON.parse(ads.http.responseText));
      console.log(ads.data)
      activatePage(ads.data);
    }
  });

  mainPin.pin.addEventListener('mousedown', function (evt) {
    // активируем страницу при первом зажатии главного пина
    if (!appStatus) {
      ads.createRequest();
      spinner.show();
    }

    document.addEventListener('mousemove', pageMap.mapPins.onPinMouseMove);
    var x = evt.clientX - parseInt(evt.currentTarget.style.left, 10);
    var y = evt.clientY - parseInt(evt.currentTarget.style.top, 10);

    pageMap.mapPins.initOffsetCoords(x, y);
  });

  mainPin.pin.addEventListener('mousemove', function () {
    pageForm.fillAddress();
  });

  document.addEventListener('mouseup', function (evt) {
    evt.preventDefault();
    document.removeEventListener('mousemove', pageMap.mapPins.onPinMouseMove);
    pageMap.mapPins.initOffsetCoords();
  });

})(window.form, window.map, window.data, window.mainPin, window.service, window.utilities);
