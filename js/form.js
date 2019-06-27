'use strict';

(function (mainPin) {
  var TypeOfHousePrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };
  var adFormStatus = document.querySelector('.ad-form');
  var addressInput = document.querySelector('#address');
  var mapFilter = document.querySelectorAll('.map__filter');
  var adForm = document.querySelectorAll('.ad-form__element');
  var mapFeatures = document.querySelector('.map__features');
  var nameInput = document.querySelector('#title');
  var nameInputText = document.querySelector('.title-label');
  var priceInput = document.querySelector('#price');
  var priceInputText = document.querySelector('.price-label');
  var houseType = document.querySelector('#type');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var RoomCounts = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };
  var GuestCounts = {
    3: 'для 3 гостей',
    2: 'для 2 гостей',
    1: 'для 1 гостя',
    0: 'не для гостей'
  };

  function ReqNameInput(element, text) {
    this.input = element;
    this.isValid = false;
    this.label = text;
    this.labelText = text.textContent;
  }

  function ReqNumberInput(element, text) {
    ReqNameInput.call(this, element, text);
  }

  // наследуем ReqNumberInput от ReqNameInput
  ReqNumberInput.prototype = Object.create(ReqNameInput.prototype);
  ReqNumberInput.prototype.constructor = ReqNumberInput;

  // Цепочка прототипов
  ReqNameInput.prototype.checkInputValid = function (count) {
    if (this.input.checkValidity()) {
      this.isValid = true;
      this.restoreDefaultSetting();
      return;
    }

    this.isValid = false;
    this.label.textContent = this.showErrorMessage(count);
    this.input.classList.add('invalid-value');


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

  ReqNumberInput.prototype.setMinValue = function (value) {
    this.input.min = value;
    this.input.placeholder = value;
  };

  ReqNumberInput.prototype.showErrorMessage = function () {
    return 'Минимальная цена за ночь: ' + this.input.min;
  };

  var headerInput = new ReqNameInput(nameInput, nameInputText);
  var pricePerNightInput = new ReqNumberInput(priceInput, priceInputText);

  var syncTime = function (firstElement, secondElement) {
    if (firstElement.value !== secondElement.value) {
      secondElement.value = firstElement.value;
    }
  };

  var fillAddress = function () {
    var pinPosition = mainPin.getPosition();
    addressInput.value = pinPosition.x + ', ' + pinPosition.y;
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

  var createOption = function (index) {
    var option = document.createElement('option');
    option.text = GuestCounts[index];
    option.value = index;

    return option;
  };

  var changeGuestCapacity = function (rooms) {
    capacity.length = 0;
    rooms.forEach(function (el) {
      capacity.add(createOption(el));
    });
  };

  timein.addEventListener('change', function (evt) {
    syncTime(evt.target, timeout);
  });

  timeout.addEventListener('change', function (evt) {
    syncTime(evt.target, timein);
  });

  headerInput.input.addEventListener('input', function (evt) {
    headerInput.checkInputValid(evt.target.value.length);
  });

  pricePerNightInput.input.addEventListener('input', function () {
    pricePerNightInput.checkInputValid();
  });

  houseType.addEventListener('change', function (evt) {
    changeHouseType(evt.target.value, pricePerNightInput);
  });

  roomNumber.addEventListener('change', function (evt) {
    changeGuestCapacity(RoomCounts[evt.target.value]);
  });

  adFormStatus.addEventListener('submit', function (evt) {
    evt.preventDefault();
  });

  window.form = {
    fillAddress: fillAddress,
    changeFormStatus: changeFormStatus,
    headerInput: headerInput,
    pricePerNightInput: pricePerNightInput
  };
})(window.mainPin);

