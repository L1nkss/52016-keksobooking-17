'use strict';

(function () {
  var MapLimit = {
    TOP: 130,
    RIGHT: 1200,
    BOTTOM: 630,
    LEFT: 0
  };

  // находится ли пин внутри карты
  var isPinInsideMap = false;
  // установили ли мы граничные значения для пина.
  var isBorderSet = false;
  var coords = {
    posX: null,
    posY: null
  };

  var getMapLimitCoords = function () {
    return MapLimit;
  };

  /**
   * Функция calculateCoords рассчитывает положение пина на карте
   * posX и posY - координаты пина внутри карты.
   * Функция mouseLeaveMap рассчитывает координаты осей, если мышь вышла за границы.
   * Если переменная isBorderSet - true, значит мы уже рассчитали координаты и мышь находится за границей карты, следовательно не надо считать ещё раз.
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
    var leftLimit = MapLimit.LEFT - width;
    var rightLimit = MapLimit.RIGHT - width;
    var topLimit = MapLimit.TOP - height;
    var bottomLimit = MapLimit.BOTTOM - height;

    // Проверяем находимся ли мы внутри карты или нет
    var isValidX = posX >= leftLimit && posX < rightLimit;
    var isValidY = posY >= topLimit && posY <= bottomLimit;
    // установить граничные значение для оси.
    var mouseLeavesMap = function () {
      if (!isBorderSet) {
        if (posX > rightLimit) {
          coords.posX = rightLimit;
        }

        if (posX <= leftLimit) {
          coords.posX = leftLimit;
        }

        if (posY < topLimit) {
          coords.posY = topLimit;
        }

        if (posY > bottomLimit) {
          coords.posY = bottomLimit;
        }
        isBorderSet = true;
      }
    };

    // проверяем что мы внутри карты
    isPinInsideMap = isValidX && isValidY;

    // Если внутри карты, задаём координатам положения мыши и устанавливаем переменной isBorderSet -false
    if (isPinInsideMap) {
      coords.posX = posX;
      coords.posY = posY;
      isBorderSet = false;
      return coords;
    }

    mouseLeavesMap();
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
    mainMap: map,
    mapPins: mapPins,
    calculateCoords: calculateCoords,
    getMapLimitCoords: getMapLimitCoords
  };
})();
