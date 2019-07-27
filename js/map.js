'use strict';

(function () {
  var MapLimit = {
    TOP: 130,
    RIGHT: 1200,
    BOTTOM: 630,
    LEFT: 0
  };

  // Объект, которые хранит состояние выхода пина за границу.
  // Если пин вышел за границы по x или y, то присваивается значение true
  // Метод isLeaves возвращается значение true, если пин вышел хотя бы из одной границы(x или y)
  var borderOut = {
    x: false,
    y: false,
    isLeaves: function () {
      return this.x || this.y;
    }
  };

  var coords = {
    posX: null,
    posY: null
  };

  var getMapLimitCoords = function () {
    return MapLimit;
  };

  /**
   * функция getX устанавливает координаты пина по оси X
   * @param {Number} x координата пина по X
   * @param {Object} limit Границы карты по X
   */
  var getX = function (x, limit) {
    var isValidX = x >= limit.left && x < limit.right;

    if (isValidX) {
      borderOut.x = false;
      // если хотя бы одна из осей находится вне карты, выходим из функции.
      if (borderOut.isLeaves()) {
        return;
      }

      coords.posX = x;
      return;
    }

    // если хотя бы одна из осей находится вне карты, выходим из функции и устанавливаем значение borderOut.x = true, так как по оси X мы вышли за границы.
    if (borderOut.isLeaves()) {
      borderOut.x = true;
      return;
    }
    // устанавливаем значение borderOut.x = true, так как по оси X мы вышли за границы ,и ставим граничные значения
    borderOut.x = true;
    coords.posX = x > limit.right ? limit.right : limit.left;
    return;
  };

    /**
   * функция getY устанавливает координаты пина по оси Y
   * @param {Number} y координата пина по Y
   * @param {Object} limit Границы карты по Y
   */
  var getY = function (y, limit) {
    var isValidY = y >= limit.top && y <= limit.bottom;

    if (isValidY) {
      borderOut.y = false;
      // если хотя бы одна из осей находится вне карты, выходим из функции.
      if (borderOut.isLeaves()) {
        return;
      }

      coords.posY = y;
      return;
    }

    // если хотя бы одна из осей находится вне карты, выходим из функции и устанавливаем значение borderOut.y = true, так как по оси Y мы вышли за границы.
    if (borderOut.isLeaves()) {
      borderOut.y = true;
      return;
    }

    // устанавливаем значение borderOut.y = true, так как по оси Y мы вышли за границы ,и ставим граничные значения
    borderOut.y = true;
    coords.posY = y > limit.bottom ? limit.bottom : limit.top;
    return;
  };

  /**
   * Функция calculateCoords рассчитывает положение пина на карте
   * posX и posY - координаты пина внутри карты.
   * объекты limitX и limitY хранят границы карты с учётом размера пина
   * функции getX и getY задают координаты пина.
   * @param {number} mouseX положение мыши по оси X
   * @param {number} mouseY положение мыши по оси Y
   * @param {number} width ширина пина
   * @param {number} height высота пина
   * @return {object} Возвращаем объект координат.
   */
  var calculateCoords = function (mouseX, mouseY, width, height) {
    // позиция мыши на экране
    var posX = mouseX - mapPins.offset.x;
    var posY = mouseY - mapPins.offset.y;

    // границы карты, за которые pin не должен выйти c учётом ширины / 2.
    var limitX = {
      left: MapLimit.LEFT - width,
      right: MapLimit.RIGHT - width
    };

    var limitY = {
      top: MapLimit.TOP - height,
      bottom: MapLimit.BOTTOM - height
    };

    // получить координаты пина на карте по X и Y
    getX(posX, limitX);
    getY(posY, limitY);

    return coords;
  };

  var Map = function (query) {
    // this.map = element;
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

  var map = new Map('.map');
  var mapPins = new MapPins('.map__pins');

  window.map = {
    main: map,
    pins: mapPins,
    calculateCoords: calculateCoords,
    getMapLimitCoords: getMapLimitCoords
  };
})();
