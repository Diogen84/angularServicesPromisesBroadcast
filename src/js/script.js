// ordinary script
function popupInit() {
    var btn = document.querySelectorAll('.btn');
    var popup = document.querySelectorAll('.popup');
    var shadow = document.querySelector('.shadow');
    var close = document.querySelectorAll('.popup .close');

    for(var i = 0 ; i < btn.length; i++) {
        btn[i].onclick = function(x) {
            return function() {
                for(var j = 0; j < popup.length; j++) {
                    if(popup[j].getAttribute('data-modal') === btn[x].getAttribute('data-modal-open')) {
                        shadow.className += ' active';
                        popup[j].className += ' active';
                    }
                }
                return false;
            }
        }(i);
    }
    for(var i = 0 ; i < close.length; i++) {
        close[i].onclick = function(x) {
            return function() {
                shadow.className = 'shadow';
                for(var j = 0; j < popup.length; j++) {
                    popup[j].className = 'popup';
                }
                return false;
            }
        }(i);
    }
}
popupInit();