'use strict';

(function (map, form, createRequest, notify, usersAd, utilities, filter) {
  // острый конец пина
  var PIN_TIP = 22;

  var mainPin;

  var spinner = document.querySelector('.loader');
  var pinMap = document.querySelector('.map');
  var adFormStatus = document.querySelector('.ad-form');

  var Pin = function (element) {
    this.pin = element;
    this.isActive = false;
    // получаем высоту изображения
    this.height = this.pin.querySelector('img').offsetHeight;
    // получаем ширину изображения
    this.width = this.pin.offsetWidth;
    this.halfWidth = this.width / 2;
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
    this.pin.addEventListener('keydown', this.onEnterPress);

    this.calculatePotision();
    this.calculateStartPotision();
  };

  /*                    Прототипы класса Pin                               */
  /* --------------------------------------------------------------------- */
  /**
   * Получить позиция pina'a в зависимости от статуса pin'a (true или false)
   */
  Pin.prototype.calculatePotision = function () {
    var width = (this.pin.offsetLeft + this.halfWidth);
    this.position.x = Math.floor(width);
    this.position.y = Math.floor(this.pin.offsetTop + this.height);

  };

  Pin.prototype.calculateStartPotision = function () {
    this.StartPosition.x = Math.floor(this.pin.offsetLeft);
    this.StartPosition.y = Math.floor(this.pin.offsetTop);
  };

  // вернуть пин на начальную позицию
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

  Pin.prototype.onEnterPress = function (evt) {
    if (utilities.isEnterPress(evt.keyCode)) {
      // активируем страницу при первом зажатии главного пина
      activatePage();
      // меняет адрес, так как меняется размер пина
      form.fillAddress(mainPin.getPosition());
    }
  };

  Pin.prototype.onMouseMove = function (newPositionX, newPositionY) {
    this.pin.style.left = newPositionX + 'px';
    this.pin.style.top = newPositionY + 'px';
    this.calculatePotision();
  };


  /**
   * Меням статус пина на активный и рассчитываем новое положение
   * Если пин активирован, добавляем высоте 22px(так как рассчёт коордит идёт от острого конца пина), если нет берём центр пина.
   */
  Pin.prototype.changePinStatus = function () {
    this.isActive = !this.isActive;
    this.height = this.isActive ? this.height + PIN_TIP : this.height / 2;
    this.calculatePotision();
  };

  /* --------------------------------------------------------------------- */
  mainPin = new Pin(document.querySelector('.map__pin--main'));
  form.fillAddress(mainPin.getPosition());

  /**
   * Функция checkCoords проверяет расположение пина на карте(не выходит ли за границы). И вызывает * функцию fillAddress для заполнения в форме поля Адрес
   */

  var checkCoords = function (evt) {
    var coords = map.calculateCoords(evt.clientX, evt.clientY, mainPin.halfWidth, mainPin.height);

    mainPin.onMouseMove(coords.posX, coords.posY);
    form.fillAddress(mainPin.getPosition());
  };

  /**
   *  onSuccess и onError - callback функции при запросе на сервер
   * @param {array} data массив с загруженными данными
   */
  var onSuccess = function (data) {
    // убираем spinner
    spinner.classList.toggle('loader--show');
    // меняет состояние карты
    map.mainMap.changeMapStatus();
    // меняем состояние форм
    form.changeFormStatus();
    // рендерим объявления
    usersAd.renderAds(data);
  };

  var onError = function (code, status) {
    pinMap.appendChild(notify.renderErrorData(code, status));
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
    map.mainMap.changeMapStatus();
    // возвращаем стандартные настройки для фильтров
    filter.restoreDefaultSetting();
    // удаляем карточки
    usersAd.activePins.deleteAll();
    // если есть открытые карточки, закрываем её
    usersAd.clearActiveCard();
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
  var onFormReset = form.formReset(setDefaultPageStatus);
  var onFormSubmit = form.formSubmit(setDefaultPageStatus);

  adFormStatus.addEventListener('reset', onFormReset);
  adFormStatus.addEventListener('submit', onFormSubmit);

})(window.map, window.form, window.request, window.notify, window.data, window.utilities, window.filter);
