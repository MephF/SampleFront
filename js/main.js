$(document).ready(function() {
    const statusElement = document.getElementById('status');
    let currentSide = 'front';
    let frontImage, backImage;
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const mobileInput = document.getElementById('mobileInput');
    const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal'));
    const errorMessage = document.getElementById('errorMessage');

    captureBtn.addEventListener('click', async () => {
        if (isMobileDevice()) {
            mobileInput.click();
        } else {
            let permissionGranted = false;
            while (!permissionGranted) {
                permissionGranted = await requestCameraPermission();
                if (!permissionGranted) {
                    errorMessage.textContent = 'Por favor, permite el acceso a la cámara para continuar.';
                    errorMessage.style.display = 'block';
                    const userResponse = confirm('¿Quieres permitir el acceso a la cámara?');
                    if (!userResponse) {
                        errorMessage.textContent = 'No se puede continuar sin acceso a la cámara.';
                        return;
                    }
                }
            }
            currentSide = 'front';
            await startCamera();
            cameraModal.show();
            errorMessage.style.display = 'none';
        }
    });

    mobileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const image = e.target.result;
                if (currentSide === 'front') {
                    frontImage = image;
                    currentSide = 'back';
                    alert('Foto frontal capturada. Ahora capture el reverso del documento.');
                } else {
                    backImage = image;
                    saveImages();
                }
            };
            reader.readAsDataURL(file);
        }
    });

    $('#capturePhoto').click(() => {
        capturePhoto();
    });

    async function requestCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            return false;
        }
    }

    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: currentSide === 'front' ? 'user' : 'environment' } }
            });
            video.srcObject = stream;
        } catch (error) {
            errorMessage.textContent = 'No se pudo acceder a la cámara. Asegúrate de permitir el acceso.';
            errorMessage.style.display = 'block';
            console.error('Error al acceder a la cámara:', error);
        }
    }

    function capturePhoto() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const image = canvas.toDataURL('image/jpeg');
        if (currentSide === 'front') {
            frontImage = image;
            currentSide = 'back';
            alert('Foto frontal capturada. Ahora capture el reverso del documento.');
        } else {
            backImage = image;
            cameraModal.hide();
            saveImages();
        }
    }

    function saveImages() {
        if (frontImage && backImage) {
            localStorage.setItem('frontImage', frontImage);
            localStorage.setItem('backImage', backImage);
            sendImages();
        } else {
            alert('Asegúrese de capturar ambas imágenes antes de continuar.');
        }
    }

    function sendImages() {
        $.ajax({
            url: 'http://127.0.0.1:8000/api/uploadImage',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                image1: frontImage,
                image2: backImage
            }),
            success: function(result) {
                localStorage.setItem('result', JSON.stringify(result));
                window.location.href = 'form.html';
            },
            error: function(xhr, status, error) {
                console.error('Error en la respuesta del servidor:', xhr.status, xhr.statusText);
                alert('Error al enviar las imágenes. Por favor, inténtalo de nuevo.');
            }
        });
    }

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
});