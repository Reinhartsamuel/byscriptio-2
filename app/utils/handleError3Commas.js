/* eslint-disable no-unused-vars */
import Swal from 'sweetalert2/dist/sweetalert2.js';

export default function handleError3Commas(response) {
    if (!response.status) {
        // Extract error attributes
        const errorAttributes = response.error_attributes;
        let errorMessages = [];

        // Loop through error attributes to collect messages
        for (const [key, messages] of Object.entries(errorAttributes)) {
            messages.forEach(message => {
                errorMessages.push(message);
            });
        }

        // Display the error messages using SweetAlert2
        Swal.fire({
            title: 'Error!',
            text: errorMessages.join('\n'), // Join messages with a newline
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}