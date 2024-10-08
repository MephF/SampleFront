$(document).ready(function() {
    let currentSide = 'front';
    let frontImage, backImage;
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal'));

    captureBtn.addEventListener('click', function() {
        currentSide = 'front';
        startCamera();
        cameraModal.show();
    });

    $('#capturePhoto').click(function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        let image = canvas.toDataURL('image/jpeg');

        if (currentSide === 'front') {
            frontImage = image;
            currentSide = 'back';
            alert('Foto frontal capturada. Ahora capture el reverso del documento.');
        } else {
            backImage = image;
            sendImages();
        }
    });

    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
            });
    }

    function sendImages() {
        let imageData = {
            frontImage: frontImage,
            backImage: backImage
        };

        $.ajax({
            url: 'URL_DEL_ENDPOINT',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(imageData),
            success: function(response) {
                cameraModal.hide();
                window.location.href = 'form.html?data=' + encodeURIComponent(JSON.stringify(response.data));
            },
            error: function(error) {
                console.error('Error sending images:', error);
                alert('Hubo un error al enviar las imágenes. Por favor, intente de nuevo.');
            }
        });
    }
});