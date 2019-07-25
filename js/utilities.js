'use strict';

(function () {
  var ESC_CODE = 27;
  var ENTER_CODE = 13;

  var isEscPress = function (key) {
    return key === ESC_CODE;
  };

  var isEnterPress = function (key) {
    return key === ENTER_CODE;
  };

  window.utilities = {
    isEscPress: isEscPress,
    isEnterPress: isEnterPress
  };
})();
