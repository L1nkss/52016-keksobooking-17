'use strict';

(function (map, form, main, Service, card, usersAd) {
  var spinner = document.querySelector('.loader');
  var main = document.querySelector('.map');

  function Pin(element) {
    this.pin = element;
    this.isActive = false;
    // получаем высоту изображения
    this.height = this.pin.querySelector('img').offsetHeight;
    // получаем ширину изображения
    this.width = this.pin.querySelector('img').offsetWidth;
    this.position = {
      x: null,
      y: null
    };
    this.StartPosition = {
      x: null,
      y: null
    }

    this.changePinStatus = this.changePinStatus.bind(this);
    this.pin.addEventListener('mousedown', this.onMouseDown);

    this.calculatePotision();
    this.calculateStartPotision();
  }

  /**
   * Получить позиция pina'a в зависимости от статуса pin'a (true или false)
   */
  Pin.prototype.calculatePotision = function () {
    var width = (this.pin.offsetLeft + this.width / 2);
    var height = (this.pin.offsetTop + this.height);
    /**
     * Если страница активна добавляем 22px (размер кончика pina).
     * Если страница заблокирована, берём обычную высоту
     */
    this.position.x = Math.floor(width);
    this.position.y = Math.floor(this.isActive ? height + 22 : height);
  };

  Pin.prototype.calculateStartPotision = function () {
    this.StartPosition.x = Math.floor(this.pin.offsetLeft);
    this.StartPosition.y = Math.floor(this.pin.offsetTop);
  };

  Pin.prototype.restoreDefaultPosition = function() {
    this.position.x = this.StartPosition.x;
    this.position.y = this.StartPosition.y;
    form.fillAddress(this.position.x, this.position.y);
  };

  Pin.prototype.getPosition = function () {
    return {
      x: this.position.x,
      y: this.position.y
    };
  };

  Pin.prototype.onMouseDown = function (evt) {
    // активируем страницу при первом зажатии главного пина
    activatePage();
    // меняет адрес, так как меняется размер пина
    form.fillAddress(mainPin.getPosition());

    document.addEventListener('mousemove', checkCoords);
    var x = evt.clientX - parseInt(evt.currentTarget.style.left, 10);
    var y = evt.clientY - parseInt(evt.currentTarget.style.top, 10);
    map.mapPins.initOffsetCoords(x, y);

    document.addEventListener('mouseup', onMouseUp);
  };

  Pin.prototype.onMouseMove = function (newPositionX, newPositionY) {
    this.pin.style.left = newPositionX + 'px';
    this.pin.style.top = newPositionY + 'px';
    this.calculatePotision();
  };


  /**
   * Меням статус пина на активный и удаяем eventListener
   */
  Pin.prototype.changePinStatus = function () {
    this.isActive = !this.isActive;
    this.calculatePotision();
  };

  var mainPin = new Pin(document.querySelector('.map__pin--main'));
  form.fillAddress(mainPin.getPosition());

  /**
   * Функция checkCoords проверяет расположение пина на карте(не выходит ли за границы). И вызывает фукнцию fillAddress для заполнения в форме поля Адрес
   */
  var checkCoords = function (evt) {
    if (map.mapPins.onPinMouseMove(evt, mainPin.width)) {
      mainPin.onMouseMove(evt.clientX - map.mapPins.offset.x, evt.clientY - map.mapPins.offset.y);
      form.fillAddress(mainPin.getPosition());
    }
  }

  /**
   *
   * @param {array} data массив с загруженными данными
   *  onSuccess и onError - callback функции при запросе на сервер
   */
  var onSuccess = function (data) {
    // убираем spinner
    spinner.classList.toggle('loader--show');
    // меняет состояние карты
    map.map.changeMapStatus();
    // меняем состояние форм
    form.changeFormStatus();
    // рендерим объявления
    usersAd.renderAds(data);
  }

  var onError = function (code, status) {
    main.appendChild(card.renderErrorData(code, status));
  };

  var activatePage = function () {
    if (!mainPin.isActive) {
      Service('https://js.dump.academy/keksobooking/data', 'GET', onSuccess, onError);
      spinner.classList.toggle('loader--show');
      mainPin.changePinStatus();
    }
  }

  var onMouseUp = function (evt) {
    evt.preventDefault();
    document.removeEventListener('mousemove', checkCoords);
    map.mapPins.initOffsetCoords();
  };

})(window.map, window.form, window.main, window.load, window.card, window.data);
