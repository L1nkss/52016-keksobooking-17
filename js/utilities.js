'use strict';

(function () {
  var ESC_CODE = 27;
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

  /**
   *
   * @param {string} url элемент на странице для отображения загрузки данных
   */
  // function Spinner(url) {
  //   this.element = url;
  // }

  // Spinner.prototype.show = function () {
  //   this.element.classList.toggle('loader--show');
  // };

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

  var renderImage = function (image) {
    var img = document.createElement('img');
    img.src = image;
    img.width = 45;
    img.height = 40;
    img.alt = 'Фотография жилья';
    img.classList = 'popup__photo';
    return img;
  };

  var renderFeaturesList = function (feature) {
    var li = document.createElement('li');
    li.classList = 'popup__feature popup__feature--' + feature;

    return li;
  };

  window.utilities = {
    getRandomInt: getRandomInt,
    getRandomArrayElement: getRandomArrayElement,
    generateUniqImage: generateUniqImage,
    isEscPress: isEscPress,
    renderImage: renderImage,
    renderFeaturesList: renderFeaturesList
  };
})();
