const valor1 = localStorage.getItem('frontImage');
const valor2 = localStorage.getItem('backImage');
const valor3 = localStorage.getItem('result');
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
        if (data.SecondLastName) $('#secondLastName').val(data.SecondLastName);
        if (data.birthDay) $('#birthDay').val(data.birthDay);
        if (data.biologicalSex) $('#biologicalSex').val(data.biologicalSex);
        if (data.telephoneNumber) $('#telephoneNumber').val(data.telephoneNumber);
        if (data.address) $('#address').val(data.address);
        if (data.foreigner) $('#foreigner').val(data.foreigner);
        if (data.ResidenceCity) $('#residenceCity').val(data.ResidenceCity);
    } else {
        console.error("No se encontraron datos en localStorage");
    }
   
    // Edit button functionality
    $('#editBtn').click(function() {
        $('input').prop('readonly', false);
        $(this).hide();
        $('#saveBtn').show();
    });

    // Save button functionality
    $('#saveBtn').click(function() {
        $('input').prop('readonly', true);
        $(this).hide();
        $('#editBtn').show();
        // Aquí normalmente enviarías los datos actualizados al servidor
        alert('Cambios guardados');
    });

    // Print button functionality
    $('#printBtn').click(function() {
        window.print();
    });
});
