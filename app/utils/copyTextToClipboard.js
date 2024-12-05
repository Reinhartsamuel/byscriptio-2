import Swal from 'sweetalert2/dist/sweetalert2.js';
export async function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    });
  }
}
