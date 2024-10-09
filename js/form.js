const valor1 = localStorage.getItem('frontImage');
const valor2 = localStorage.getItem('backImage');
const valor3 = localStorage.getItem('result');
console.log(valor1,"front")
console.log(valor2,"back")
console.log(valor3,"result")
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
        const data = JSON.parse(decodeURIComponent(dataParam));

        // Populate form fields safely by checking if each field exists
        if (data.documentType) $('#documentType').val(data.documentType);
        if (data.documentNumber) $('#documentNumber').val(data.documentNumber);
        if (data.firstName) $('#firstName').val(data.firstName);
        if (data.secondName) $('#secondName').val(data.secondName);
        if (data.firstLastName) $('#firstLastName').val(data.firstLastName);
        if (data.secondLastName) $('#secondLastName').val(data.secondLastName); // Corrige el typo (antes 'SecondLastName')
        if (data.birthDay) $('#birthDay').val(data.birthDay);
        if (data.biologicalSex) $('#biologicalSex').val(data.biologicalSex);
        if (data.telephoneNumber) $('#telephoneNumber').val(data.telephoneNumber);
        if (data.address) $('#address').val(data.address);
        if (data.foreigner) $('#foreigner').val(data.foreigner);
        if (data.residenceCity) $('#residenceCity').val(data.residenceCity); // Corrige el typo (antes 'ResidenceCity')
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
