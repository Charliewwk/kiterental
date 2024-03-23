document.addEventListener("DOMContentLoaded", function () {

    new DataTable('#tablaPacientes', {
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: false,
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        stateSave: true,
        ajax: 'http://localhost:8092/api/pacientes',
        language: {
            info: 'Página _PAGE_ de _PAGES_',
            infoEmpty: 'Sin Pacientes para mostrar',
            infoFiltered: '(Filtro activado total _MAX_ registros)',
            lengthMenu: 'Mostrando _MENU_ pacientes por página',
            zeroRecords: 'Lo siento, no se encontró información',
            search: 'Buscar',
            paginate: {
                "first": "Primero",
                "last": "Último",
                "next": "Próximo",
                "previous": "Anterior"
            }
        },
        columns: [
            { data: 'id' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <div class="btn-group">
                            <button id="btn_delete_${data.id}" onclick="deleteItem(${data.id});" type="button" class="btn btn-outline-danger btn_delete btn-xs">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button id="btn_edit_${data.id}" onclick="editItem(${data.id});" type="button" class="btn btn-outline-primary btn_user_edit btn-xs" style="margin-left: 1px;">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    `;
                }
            },
            { data: 'cedula' },
            { data: 'nombre' },
            { data: 'apellido' },
            {
                data: 'fechaIngreso',
                render: function (data, type, row) {
                    return formatearFecha(data);
                }
            },
            { data: 'email' },
            {
                data: null,
                render: function (data, type, row) {
                    return (data.direccionDTO.calleNumero + ' ' + data.direccionDTO.localidad + ' ' + data.direccionDTO.codigoPostal + ' ' + data.direccionDTO.provincia + ' ' + data.direccionDTO.pais);
                }
            }
        ],
        order: [[1, 'desc']],
        columnDefs: [
            {
                targets: 4,
                type: 'date-eu'
            }
        ]

    });

    actualizarCantidadPacientes();

});


var editItemId = null;
var editFechaIngreso = null;


function obtenerTotalRegistros() {

    return $.ajax({
        url: 'http://localhost:8092/api/pacientes',
        type: 'GET',
        dataType: 'json'
    });

}

function actualizarCantidadPacientes() {
    obtenerTotalRegistros().done(function (data) {
        var totalRecords = data.totalRecords;
        var spanCantidadPacientes = document.getElementById('cantidadPacientes');
        if (spanCantidadPacientes) {
            spanCantidadPacientes.textContent = totalRecords;
        }
    }).fail(function (error) {
        console.error("Error al obtener el total de pacientes: ", error);
    });
}

function formatearFecha(fechaISO) {

    const fechaHora = new Date(fechaISO);

    const día = fechaHora.getDate().toString().padStart(2, '0');
    const mes = (fechaHora.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaHora.getFullYear();
    let hora = fechaHora.getHours().toString().padStart(2, '0');
    const minutos = fechaHora.getMinutes().toString().padStart(2, '0');
    const segundos = fechaHora.getSeconds().toString().padStart(2, '0');

    let período = "AM";
    if (hora >= 12) {
        período = "PM";
        if (hora > 12) {
            hora = (hora - 12).toString().padStart(2, '0');
        }
    }

    const fechaHoraFormateada = `${día}/${mes}/${año} ${hora}:${minutos}:${segundos} ${período}`;

    return fechaHoraFormateada;
}

function limpiarEditStyle() {

    $('#editNombre').removeClass('is-invalid');
    $('#editApellido').removeClass('is-invalid');
    $('#editEmail').removeClass('is-invalid');
    $('#editCedula').removeClass('is-invalid');

}

function limpiarCreateStyle() {

    $('#createNombre').removeClass('is-invalid');
    $('#createApellido').removeClass('is-invalid');
    $('#createEmail').removeClass('is-invalid');
    $('#createCedula').removeClass('is-invalid');

}

function limpiarCreateModal() {

    $('#createNombre').val('');
    $('#createApellido').val('');
    $('#createCedula').val('');
    $('#createEmail').val('');
    $('#createCalleNumero').val('');
    $('#createCodigoPostal').val('');
    $('#createLocalidad').val('');
    $('#createProvincia').val('');
    $('#createPais').val('');
}

function limpiarEditModal() {

    $('#editNombre').val('');
    $('#editApellido').val('');
    $('#editCedula').val('');
    $('#editEmail').val('');
    $('#editCalleNumero').val('');
    $('#editCodigoPostal').val('');
    $('#editLocalidad').val('');
    $('#editProvincia').val('');
    $('#editPais').val('');
}

$('#editModal').on('show.bs.modal', function (e) {

    limpiarEditStyle();

});

$('#createModal').on('show.bs.modal', function (e) {

    limpiarCreateStyle();

});

$('#btnaddCreate').click(function () {

    limpiarCreateStyle();
    limpiarCreateModal();
    $('#createModal').modal('show');

});

$('#createModal').on('shown.bs.modal', function (e) {
});

$('#editModal').on('shown.bs.modal', function (e) {
});

function confirmCreate() {

    var nombre = $('#createNombre').val();
    var apellido = $('#createApellido').val();
    var cedula = $('#createCedula').val();
    var email = $('#createEmail').val();
    if (email.trim() === '') {
        email = null;
    }
    var fechaIngreso = new Date().toISOString();
    var calleNumero = $('#createCalleNumero').val();
    var codigoPostal = $('#createCodigoPostal').val();
    var localidad = $('#createLocalidad').val();
    var provincia = $('#createProvincia').val();
    var pais = $('#createPais').val();

    var newPatientData = {
        "nombre": nombre,
        "apellido": apellido,
        "cedula": cedula,
        "email": email,
        "fechaIngreso": fechaIngreso,
        "direccion": {
            "calleNumero": calleNumero,
            "codigoPostal": codigoPostal,
            "localidad": localidad,
            "provincia": provincia,
            "pais": pais
        }
    };

    $.ajax({
        url: 'http://localhost:8092/api/pacientes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newPatientData),
        success: function (response) {
            console.log("Nuevo paciente creado con éxito");
            $('#createModal').modal('hide');
            var miTabla = $('#tablaPacientes').DataTable();
            actualizarCantidadPacientes();
            miTabla.ajax.reload();
        },
        error: function (error) {
            if (error.responseJSON && error.responseJSON.message) {
                var errorMessage = error.responseJSON.message;
                if (errorMessage.includes("nombre")) {
                    $('#createNombre').addClass('is-invalid');
                    $('#createNombre-error').text(errorMessage);
                }

                if (errorMessage.includes("apellido")) {
                    $('#createApellido').addClass('is-invalid');
                    $('#createApellido-error').text(errorMessage);
                }

                if (errorMessage.includes("eMail")) {
                    $('#createEmail').addClass('is-invalid');
                    $('#createEmail-error').text(errorMessage);
                }

                if (errorMessage.includes("identificación")) {
                    $('#createCedula').addClass('is-invalid');
                    $('#createCedula-error').text(errorMessage);
                }
            }
            console.error("Error al crear el nuevo paciente", error);
        }
    });
}

function deleteItem(idToDelete) {

    console.log(idToDelete);

    $('#confirmDeleteModal').modal('show');
    $('#confirmDeleteButton').click(function () {
        $.ajax({
            url: `http://localhost:8092/api/pacientes/${idToDelete}`,
            type: 'DELETE',
            success: function (data) {
                $('#confirmDeleteModal').modal('hide');
                var miTabla = $('#tablaPacientes').DataTable();
                actualizarCantidadPacientes();
                miTabla.ajax.reload();
            },
            error: function (error) {
                console.error("Error al eliminar el paciente", error);
            }
        });
    });

}

function editItem(id) {

    editItemId = id;
    limpiarEditModal();
    limpiarEditStyle();

    $.ajax({
        url: `http://localhost:8092/api/pacientes/${id}`,
        type: 'GET',
        success: function (data) {
            var datosActualizados = {
                "nombre": data.nombre,
                "apellido": data.apellido,
                "cedula": data.cedula,
                "email": data.email,
                "fechaIngreso": data.fechaIngreso,
                "direccionDTO": {
                    "calleNumero": data.direccionDTO.calleNumero,
                    "codigoPostal": data.direccionDTO.codigoPostal,
                    "localidad": data.direccionDTO.localidad,
                    "provincia": data.direccionDTO.provincia,
                    "pais": data.direccionDTO.pais
                }
            };

            editFechaIngreso = data.fechaIngreso;
            $('#txtId').text(data.id);
            $('#editNombre').val(data.nombre);
            $('#editApellido').val(data.apellido);
            $('#editCedula').val(data.cedula);
            $('#editEmail').val(data.email);
            $('#txtFechaIngreso').text(formatearFecha(data.fechaIngreso));
            $('#editCalleNumero').val(data.direccionDTO.calleNumero);
            $('#editCodigoPostal').val(data.direccionDTO.codigoPostal);
            $('#editLocalidad').val(data.direccionDTO.localidad);
            $('#editProvincia').val(data.direccionDTO.provincia);
            $('#editPais').val(data.direccionDTO.pais);

            $('#editModal').modal('show');
        },
        error: function (error) {
            console.error("Error al crear el nuevo paciente", error);
        }
    });
}

function confirmEdit() {

    if (editItemId !== null) {

        var nombre = $('#editNombre').val();
        var apellido = $('#editApellido').val();
        var cedula = $('#editCedula').val();
        var email = $('#editEmail').val();
        var fechaIngreso = editFechaIngreso;
        var calleNumero = $('#editCalleNumero').val();
        var codigoPostal = $('#editCodigoPostal').val();
        var localidad = $('#editLocalidad').val();
        var provincia = $('#editProvincia').val();
        var pais = $('#editPais').val();

        var editedData = {
            "nombre": nombre,
            "apellido": apellido,
            "cedula": cedula,
            "email": email,
            "fechaIngreso": fechaIngreso,
            "direccion": {
                "calleNumero": calleNumero,
                "localidad": localidad,
                "codigoPostal": codigoPostal,
                "provincia": provincia,
                "pais": pais
            }
        };

        $.ajax({
            url: `http://localhost:8092/api/pacientes/${editItemId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(editedData),
            success: function (response) {
                console.log("Paciente actualizado con éxito");
                $('#editModal').modal('hide');
                var miTabla = $('#tablaPacientes').DataTable();
                miTabla.ajax.reload();
            },
            error: function (error) {
                if (error.responseJSON && error.responseJSON.message) {
                    var errorMessage = error.responseJSON.message;
                    if (errorMessage.includes("nombre")) {
                        $('#editNombre').addClass('is-invalid');
                        $('#editNombre-error').text(errorMessage);
                    }

                    if (errorMessage.includes("apellido")) {
                        $('#editApellido').addClass('is-invalid');
                        $('#editApellido-error').text(errorMessage);
                    }

                    if (errorMessage.includes("eMail")) {
                        $('#editEmail').addClass('is-invalid');
                        $('#editEmail-error').text(errorMessage);
                    }

                    if (errorMessage.includes("identificación")) {
                        $('#editCedula').addClass('is-invalid');
                        $('#editCedula-error').text(errorMessage);
                    }
                }

                console.error("Error al actualizar el paciente", error);
            }
        });
    }
}

