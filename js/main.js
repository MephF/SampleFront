$(document).ready(function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    let currentSide = 'front'; // Identificar si se captura la parte frontal o trasera del documento
    let frontImage, backImage; // Variables para almacenar las imágenes en base64
    const video = document.getElementById('video'); // Video para capturar la imagen
    const canvas = document.getElementById('canvas'); // Canvas para procesar la imagen
    const captureBtn = document.getElementById('captureBtn'); // Botón para abrir la cámara
    const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal')); // Modal para la cámara
    const errorMessage = document.getElementById('errorMessage');
    // Al hacer clic en el botón de capturar la foto
    async function requestCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Detiene el stream de video después de verificar
            return true; // Si el permiso se concede
        } catch (error) {
            return false; // Si se niega el permiso
        }
    }

    // Al hacer clic en el botón de capturar la foto
    captureBtn.addEventListener('click', async () => {
        let permissionGranted = false;

        while (!permissionGranted) {
            permissionGranted = await requestCameraPermission(); // Verifica si se ha concedido permiso para la cámara

            if (!permissionGranted) {
                // Muestra un mensaje de advertencia y pregunta nuevamente
                errorMessage.textContent = 'Por favor, permite el acceso a la cámara para continuar.';
                errorMessage.style.display = 'block';

                const userResponse = confirm('¿Quieres permitir el acceso a la cámara?');

                if (!userResponse) {
                    errorMessage.textContent = 'No se puede continuar sin acceso a la cámara.';
                    return; // Sale si el usuario no desea permitir el acceso
                }
            }
        }

        // Si el permiso es concedido, inicia la cámara y muestra el modal
        currentSide = 'front'; // Comienza capturando el frente
        await startCamera(); // Inicia la cámara (asegúrate de esperar a que se inicie)
        cameraModal.show(); // Muestra el modal de la cámara
        errorMessage.style.display = 'none';
    });

    // Al hacer clic en "Capturar Foto"
    $('#capturePhoto').click(() => {
        capturePhoto();
    });
    // Inicia la cámara
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: currentSide === 'front' ? 'user' : 'environment' } }
            });
            video.srcObject = stream; // Asigna el stream de la cámara al video
        } catch (error) {
            errorMessage.textContent = 'No se pudo acceder a la cámara. Asegúrate de permitir el acceso.';
            errorMessage.style.display = 'block'; // Muestra el mensaje de error
            console.error('Error al acceder a la cámara:', error); // Error si la cámara no se puede iniciar
        }
    }

    // Captura la foto del video
    function capturePhoto() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0); // Dibuja el video en el canvas
        const image = canvas.toDataURL('image/jpeg'); // Captura la imagen en formato base64

        if (currentSide === 'front') {
            frontImage = image; // Almacena la imagen frontal
            currentSide = 'back'; // Cambia a la captura del reverso
            alert('Foto frontal capturada. Ahora capture el reverso del documento.');
        } else {
            backImage = image; // Almacena la imagen del reverso
            cameraModal.hide(); // Oculta el modal de la cámara
            saveImages(); // Llama a la función para guardar las imágenes
        }
    }

    // Función para guardar las imágenes
    function saveImages() {
        if (frontImage && backImage) {
            localStorage.setItem('frontImage', frontImage); // Almacena la imagen frontal con una clave
            localStorage.setItem('backImage', backImage);  // Almacena la imagen del reverso con una clave
            sendImages(); // Envía las imágenes al servidor
        } else {
            alert('Asegúrese de capturar ambas imágenes antes de continuar.');
        }
    }

    // Función para enviar las imágenes al servidor
    async function sendImages() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/uploadImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image1: frontImage, // Utiliza la imagen frontal
                    image2: backImage   // Utiliza la imagen trasera
                })
            });
            if (!response.ok) {
                console.error('Error en la respuesta del servidor:', response.status, response.statusText);
                alert('Error al enviar las imágenes. Por favor, inténtalo de nuevo.');
                return;
            }
    

            // Procesar la respuesta del servidor
            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            // Guardar la respuesta en el localStorage si es necesario
            localStorage.setItem('respuesta', JSON.stringify(result));

            // Redirigir a otra página si es necesario
            window.location.href = 'form.html';

        } catch (error) {
            console.error('Error al enviar las imágenes:', error);
        }
    }
}

});
