'use strict';

(function () {
  // константы
  var MapLimit = {
    TOP: 130,
    RIGHT: 1200,
    BOTTOM: 630,
    LEFT: 0
  };

  // переменные
  var map;
  var mapPins;
  var border;

  // функция констуктор для границ карты
  var Limit = function () {
    // ограничение по границам с учётом ширины пина
    this.limits = {
      top: null,
      right: null,
      bottom: null,
      left: null
    };
    // вышел ли пин за карту по осям
    this.isOut = {
      x: false,
      y: false
    };

    this.setAxes = this.setAxes.bind(this);
  };

  Limit.prototype.isLeaves = function () {
    return this.isOut.x || this.isOut.y;
  };

  Limit.prototype.setX = function (width) {
    this.limits.right = MapLimit.RIGHT - width;
    this.limits.left = MapLimit.LEFT - width;
  };

  Limit.prototype.setY = function (height) {
    this.limits.top = MapLimit.TOP - height;
    this.limits.bottom = MapLimit.BOTTOM - height;
  };

  Limit.prototype.setAxes = function (width, height) {
    this.setX(width);
    this.setY(height);
  };

  var coords = {
    posX: null,
    posY: null
  };

  var getMapLimitCoords = function () {
    return MapLimit;
  };

  /**
   * функция getX устанавливает положение пина по оси X
   * border.isOut нужен для хранения статуса выхода пина за границы X или Y
   * Если мы вышли за границы хоть по какой то из осей, то пин не должен двигаться и менять свои координаты, поэтому мы возвращаем последнее значение перед выходом за границы.
   * Коордиты у пина будут меняться только в том случае, если значение обоих осей = false
   * @param {Number} x текущее значение пина по оси X
   * @param {Number} prevX последнее значение пина по X
   *
   * @return {number} возвращает координаты по X
   */
  var getX = function (x, prevX) {
    var isValidX = x >= border.limits.left && x < border.limits.right;

    if (isValidX) {
      border.isOut.x = false;
      // если хотя бы одна из осей находится вне карты, выходим из функции.
      if (border.isLeaves()) {
        return prevX;
      }

      return x;
    }

    // если хотя бы одна из осей находится вне карты, выходим из функции и устанавливаем значение isOut.x = true, так как по оси X мы вышли за границы.
    if (border.isLeaves()) {
      border.isOut.x = true;

      return prevX;
    }
    // устанавливаем значение isOut.x = true, так как по оси X мы вышли за границы ,и ставим граничные значения
    border.isOut.x = true;

    return x > border.limits.right ? border.limits.right : border.limits.left;
  };

    /**
   * функция getX устанавливает положение пина по оси Y
   * border.isOut нужен для хранения статуса выхода пина за границы X или Y
   * Если мы вышли за границы хоть по какой то из осей, то пин не должен двигаться и менять свои координаты, поэтому мы возвращаем последнее значение перед выходом за границы.
   * Коордиты у пина будут меняться только в том случае, если значение обоих осей = false
   * @param {Number} y текущее значение пина по оси Y
   * @param {Number} prevY последнее значение пина по Y
   *
   * @return {number} возвращает координаты по Y
   */
  var getY = function (y, prevY) {
    var isValidY = y >= border.limits.top && y <= border.limits.bottom;

    if (isValidY) {
      border.isOut.y = false;
      // если хотя бы одна из осей находится вне карты, выходим из функции.
      if (border.isLeaves()) {
        return prevY;
      }

      return y;
    }

    if (border.isLeaves()) {
      border.isOut.y = true;
      return prevY;
    }

    // устанавливаем значение isOut.y = true, так как по оси Y мы вышли за границы ,и ставим граничные значения
    border.isOut.y = true;

    return y > border.limits.bottom ? border.limits.bottom : border.limits.top;
  };

  /**
   * Функция calculateCoords рассчитывает положение пина на карте
   * posX и posY - координаты пина внутри карты.
   * функции getX и getY задают координаты пина по осям
   * @param {number} mouseX положение мыши по оси X
   * @param {number} mouseY положение мыши по оси Y
   * @return {object} Возвращаем объект координат.
   */
  var calculateCoords = function (mouseX, mouseY) {
    // позиция мыши на экране
    var posX = mouseX - mapPins.offset.x;
    var posY = mouseY - mapPins.offset.y;

    // получить координаты пина на карте по X и Y
    coords.posX = getX(posX, coords.posX);
    coords.posY = getY(posY, coords.posY);

    return coords;
  };

  var Map = function (query) {
    this.map = document.querySelector(query);
  };

  var MapPins = function (query) {
    Map.call(this, query);
    this.offset = {
      x: 0,
      y: 0
    };
  };

  Map.prototype.changeStatus = function () {
    this.map.classList.toggle('map--faded');
  };

  // наследуем MapPins от Map
  MapPins.prototype = Object.create(Map.prototype);
  MapPins.prototype.constructor = MapPins;

  MapPins.prototype.initOffsetCoords = function (x, y) {
    this.offset.x = x || 0;
    this.offset.y = y || 0;
  };

  map = new Map('.map');
  mapPins = new MapPins('.map__pins');
  border = new Limit();

  window.map = {
    main: map,
    pins: mapPins,
    calculateCoords: calculateCoords,
    getMapLimitCoords: getMapLimitCoords,
    setLimits: border.setAxes
  };
})();
