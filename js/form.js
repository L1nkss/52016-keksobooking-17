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
  var formStatus = false;

  var DRAG_EVENTS = ['drop', 'dragenter', 'dragleave', 'dragover'];

  var addressInput = document.querySelector('#address');
  var nameInput = document.querySelector('#title');
  var nameInputText = document.querySelector('.title-label');
  var priceInput = document.querySelector('#price');
  var priceInputText = document.querySelector('.price-label');
  var houseType = document.querySelector('#type');
  var main = document.querySelector('main');
  var avatarLoader = document.querySelector('#avatar');
  var imagesLoader = document.querySelector('#images');
  var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');
  var imagesDropZone = document.querySelector('.ad-form__drop-zone');
  var userAvatar = document.querySelector('.ad-form-header__preview > img');


  function Fieldsets() {
    this.houseType = document.querySelector('#type');
    this.description = document.querySelector('#description');
    this.userAvatar = document.querySelector('.ad-form-header__preview > img');
    this.timeIn = document.querySelector('#timein');
    this.timeOut = document.querySelector('#timeout');
    this.rooms = document.querySelector('#room_number');
    this.capacity = document.querySelector('#capacity');
    this.features = document.querySelector('.features');
    this.defaultValues = {
      houseType: this.houseType.value,
      description: this.description.value,
      userAvatar: this.userAvatar.getAttribute('src'),
      timeIn: this.timeIn.value,
      timeOut: this.timeOut.value,
    };
    this.defaultRooms = {
      roomCount: this.rooms.value,
      selectedRoom: this.getSelectedGuestsValue()
    };

    this.onTimeInChanges = this.onTimeInChanges.bind(this);
    this.onTimeOutChanges = this.onTimeOutChanges.bind(this);
    this.onRoomNumberChanges = this.onRoomNumberChanges.bind(this);

    this.timeIn.addEventListener('change', this.onTimeInChanges);
    this.timeOut.addEventListener('change', this.onTimeOutChanges);
    this.rooms.addEventListener('change', this.onRoomNumberChanges);
  }

  Fieldsets.prototype.getSelectedGuestsValue = function () {
    return parseInt(this.capacity.options[this.capacity.selectedIndex].value, 10);
  };

  Fieldsets.prototype.restoreDefaultFeatures = function () {
    var featuresChecked = this.features.querySelectorAll('input:checked');

    featuresChecked.forEach(function (feature) {
      feature.checked = false;
    });
  };

  Fieldsets.prototype.restoreDefaultRooms = function () {
    this.rooms.value = this.defaultRooms.roomCount;
    prevSelectedOption = this.defaultRooms.selected;
    this.changeGuestCapacity(RoomCounts['DEFAULT']);
  };

  Fieldsets.prototype.restoreDefaultValues = function () {
    var self = this;
    // получаем ключи из объекта defaultValue и перебираем их в цикле
    Object.keys(this.defaultValues).forEach(function (key) {
      // у соответсвующего элемента фильтрации устанавливаем значение по умолчанию.
      self[key].value = self.defaultValues[key];
    });
  };

  Fieldsets.prototype.restoreDefaultSetting = function () {
    this.restoreDefaultValues();

    this.restoreDefaultFeatures();

    this.restoreDefaultRooms();
  };

  Fieldsets.prototype.syncTimes = function (firstElement, secondElement) {
    if (firstElement.value !== secondElement.value) {
      secondElement.value = firstElement.value;
    }
  };

  Fieldsets.prototype.onTimeInChanges = function (evt) {
    this.syncTimes(evt.target, this.timeOut);
  };

  Fieldsets.prototype.onTimeOutChanges = function (evt) {
    this.syncTimes(evt.target, this.timeIn);
  };

  Fieldsets.prototype.changeGuestCapacity = function (rooms) {
    var self = this;
    this.capacity.length = 0;

    rooms.forEach(function (room) {
      self.capacity.add(createOption(room));
    });
  };

  Fieldsets.prototype.onRoomNumberChanges = function (evt) {
    prevSelectedOption = this.getSelectedGuestsValue();
    this.changeGuestCapacity(RoomCounts[evt.target.value]);
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

  function Form() {
    this.form = document.querySelector('.ad-form');
    this.mapFilters = document.querySelectorAll('.map__filter');
    this.formFieldsets = this.form.querySelectorAll('fieldset');
    this.mapFeatures = document.querySelector('.map__features');
  }

  Form.prototype.activateForm = function () {
    this.form.classList.remove('ad-form--disabled');
    this.form.classList.remove('disabled-events');

    // меняем состояние селекторов у фильтров
    this.mapFilters.forEach(function (el) {
      el.disabled = false;
    });

    // меняем состояние fieldset'ов у основной формы.
    this.formFieldsets.forEach(function (fieldset) {
      fieldset.disabled = false;
    });

    // меняем состояние у доп. функций в фильтре
    this.mapFeatures.disabled = false;
  };

  Form.prototype.disactivateForm = function () {
    this.form.classList.add('ad-form--disabled');
    this.form.classList.add('disabled-events');

    // меняем состояние селекторов у фильтров
    this.mapFilters.forEach(function (el) {
      el.disabled = true;
    });

    // меняем состояние fieldset'ов у основной формы.
    this.formFieldsets.forEach(function (fieldset) {
      fieldset.disabled = true;
    });

    // меняем состояние у доп. функций в фильтре
    this.mapFeatures.disabled = true;
  };


  var headerInput = new ReqNameInput(nameInput, nameInputText);
  var pricePerNightInput = new ReqNumberInput(priceInput, priceInputText);
  var formFields = new Fieldsets();
  var pageForm = new Form();

  var fillAddress = function (pinPosition) {
    addressInput.value = pinPosition.x + ', ' + pinPosition.y;
  };

  var changeFormStatus = function () {

    if (formStatus) {
      pageForm.disactivateForm();
      restoreDefaultForm();
      formStatus = false;
      return;
    }

    formFields.changeGuestCapacity(RoomCounts[formFields.rooms.value]);
    pageForm.activateForm();
    formStatus = true;

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
    // возвращаем значение по умолчанию у 'Заголовок объявления'
    headerInput.restoreDefault();

    // возвращаем значение по умолчанию у 'Цена за ночь'
    pricePerNightInput.restoreDefault();

    // возвращаем у всех fieldset'ов значение по умолчанию
    formFields.restoreDefaultSetting();

    // удаляем изображения
    removeImages();
  };

  /* ---------------------------------------------------------------------------------    */

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

  var onHeaderInput = function (evt) {
    headerInput.checkInputValid(evt.target.value.length);
  };

  var onPricePerNightInput = function () {
    pricePerNightInput.checkInputValid();
  };

  var onHouseTypeChange = function (evt) {
    changeHouseType(evt.target.value, pricePerNightInput);
  };

  /*                      Функции FormReset и FormSumbit                   */
  // onError - вспомогательная функция для функций formReset и FormSumbit
  var onError = function () {
    main.appendChild(notify.renderErrorMessage());
  };

  var formReset = function (callback) {

    return function (evt) {
      evt.preventDefault();
      // restoreDefaultForm();
      changeFormStatus();
      callback();
    };
  };

  var formSubmit = function (callback) {
    var onSuccess = function () {
      main.appendChild(notify.renderSuccessMessage());
      // restoreDefaultForm();
      changeFormStatus();
      callback();
    };

    return function (evt) {
      evt.preventDefault();
      var data = new FormData(evt.target);
      createRequest(evt.target.action, 'POST', onSuccess, onError, data);
    };
  };

  /* --------------------------------------------------------------------- */

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

  headerInput.input.addEventListener('input', onHeaderInput);

  pricePerNightInput.input.addEventListener('input', onPricePerNightInput);

  houseType.addEventListener('change', onHouseTypeChange);

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

