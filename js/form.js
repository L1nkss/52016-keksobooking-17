'use strict';

(function () {
  var adFormStatus = document.querySelector('.ad-form');
  var addressInput = document.getElementById('address');
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
  var roomNumber = document.querySelector('#room_number');
  var TypeOfHousePrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

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

  var syncTime = function (firstElement, secondElement) {

    if (firstElement.value !== secondElement.value) {
      secondElement.value = firstElement.value;
    }
  };

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

  window.form = {
    fillAddress: fillAddress,
    changeFormStatus: changeFormStatus,
    nameInput: new ReqNameInput(nameInput, nameInputText),
    priceInput: new ReqNumberInput(priceInput, priceInputText),
    houseType: houseType,
    roomNumber: roomNumber,
    changeHouseType: changeHouseType,
    visitTimes: {
      timeIn: timein,
      timeOut: timeout,
      syncTime: syncTime
    }
  };
}());
