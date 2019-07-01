'use strict';

(function () {
  var HouseTypes = {
    BUNGALO: 'Бунгало',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.popup');
  var errorDataTemplate = document.querySelector('#data-error').content.querySelector('.message-block');


  /**
   * Функция getPrevCardElement возвращает другую функцию(замыкается).
   * Функция сохраняет текущую карточку, которая открыта на страница (подробная информация)
   * Если при удалении карточки, если при удалении карточки переменная prevCard существует, то удаляем этот элемент со страница
   * В противном случае, добавляем новую карточку, которая только открылась
   */

  var getPrevCardElement = function () {
    var prevCard = '';

    return function (card) {
      if (prevCard) {
        prevCard.remove();
        prevCard = '';
        return;
      }

      prevCard = card;
    };
  };

  // передаём сюда функцию.
  var changePrevCard = getPrevCardElement();


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

  /**
   *
   * @param {DOM element} element шаблон ошибки или успеха
   * В функции мы создаём обработчики событий, которые могут возникнуть у шаблонов
   * В каждом обработчике мы удаляем обработчик у document
   * Если у шаблона есть button, то мы добавляем и ему обработчик, в противном случае пропускаем создание.
   * В каждом обработчике удаляем событие для document
   */

  var closePopup = function (element) {
    var button = element.querySelector('button');
    var onDocumentClick = function () {
      element.remove();
      removeListeners();
    };

    var onEscPress = function (evt) {
      var ESC_CODE = 27;
      if (evt.keyCode === ESC_CODE) {
        element.remove();
        removeListeners();
      }
    };

    var removeListeners = function () {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onEscPress);
    };
    if (button) {
      var onButtonClick = function (evt) {
        evt.stopPropagation();
        element.remove();
        removeListeners();
      };

      button.addEventListener('click', onButtonClick);
    }
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onEscPress);
  };

  /**
   *
   * @param {string} code Код ошибки, который возник при запросе
   * @param {string} errorText Сообщение, которое будет написано
   * Функция renderErrorData выводит кастомное сообщение об ошибки при проблемах с запросом на сервер.
  */

  var renderErrorData = function (code, errorText) {
    var element = errorDataTemplate.cloneNode(true);
    element.textContent += code + '. ' + errorText;

    return element;
  };

  // карточка ошибки
  var renderErrorMessage = function () {
    var element = errorTemplate.cloneNode(true);
    closePopup(element);

    return element;
  };

  // карточка успешной отправки
  var renderSuccessMessage = function () {
    var element = successTemplate.cloneNode(true);
    closePopup(element);

    return element;
  };

  // карточка с подробной информацией
  var renderPinInformation = function (ad) {
    // Если есть открытая карточка, то удаляем её
    changePrevCard();
    var element = cardTemplate.cloneNode(true);
    var imageGallery = element.querySelector('.popup__photos');
    var features = element.querySelector('.popup__features');
    var price = ad.offer.price;
    var guestsRooms = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    var priceText = price + ' ₽/ночь';
    var time = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    var textContent = [
      {query: '.popup__avatar', value: ad.author.avatar},
      {query: '.popup__title', value: ad.offer.title},
      {query: '.popup__text--address', value: ad.offer.address},
      {query: '.popup__type', value: HouseTypes[ad.offer.type.toUpperCase()]},
      {query: '.popup__text--time', value: time},
      {query: '.popup__text--capacity', value: guestsRooms},
      {query: '.popup__description', value: ad.offer.description},
      {query: '.popup__text--price', value: priceText}
    ];

    textContent.forEach(function (el) {
      element.querySelector(el.query).textContent = el.value;
    });

    ad.offer.photos.forEach(function (image) {
      imageGallery.appendChild(renderImage(image));
    });

    ad.offer.features.forEach(function (feature) {
      features.appendChild(renderFeaturesList(feature));
    });

    // записываем в prevCard ново созданный элемент
    changePrevCard(element);

    var onKeyDown = function (evt) {
      var ESC_KEYCODE = 27;
      if (evt.keyCode === ESC_KEYCODE) {
        changePrevCard();
        document.removeEventListener('keydown', onKeyDown);
      }
    };

    element.querySelector('.popup__close').addEventListener('click', changePrevCard);
    document.addEventListener('keydown', onKeyDown);

    return element;
  };

  // создание пинов на карте
  var renderPin = function (ad) {
    var element = adTemplate.cloneNode(true);
    element.style = 'left: ' + ad.validCoords.left + 'px; top: ' + ad.validCoords.top + 'px;';
    element.querySelector('img').src = ad.avatar;
    element.querySelector('img').alt = ad.type;

    return element;
  };

  window.card = {
    renderErrorMessage: renderErrorMessage,
    renderPin: renderPin,
    renderPinInformation: renderPinInformation,
    renderErrorData: renderErrorData,
    renderSuccessMessage: renderSuccessMessage,
    changePrevCard: changePrevCard
  };
})();
