$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const data = JSON.parse(decodeURIComponent(urlParams.get('data')));

    // Populate form fields
    $('#documentType').val(data.documentType);
    $('#documentNumber').val(data.documentNumber);
    $('#firstName').val(data.firstName);
    $('#secondName').val(data.secondName);
    $('#firstLastName').val(data.firstLastName);
    $('#secondLastName').val(data.SecondLastName);
    $('#birthDay').val(data.birthDay);
    $('#biologicalSex').val(data.biologicalSex);
    $('#telephoneNumber').val(data.telephoneNumber);
    $('#address').val(data.address);
    $('#foreigner').val(data.foreigner);
    $('#residenceCity').val(data.ResidenceCity);

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
        // Here you would typically send the updated data to the server
        alert('Cambios guardados');
    });

    // Print button functionality
    $('#printBtn').click(function() {
        window.print();
    });
});