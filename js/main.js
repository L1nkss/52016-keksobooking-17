'use strict';
/**
 * Получить случайное число
 *
 * @param {number} min - начальное число
 * @param {number} max - конечное число (не включительно)
 *
 * @return {number}
 */
window.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var data = (function () {
  var AD_COUNT = 8; // количество объявлений
  var IMAGE_COUNT = 8;
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var ads = [];
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
    /**
     * @description Генерируем строку для пути к картинке
     *
     * @example
     *
     * imageString = 'img/avatars/user02.png'
     */
    var imageNumber = window.getRandomInt(1, IMAGE_COUNT);
    var imageString = 'img/avatars/user0' + imageNumber + '.png';

    return {
      author: {
        avatar: imageString
      },
      offer: {
        type: types[window.getRandomInt(0, types.length - 1)]
      },
      location: {
        x: window.getRandomInt(0, mapWidth),
        y: window.getRandomInt(130, 630)
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

  ads = getRandomAds(AD_COUNT);

  var renderAds = function () {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      var left = ad.location.x + PIN_WIDTH / 2;
      var top = ad.location.y + PIN_HEIGHT / 2;
      var type = ad.offer.type;
      var avatar = ad.author.avatar;
      var adElement = adTemplate.cloneNode(true);

      // устанавливаем стили для объявления и добавляем во fragment
      adElement.style = 'left: ' + left + 'px; top: ' + top + 'px;';
      adElement.querySelector('img').src = avatar;
      adElement.querySelector('img').alt = type;
      fragment.appendChild(adElement);
    });
    pinList.appendChild(fragment);
  };

  var removeAds = function () {
    var arrayPins = document.querySelectorAll('.map__pin');
    arrayPins.forEach(function (el, index) {
      if (index !== 0) {
        el.remove();
      }
    });
  };

  return {
    renderAds: renderAds,
    removeAds: removeAds
  };
}());


var form = (function () {
  var addressInput = document.getElementById('address');
  var adFormStatus = document.querySelector('.ad-form');
  var mapFilter = document.querySelectorAll('.map__filter');
  var adForm = document.querySelectorAll('.ad-form__element');
  var mapFeatures = document.querySelector('.map__features');
  var nameInput = document.getElementById('title');
  var nameInputText = document.querySelector('.title-label');
  var priceInput = document.getElementById('price');
  var priceInputText = document.querySelector('.price-label');
  var houseType = document.getElementById('type');
  var timein = document.getElementById('timein');
  var timeout = document.getElementById('timeout');
  var TypeOfHousePrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  }

  function ReqNameInput(element, text) {
    this.input = element;
    this.isValid = false;
    this.label = text;
    this.labelText = text.textContent;

    ReqNameInput.prototype.checkInputValid = function () {
      if (this.input.checkValidity()) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    };

    ReqNameInput.prototype.restoreDefaultSetting = function () {
      this.input.classList.remove('invalid-value');
      this.label.textContent = this.labelText;
    };

    ReqNameInput.prototype.showErrorMessage = function (valueCount) {
      var minValue = 30;
      var left = minValue - valueCount;
      return 'Минимальное количество символов ' + minValue + ' Осталось ' + left;
    };

    ReqNameInput.prototype.inputValid = function (count) {
      this.checkInputValid();
      if (this.isValid) {
        this.restoreDefaultSetting();
      } else {
        this.label.textContent = this.showErrorMessage(count);
        this.input.classList.add('invalid-value');
      }
    };
  }

  function ReqNumberInput(element, text) {
    this.input = element;
    this.isValid = false;
    this.label = text;
    this.labelText = text.textContent;
    this.currentValue = 0;

    ReqNumberInput.prototype.checkInputValid = function () {
      if (this.input.checkValidity()) {
        this.isValid = true;
        this.restoreDefaultSetting();
      } else {
        this.isValid = false;
        this.label.textContent = this.showErrorMessage();
        this.input.classList.add('invalid-value');
      }
    };

    ReqNumberInput.prototype.setMinValue = function (value) {
      this.input.min = value;
      this.input.placeholder = value;
    };

    ReqNumberInput.prototype.restoreDefaultSetting = function () {
      this.input.classList.remove('invalid-value');
      this.label.textContent = this.labelText;
    };

    ReqNumberInput.prototype.showErrorMessage = function () {
      return 'Минимальная цена за ночь: ' + this.input.min;
    };
  }

  var syncTime = function (type) {
    if (type === 'in') {
      timeout.value = timein.value
    } else if (type === 'out') {
      timein.value = timeout.value
    }
  }

  var fillAddress = function (x, y) {
    addressInput.value = x + ', ' + y;
  };

  var changeFormStatus = function () {
    adFormStatus.classList.toggle('ad-form--disabled');
    adFormStatus.classList.toggle('disabled-events');
    // меняем состояние элементов форм
    mapFilter.forEach(function (el) {
      el.disabled = !el.disabled;
    });

    adForm.forEach(function (el) {
      el.disabled = !el.disabled;
    });

    mapFeatures.disabled = !mapFeatures.disabled;
  };

  var changeHouseType = function (value, element) {
    element.setMinValue(TypeOfHousePrice[value.toUpperCase()]);
    element.checkInputValid();
  };

  return {
    fillAddress: fillAddress,
    changeFormStatus: changeFormStatus,
    nameInput: new ReqNameInput(nameInput, nameInputText),
    priceInput: new ReqNumberInput(priceInput, priceInputText),
    houseType: houseType,
    changeHouseType: changeHouseType,
    visitTimes: {
      timeIn: timein,
      timeOut: timeout,
      syncTime: syncTime
    }
  };
}());


