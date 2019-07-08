'use strict';

(function () {
  var MapLimit = {
    TOP: 130,
    RIGHT: 1200,
    BOTTOM: 630,
    LEFT: 0
  };

  var isPinInsideMap = false;
  var isBorderSet = false;
  var coords = {
    posX: null,
    posY: null
  }

  /**
   * Функция CalculateCoords рассчитывает положение пина на карте
   * posX и posY - координаты пина внутри карты.
   * Функция mouseLeaveMap рассчитывает координаты осей, если мышь вышла за границы.
   * Если переменная isBorderSet - true, значит мы уже рассчитали координаты и мышь находится за границей карты, следовательно не надо считать ещё раз.
   * @param {number} mouseX положение мыши по оси X
   * @param {number} mouseY положение мыши по оси Y
   * @param {number} width ширина пина
   * @param {number} height высота пина
   */
  var calculateCoords = function(mouseX, mouseY, width, height) {
    var posX = mouseX - mapPins.offset.x;
    var posY = mouseY - mapPins.offset.y;
    // Проверяем находимся ли мы внутри карты или нет
    var isValidX = posX >= MapLimit.LEFT && posX < MapLimit.RIGHT - width;
    var isValidY = posY >= MapLimit.TOP - height && posY <= MapLimit.BOTTOM - height;
    // установить граничные значение для оси.
    var mouseLeavesMap = function(mouseX, mouseY) {
      if (!isBorderSet) {
        if (mouseX > MapLimit.RIGHT - width) {
          coords.posX = MapLimit.RIGHT - width;
        }

        if (mouseX < MapLimit.LEFT) {
          coords.posX = MapLimit.LEFT;
        }

        if (mouseY < MapLimit.TOP - height) {
          coords.posY = MapLimit.TOP - height;
        }

        if (mouseY > MapLimit.BOTTOM - height) {
          coords.posY = MapLimit.BOTTOM - height;
        }
        isBorderSet = true;
      }
    }


    isPinInsideMap =  isValidX && isValidY;

    if (isPinInsideMap) {
      coords.posX = posX;
      coords.posY = posY;
      isBorderSet = false;
      return coords;
    }

    mouseLeavesMap(posX, posY);
    return coords;
  }

  function Map(element) {
    this.map = element;
  }

  function MapPins(element) {
    Map.call(this, element);
    this.offset = {
      x: 0,
      y: 0
    };
  }

  Map.prototype.changeMapStatus = function () {
    this.map.classList.toggle('map--faded');
  };

  // наследуем MapPins от Map
  MapPins.prototype = Object.create(Map.prototype);
  MapPins.prototype.constructor = MapPins;

  MapPins.prototype.initOffsetCoords = function (x, y) {
    this.offset.x = x || 0;
    this.offset.y = y || 0;
  };

  var map = new Map(document.querySelector('.map'));
  var mapPins = new MapPins(document.querySelector('.map__pins'));

  window.map = {
    map: map,
    mapPins: mapPins,
    // validCoods: {
    //   isValidX: isValidX,
    //   isValidY: isValidY
    // },
    calculateCoords: calculateCoords
  };
})();
