$(document).ready(function() {
    const statusElement = document.getElementById('status');
    let currentSide='front' ;
    let site='front';
    let frontImage, backImage;
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const mobileInput = document.getElementById('mobileInput');
    const errorMessage = document.getElementById('errorMessage');
    const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal'));
    const progressMobile= document.getElementById('progressMobile');

      if(/Mobi|Android/i.test(navigator.userAgent)){
progressMobile.textContent='0/2';
      }
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

    function reduceImageQuality(file, quality, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
    
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Redimensionar el canvas para igualar el tamaño de la imagen original
                canvas.width = img.width;
                canvas.height = img.height;
    
                // Dibujar la imagen en el canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Convertir la imagen a formato base64 con la calidad reducida
                const compressedImage = canvas.toDataURL('image/jpeg', quality); // quality entre 0 y 1
                
                callback(compressedImage);
            };
        };
        reader.readAsDataURL(file);
    }
    
    mobileInput.addEventListener('change', (event) => {
    
        const file = event.target.files[0];
        if (file) {
            // Validar si es un archivo de imagen
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen válido.');
                return;
            }
           
        
            reduceImageQuality(file, 0.7, (compressedImage) => {
                if (site === 'front') {
                    frontImage = compressedImage;
                    progressMobile.textContent='1/2';
                    site = 'back'; 
                    
                } else {
                    backImage = compressedImage;
                    progressMobile.textContent='2/2';
                    setTimeout(saveImages,300);
                   
                  
                }
            });
        } else {
            alert('No se seleccionó ningún archivo. Por favor, inténtalo de nuevo.');
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
                video: { facingMode: currentSide === 'front' ? 'user' : 'environment' }
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
        const progressElement = document.getElementById('progress'); 
        if(frontImage===null&&backImage===null){
            progressElement.textContent = '0/0';
        }

        if (site === 'front') {
            frontImage = image;
            site = 'back';
            
            progressElement.textContent = '1/2';
        } else {
            backImage = image;
            cameraModal.hide();

            progressElement.textContent = '2/2';
            saveImages(); 
        }
    }

    function saveImages() {
        if (frontImage && backImage) {
            localStorage.setItem('frontImage', frontImage);
            localStorage.setItem('backImage', backImage);
            sendImages();
            cameraModal.hide();  
        } else {
            alert('Asegúrese de capturar ambas imágenes antes de continuar.');
        }
    }
    

    function sendImages() {
        /*
        $.ajax({
            url: 'http://192.168.0.116:8000/api/uploadImage',
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
        */
        window.location.href = 'form.html';
    }

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
});