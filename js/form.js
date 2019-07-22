'use strict';

(function (createRequest, notify) {
  var TypeOfHousePrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var RoomCounts = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0],
    DEFAULT: [3, 2, 1, 0]
  };

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var GuestCounts = {
    3: 'для 3 гостей',
    2: 'для 2 гостей',
    1: 'для 1 гостя',
    0: 'не для гостей'
  };

  var prevSelectedOption = null;

  var DRAG_EVENTS = ['drop', 'dragenter', 'dragleave', 'dragover'];

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
  var main = document.querySelector('main');
  var description = document.querySelector('#description');
  var features = document.querySelector('.features');
  var avatarLoader = document.querySelector('#avatar');
  var imagesLoader = document.querySelector('#images');
  var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');
  var imagesDropZone = document.querySelector('.ad-form__drop-zone');
  var userAvatar = document.querySelector('.ad-form-header__preview > img');

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
      this.setDefault();
      return;
    }

    this.isValid = false;
    this.label.textContent = this.showErrorMessage(count);
    this.input.classList.add('invalid-value');


  };
  ReqNameInput.prototype.setDefault = function () {
    this.input.classList.remove('invalid-value');
    this.label.textContent = this.labelText;
  };

  ReqNameInput.prototype.restoreDefault = function () {
    this.input.classList.remove('invalid-value');
    this.label.textContent = this.labelText;
    this.input.value = '';
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
    var minError = 'Минимальная цена за ночь: ' + this.input.min;
    var maxError = 'Максим. цена за ночь: ' + this.input.max;
    if (parseInt(this.input.value, 10) < this.input.min) {
      return minError;
    }

    if (parseInt(this.input.value, 10) > this.input.max) {
      return maxError;
    }

    return this.labelText;
  };

  var headerInput = new ReqNameInput(nameInput, nameInputText);
  var pricePerNightInput = new ReqNumberInput(priceInput, priceInputText);

  /**
   * Функции OnSuccess и onError для отправки данных с формы
   */

  var onError = function () {
    main.appendChild(notify.renderErrorMessage());
  };

  var syncTime = function (firstElement, secondElement) {
    if (firstElement.value !== secondElement.value) {
      secondElement.value = firstElement.value;
    }
  };

  var fillAddress = function (pinPosition) {
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

    // если предыдущее выбранное значение = index, то делаем option выбранным.
    if (prevSelectedOption === index) {
      option.selected = true;
    }

    return option;
  };

  var changeGuestCapacity = function (rooms) {
    // получаем предыдущее выбранное значение и переводим в number
    prevSelectedOption = parseInt(capacity.options[capacity.selectedIndex].value, 10);

    capacity.length = 0;
    rooms.forEach(function (el) {
      capacity.add(createOption(el));
    });

  };

  var preventDefaultEvents = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  };

  // Удаление всех загруженных фотографий.
  var removeImages = function () {
    var gallery = document.querySelector('.ad-form__photo-container');
    var images = Array.prototype.slice.call(gallery.children);
    images.forEach(function (el) {
      if (el.className === 'ad-form__photo') {
        el.remove();
      }
    });
  };

  /**
   * Возвращает значения по умолчанию для полей формы.
   */
  var restoreDefaultForm = function () {
    var featuresItems = features.querySelectorAll('input');
    headerInput.restoreDefault();
    pricePerNightInput.restoreDefault();
    description.value = '';
    userAvatar.src = 'img/muffin-grey.svg';
    changeGuestCapacity(RoomCounts['DEFAULT']);
    timein.value = '12:00';
    syncTime(timein, timeout);

    removeImages();

    featuresItems.forEach(function (item) {
      item.checked = false;
    });
  };

  /**
   * Функция createLoadedImage создаёт карточку с загруженной фотографией жилища.
   * И вставляет в галлерею.
   * @param {object} file принимает fileReader файл с изобраджений
   */
  var createLoadedImage = function (file) {
    var gallery = document.querySelector('.ad-form__photo-container');
    var div = document.createElement('div');
    var image = document.createElement('img');
    div.className = 'ad-form__photo';
    image.src = file;
    image.alt = 'Изображение жилища';
    image.width = '40';
    image.height = '44';
    div.appendChild(image);
    gallery.insertAdjacentElement('beforeend', div);
  };


  // для всех событий drag & drop убираем стандартное действие браузера и прекращаем поднятие.
  // делаем это на элемента DropZone аватарки и изображений.

  DRAG_EVENTS.forEach(function (el) {
    avatarDropZone.addEventListener(el, preventDefaultEvents);
  });

  DRAG_EVENTS.forEach(function (el) {
    imagesDropZone.addEventListener(el, preventDefaultEvents);
  });

  // Callback функции для обработчиков
  /* ------------------------------------------------------------ */

  var onTimeinChange = function (evt) {
    syncTime(evt.target, timeout);
  };

  var onTimeoutChange = function (evt) {
    syncTime(evt.target, timein);
  };

  var onHeaderInput = function (evt) {
    headerInput.checkInputValid(evt.target.value.length);
  };

  var onPricePerNightInput = function () {
    pricePerNightInput.checkInputValid();
  };

  var onHouseTypeChange = function (evt) {
    changeHouseType(evt.target.value, pricePerNightInput);
  };

  var onRoomNumberChange = function (evt) {
    changeGuestCapacity(RoomCounts[evt.target.value]);
  };

  var formReset = function (callback) {

    return function (evt) {
      evt.preventDefault();
      restoreDefaultForm();
      changeFormStatus();
      callback();
    };
  };

  var formSubmit = function (callback) {
    var onSuccess = function () {
      main.appendChild(notify.renderSuccessMessage());
      restoreDefaultForm();
      changeFormStatus();
      callback();
    };

    return function (evt) {
      evt.preventDefault();
      var data = new FormData(evt.target);
      createRequest(evt.target.action, 'POST', onSuccess, onError, data);
    };
  };

  // Callback функции и вспомогательные функции для загрузки изображений.
  /* ------------------------------------------------------------ */
  var avatarLoad = function (file) {
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (el) {
      return fileName.endsWith(el);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        userAvatar.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var setupMultiplyReader = function (img) {
    var fileName = img.name.toLowerCase();
    var matches = FILE_TYPES.some(function (el) {
      return fileName.endsWith(el);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        createLoadedImage(reader.result);
      });

      reader.readAsDataURL(img);
    }
  };

  var onAvatarLoad = function (evt) {
    var file = evt.target.files[0];
    avatarLoad(file);
  };

  var onAvatarDrop = function (evt) {
    var dt = evt.dataTransfer;
    var files = dt.files;
    var file = files[0];
    avatarLoad(file);
  };

  var onImageLoad = function (evt) {
    var files = evt.target.files;

    for (var i = 0; i < files.length; i++) {
      setupMultiplyReader(files[i]);
    }
  };

  var onImageDrop = function (evt) {
    var dt = evt.dataTransfer;
    var files = dt.files;

    for (var i = 0; i < files.length; i++) {
      setupMultiplyReader(files[i]);
    }
  };

  var onToggleDropZone = function (evt) {
    evt.target.classList.toggle('dragenter');
  };

  /* ------------------------------------------------------------ */

  timein.addEventListener('change', onTimeinChange);

  timeout.addEventListener('change', onTimeoutChange);

  headerInput.input.addEventListener('input', onHeaderInput);

  pricePerNightInput.input.addEventListener('input', onPricePerNightInput);

  houseType.addEventListener('change', onHouseTypeChange);

  roomNumber.addEventListener('change', onRoomNumberChange);

  // Обработчики загрузки аватарки пользователя
  avatarLoader.addEventListener('change', onAvatarLoad);

  avatarDropZone.addEventListener('dragenter', onToggleDropZone);

  avatarDropZone.addEventListener('dragleave', onToggleDropZone);

  avatarDropZone.addEventListener('drop', onAvatarDrop);

  // Обработчики загрузки изображений жилища
  imagesLoader.addEventListener('change', onImageLoad);

  imagesDropZone.addEventListener('dragenter', onToggleDropZone);

  imagesDropZone.addEventListener('dragleave', onToggleDropZone);

  imagesDropZone.addEventListener('drop', onImageDrop);

  window.form = {
    fillAddress: fillAddress,
    changeFormStatus: changeFormStatus,
    headerInput: headerInput,
    pricePerNightInput: pricePerNightInput,
    formReset: formReset,
    formSubmit: formSubmit
  };
})(window.request, window.notify);

