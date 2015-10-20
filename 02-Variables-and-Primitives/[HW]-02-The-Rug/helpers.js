var helper = (function () {
    'use strict';

    function randomNumber(a, b) {
        return a + (b - a) * Math.random();
    }

    return {
        randomNumber: randomNumber
    }

}());