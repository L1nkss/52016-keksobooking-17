'use strict';

(function () {

  function Pin(element) {
    this.pin = element;
    this.isActive = false;
    this.activeHeight = element.clientHeight + 22;
    this.disabledHeight = element.clientHeight;
    this.width = element.clientWidth;
    this.position = {
      x: null,
      y: null
    };
  }

  Pin.prototype.setPosition = function () {
    this.position.x = Math.floor(this.pin.offsetLeft + this.width / 2);
    this.position.y = Math.floor(this.isActive ? this.pin.offsetTop + (this.activeHeight / 2) : this.pin.offsetTop + this.disabledHeight / 2);
  };

  Pin.prototype.getPosition = function () {
    return {
      x: this.position.x,
      y: this.position.y
    };
  };

  var mainPin = new Pin(document.querySelector('.map__pin--main'));
  mainPin.setPosition();

  mainPin.pin.addEventListener('click', function () {
    mainPin.isActive = !mainPin.isActive;
  });

  window.mainPin = mainPin;
}());
