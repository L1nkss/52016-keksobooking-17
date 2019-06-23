'use strict';

(function (utilities) {
  var IMAGE_COUNT = 8;
  var mapMinY = 130;
  var mapMaxY = 630;
  var getRandomInt = utilities.getRandomInt;
  var getRandomArrayElement = utilities.getRandomArrayElement;
  var generateUniqImage = utilities.generateUniqImage;
  var imageNumber = generateUniqImage(IMAGE_COUNT);

  /**
   * Генератор случайного объявления
   *
   * @return {object}
   *
   * @example
   *
   * {
    *  author: { avatar: 'img/avatars/user02.png'},
    *  offer: { type: 'flat'},
    *  location: { x: 500, y: 320}
    * }
    *
  */
  var getRandomAd = function () {
    var mapWidth = document.querySelector('.map__pins').offsetWidth;
    var types = ['palace', 'flat', 'house', 'bungalo'];
    var imageString = 'img/avatars/user' + imageNumber.pop() + '.png';

    return {
      author: {
        avatar: imageString
      },
      offer: {
        type: getRandomArrayElement(types)
      },
      location: {
        x: getRandomInt(0, mapWidth),
        y: getRandomInt(mapMinY, mapMaxY)
      }
    };
  };

  var getRandomAds = function (count) {
    var randomAds = [];
    for (var i = 0; i < count; i++) {
      randomAds.push(getRandomAd());
    }
    return randomAds;
  };

  window.randomAds = {
    getRandomAds: getRandomAds
  };

})(window.utilities);
