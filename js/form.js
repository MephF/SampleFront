const valor1 = localStorage.getItem('frontImage');
const valor2 = localStorage.getItem('backImage');
const valor3 = localStorage.getItem('result');
console.log(valor1);
console.log(valor2);

$(document).ready(function() {
    const resultado = JSON.parse(localStorage.getItem('result'));
    if (resultado && resultado.data) {
        const data = resultado.data; // Acceder al objeto 'data'

        // Rellenar el formulario con los datos
        if (data.documentType) $('#documentType').val(data.documentType);
        if (data.documentNumber) $('#documentNumber').val(data.documentNumber);
        if (data.firstName) $('#firstName').val(data.firstName);
        if (data.secondName) $('#secondName').val(data.secondName);
        if (data.firstLastName) $('#firstLastName').val(data.firstLastName);
        if (data.secondLastName) $('#secondLastName').val(data.secondLastName);
        if (data.birthDay) $('#birthDay').val(data.birthDay);
        if (data.biologicalSex) $('#biologicalSex').val(data.biologicalSex);
        if (data.telephoneNumber) $('#telephoneNumber').val(data.telephoneNumber);
        if (data.address) $('#address').val(data.address);
        if (data.foreigner) $('#foreigner').val(data.foreigner);
        if (data.residenceCity) $('#residenceCity').val(data.residenceCity);
    } else {
        console.error("No se encontraron datos en localStorage");
    }

    // Funcionalidad del botón Guardar
    $('#saveBtn').click(function(event) {
        // Previene el envío del formulario
        event.preventDefault();
        
        // Limpia los mensajes de error anteriores
        clearErrors();

        let isValid = true;

        // Validar Tipo de Documento
        const documentType = $('#documentType').val();
        if (documentType === "") {
            showError('documentTypeError', 'Debe seleccionar un tipo de documento.');
            isValid = false;
        }

        // Validar Número de Documento (solo números y obligatorio)
        const documentNumber = $('#documentNumber').val();
        if (documentNumber === "" || !/^\d+$/.test(documentNumber)) {
            showError('documentNumberError', 'El número de documento es obligatorio y debe ser numérico.');
            isValid = false;
        }

        // Validar Primer Nombre (solo letras y obligatorio)
        const firstName = $('#firstName').val();
        if (firstName === "" || !/^[A-Za-z]+$/.test(firstName)) {
            showError('firstNameError', 'El primer nombre es obligatorio y debe contener solo letras.');
            isValid = false;
        }

        // Validar Segundo Nombre (solo letras y obligatorio)
        const secondName = $('#secondName').val();
        if (secondName === "" || !/^[A-Za-z]+$/.test(secondName)) {
            showError('secondNameError', 'El segundo nombre es obligatorio y debe contener solo letras.');
            isValid = false;
        }

        // Validar Fecha de Nacimiento (obligatorio)
        const birthDay = $('#birthDay').val();
        if (birthDay === "") {
            showError('birthDayError', 'Debe seleccionar una fecha de nacimiento válida.');
            isValid = false;
        }

        // Validar Sexo Biológico (obligatorio)
        const biologicalSex = $('#biologicalSex').val();
        if (biologicalSex === "") {
            showError('biologicalSexError', 'Debe seleccionar una opción.');
            isValid = false;
        }

        // Validar Teléfono (exactamente 7 dígitos)
        const telephoneNumber = $('#telephoneNumber').val();
        if (telephoneNumber === "" || !/^\d{7}$/.test(telephoneNumber)) {
            showError('telephoneNumberError', 'El teléfono debe contener exactamente 7 dígitos numéricos.');
            isValid = false;
        }

        // Validar Dirección (obligatorio)
        const address = $('#address').val();
        if (address === "") {
            showError('addressError', 'La dirección es obligatoria.');
            isValid = false;
        }

        // Validar Extranjero (obligatorio)
        const foreigner = $('#foreigner').val();
        if (foreigner === "") {
            showError('foreignerError', 'Debe seleccionar si es extranjero.');
            isValid = false;
        } else if (foreigner === "Sí") {
            // Validar País de Origen si es extranjero
            const country = $('#country').val();
            if (country === "") {
                showError('countryError', 'Debe ingresar el país de origen.');
                isValid = false;
            }
        }

        // Validar Ciudad de Residencia (obligatorio)
        const residenceCity = $('#residenceCity').val();
        if (residenceCity === "") {
            showError('residenceCityError', 'La ciudad de residencia es obligatoria.');
            isValid = false;
        }

        // Si todo es válido, proceder con el envío del formulario
        if (isValid) {
            $('input').prop('readonly', true);
            $(this).hide();
            $('#editBtn').show();
            // Aquí normalmente enviarías los datos actualizados al servidor
            alert('Cambios guardados');
            window.location.href = 'index.html';
        }
    });
});

// Función para limpiar los mensajes de error
function clearErrors() {
    const errorElements = $('small.text-danger');
    errorElements.each(function() {
        $(this).text('');
    });
}

// Función para mostrar los mensajes de error
function showError(id, message) {
    $('#' + id).text(message);
}

// Función para alternar el campo de país si es extranjero
function toggleCountryField() {
    const foreigner = $('#foreigner').val();
    const countryField = $('#countryField');
    if (foreigner === "Sí") {
        countryField.show();
    } else {
        countryField.hide();
        $('#country').val(''); // Limpiar valor del campo país
    }
}
