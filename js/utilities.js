'use strict';

(function () {
/**
 * Получить случайное число
 *
 * @param {number} min - начальное число
 * @param {number} max - конечное число (не включительно)
 *
 * @return {number}
 */
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRandomArrayElement = function (arr) {
    return arr[getRandomInt(0, arr.length - 1)];
  };

  window.utilities = {
    getRandomInt: getRandomInt,
    getRandomArrayElement: getRandomArrayElement
  };
})();
