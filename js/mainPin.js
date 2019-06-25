'use strict';

(function () {

  function Pin(element) {
    this.pin = element;
    this.isActive = false;
    this.activeHeight = element.clientHeight + 22;
    this.disabledHeight = element.clientHeight;
    this.width = element.clientWidth;
    // StartPosition необходим, чтобы запомнить стартовые точки пина, для возвращения пина в начальную координату.
    // Position отслеживает текущее положение на карте
    this.startPosition = {
      x: null,
      y: null
    }
    this.position = {
      x: null,
      y: null
    };

    this.pin.addEventListener('click', this.onPinClick.bind(this));

    // задаём стартовую позицию пина и запоминаём её.
    this.calculatePotision();
    this.startPosition.x = this.position.x;
    this.startPosition.y = this.position.y;
  }

  Pin.prototype.calculatePotision = function () {
    this.position.x = Math.floor(this.pin.offsetLeft + this.width / 2);
    this.position.y = Math.floor(this.isActive ? this.pin.offsetTop + (this.activeHeight / 2) : this.pin.offsetTop + this.disabledHeight / 2);
  };

  Pin.prototype.getPosition = function () {
    return {
      x: this.position.x,
      y: this.position.y
    };
  };

  Pin.prototype.onMouseMove = function (newPositionX, newPositionY) {
    this.pin.style.left = newPositionX + 'px';
    this.pin.style.top = newPositionY + 'px';
    this.calculatePotision();
  };

  /**
   * Меням статус пина на активный и удаяем eventListener
   */
  Pin.prototype.onPinClick = function () {
    this.isActive = !this.isActive;
    this.pin.removeEventListener('click', this.onPinClick);
  };

  var mainPin = new Pin(document.querySelector('.map__pin--main'));
  console.log(mainPin);

  window.mainPin = mainPin;
})();