var mapPins = (function () {
  var mainPin = document.querySelector('.map__pin--main');
  var primaryPin = { // главный пин
    isActive: false,
    activeHeight: mainPin.clientHeight + 22,
    disabledHeight: mainPin.clientHeight,
    width: mainPin.clientWidth,
    isDragged: false
  };

  var isDraggedStatus = function () {
    primaryPin.isDragged = !primaryPin.isDragged;
  }

  var getMainPinPosition = function () {
    var isPageActive = primaryPin.isActive;
    var leftPosition = Math.floor(mainPin.offsetLeft + primaryPin.width / 2);
    var topPosition = Math.floor(isPageActive ? mainPin.offsetTop + (primaryPin.activeHeight / 2) : mainPin.offsetTop + primaryPin.disabledHeight / 2);
    return {
      x: leftPosition,
      y: topPosition
    };
  };

  mainPin.addEventListener('click', function () {
    primaryPin.isActive = !primaryPin.isActive;
  });

  return {
    getMainPinPosition: getMainPinPosition,
    mainPinStatus: primaryPin.isActive,
    mainPin: mainPin
  }
}());


var map = (function (pins) {
  var mainMap = document.querySelector('.map');

  var changeMapStatus = function () {
    mainMap.classList.toggle('map--faded');
  };

  return {
    getMainPinPosition: pins.getMainPinPosition,
    changeMapStatus: changeMapStatus,
    mainPin: pins.mainPin,
    isDraggedStatus: pins.isDraggedStatus
  };
}(mapPins));


(function (pageForm, pageMap, usersAd) {
  var mainPin = pageMap.mainPin;
  var ads = usersAd;
  var nameInput = pageForm.nameInput;
  var priceInput = pageForm.priceInput;
  var appStatus = false;
  var houseType = pageForm.houseType;
  var timein = pageForm.visitTimes.timeIn;
  var timeout = pageForm.visitTimes.timeOut;
  var isDraggedStatus = pageMap.isDraggedStatus;

  var fillAddress = function () {
    var pinPosition = pageMap.getMainPinPosition();
    pageForm.fillAddress(pinPosition.x, pinPosition.y);
  };

  window.addEventListener('load', function () {
    fillAddress();
  });

  nameInput.input.addEventListener('input', function (evt) {
    nameInput.inputValid(evt.target.value.length);
  });

  priceInput.input.addEventListener('blur', function () {
    priceInput.checkInputValid();
  });

  priceInput.input.addEventListener('input', function (evt) {
    priceInput.checkInputValid(evt.target.value);
  });

  houseType.addEventListener('change', function (evt) {
    pageForm.changeHouseType(evt.target.value, priceInput);
  });

  timein.addEventListener('change', function () {
    pageForm.visitTimes.syncTime('in');
  })

  timeout.addEventListener('change', function () {
    pageForm.visitTimes.syncTime('out');
  })

  mainPin.addEventListener('mousedown', function () {
    //isDraggedStatus()
  })

  mainPin.addEventListener('mousemove', function (evt) {
    evt.preventDefault();
    //console.log(`${evt.pageX} и ${evt.pageY}`);
  })

  mainPin.addEventListener('click', function () {
    // меняет состояние карты
    pageMap.changeMapStatus();
    // меняем состояние форм
    pageForm.changeFormStatus();
    // меняем адрес
    fillAddress();
    // меняем состояние страницы
    appStatus = !appStatus;

    if (appStatus) {
      ads.renderAds();
    } else {
      ads.removeAds();
      priceInput.restoreDefaultSetting();
      nameInput.restoreDefaultSetting();
    }
  });
}(form, map, data));
