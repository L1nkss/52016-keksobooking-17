'use strict';

(function (map, form, createRequest, card, usersAd) {
  var spinner = document.querySelector('.loader');
  var pinMap = document.querySelector('.map');
  var adFormStatus = document.querySelector('.ad-form');

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
    };

    this.changePinStatus = this.changePinStatus.bind(this);
    this.restoreDefaultPosition = this.restoreDefaultPosition.bind(this);
    this.pin.addEventListener('mousedown', this.onMouseDown);

    this.calculatePotision();
    this.calculateStartPotision();
  }

  /*                    Прототипы класса Pin                               */
  /* --------------------------------------------------------------------- */
  /**
   * Получить позиция pina'a в зависимости от статуса pin'a (true или false)
   */
  Pin.prototype.calculatePotision = function () {
    var width = (this.pin.offsetLeft + this.width / 2);
    /**
     * Если страница активна добавляем 22px (размер кончика pina).
     * Если страница заблокирована, берём половину высоты.
     */
    var height = this.isActive ? this.height + 22 : this.height / 2;
    this.position.x = Math.floor(width);
    this.position.y = Math.floor(this.pin.offsetTop + height);
  };

  Pin.prototype.calculateStartPotision = function () {
    this.StartPosition.x = Math.floor(this.pin.offsetLeft);
    this.StartPosition.y = Math.floor(this.pin.offsetTop);
  };

  Pin.prototype.restoreDefaultPosition = function () {
    this.position.x = this.StartPosition.x;
    this.position.y = this.StartPosition.y;
    this.onMouseMove(this.position.x, this.position.y);
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
   * Меням статус пина на активный и рассчитываем новое положение
   */
  Pin.prototype.changePinStatus = function () {
    this.isActive = !this.isActive;
    this.calculatePotision();
  };

  /* --------------------------------------------------------------------- */
  var mainPin = new Pin(document.querySelector('.map__pin--main'));
  form.fillAddress(mainPin.getPosition());

  /**
   * Функция checkCoords проверяет расположение пина на карте(не выходит ли за границы). И вызывает * функцию fillAddress для заполнения в форме поля Адрес
   */

  var checkCoords = function (evt) {
    var validX = map.validCoods.isValidX;
    var validY = map.validCoods.isValidY;
    if (validX(evt.clientX, mainPin.width) && validY(evt.clientY, mainPin.height)) {
      mainPin.onMouseMove(evt.clientX - map.mapPins.offset.x, evt.clientY - map.mapPins.offset.y);
      form.fillAddress(mainPin.getPosition());
    }
  };

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
  };

  var onError = function (code, status) {
    pinMap.appendChild(card.renderErrorData(code, status));
  };

  /**
   * Функция restoreDefaultPosition возвращает пин в начальную точку и заполняет Address
   */
  var restoreDefaultPosition = function () {
    mainPin.restoreDefaultPosition();
    form.fillAddress(mainPin.getPosition());
  };


  /**
   * Функция активации страницы
   * Если страница не активна. Делаем запрос на сервер и меняет статус pin'a
   */
  var activatePage = function () {
    if (!mainPin.isActive) {
      createRequest('https://js.dump.academy/keksobooking/data', 'GET', onSuccess, onError);
      spinner.classList.toggle('loader--show');
      mainPin.changePinStatus();
      return;
    }
  };

  /**
   * Функция деактивации страницы
   * Меняет все поля на начальные и блокирует страницу
   */
  var disactivatePage = function () {
    // возвращает пин в начальную точку
    restoreDefaultPosition();
    // меняет статус Pin'a
    mainPin.changePinStatus();
    // меняем статус карты
    map.map.changeMapStatus();
    // удаляем карточки
    usersAd.removeAds();
    // если есть открытые карточки, закрываем её
    card.changePrevCard();
    // меняем статус pina
    mainPin.changePinStatus();
  };

  var onMouseUp = function (evt) {
    evt.preventDefault();
    document.removeEventListener('mousemove', checkCoords);
    map.mapPins.initOffsetCoords();
  };

  // callback функции для обработчика формы
  var setDefaultPageStatus = function () {
    mainPin.changePinStatus();
    disactivatePage();
  };
  var onFormReset = form.formReset(restoreDefaultPosition);
  var onFormSubmit = form.formSubmit(setDefaultPageStatus);

  adFormStatus.addEventListener('reset', onFormReset);
  adFormStatus.addEventListener('submit', onFormSubmit);

})(window.map, window.form, window.request, window.card, window.data);
