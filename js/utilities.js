'use strict';

(function () {
  var ESC_CODE = 27;
  var ENTER_CODE = 13;
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

  var generateUniqImage = function (imageCount) {
    var uniqArray = [];

    for (var i = 1; i <= imageCount; i++) {
      if (i < 10) {
        uniqArray.push('0' + i);
      } else {
        uniqArray.push(i + '');
      }
    }
    return uniqArray;
  };

  var isEscPress = function (key) {
    return key === ESC_CODE;
  };

  var isEnterPress = function (key) {
    return key === ENTER_CODE;
  };

  window.utilities = {
    getRandomInt: getRandomInt,
    getRandomArrayElement: getRandomArrayElement,
    generateUniqImage: generateUniqImage,
    isEscPress: isEscPress,
    isEnterPress: isEnterPress
  };
})();
