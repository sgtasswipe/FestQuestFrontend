// alerts.js
import Swal from 'https://cdn.skypack.dev/sweetalert2';

const alerts = {
    error: function(title, text, timer = 1000, showConfirmButton = false) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            timer: timer,
            showConfirmButton: showConfirmButton
        });
    },
    success: function(title, text, timer = 1000, showConfirmButton = false) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            timer: timer,
            showConfirmButton: showConfirmButton
        });
    },
    warning: function(title, text, timer = 1000, showConfirmButton = false) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            timer: timer,
            showConfirmButton: showConfirmButton
        });
    },
    info: function(title, text, timer = 1000, showConfirmButton = false) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'info',
            timer: timer,
            showConfirmButton: showConfirmButton
        });
    },

};

export default alerts;
