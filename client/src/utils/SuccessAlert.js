import Swal from 'sweetalert2'

const successAlert = (title) => {
    const alert = Swal.fire({
        title: title,
        icon: "success",
        confirmButtonText: 'OK',
        confirmButtonColor: '#13bd24'
    });
    return alert
}

export default successAlert