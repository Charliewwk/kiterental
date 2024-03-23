document.addEventListener("DOMContentLoaded", function () {

    new DataTable('#tablaUsuario', {
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: false,
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        stateSave: true,
        ajax: 'http://localhost:8080/api/v0/users',
        language: {
            info: 'Página _PAGE_ de _PAGES_',
            infoEmpty: 'Sin Usuarios para mostrar',
            infoFiltered: '(Filtro activado total _MAX_ registros)',
            lengthMenu: 'Mostrando _MENU_ Usuarios por página',
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
            { data: 'email' },
            { data: 'role' }
        ],
        order: [[1, 'desc']]
    });

    actualizarCantidadUsuarios();

});

var editItemId = null;

function obtenerTotalRegistros() {

    return $.ajax({
        url: 'http://localhost:8080/api/v0/users',
        type: 'GET',
        dataType: 'json'
    });

}

function actualizarCantidadUsuarios() {
    obtenerTotalRegistros().done(function (data) {
        var totalRecords = data.totalRecords;
        var spanCantidadUsuarios = document.getElementById('cantidadUsuarios');
        if (spanCantidadUsuarios) {
            spanCantidadUsuarios.textContent = totalRecords;
        }
    }).fail(function (error) {
        console.error("Error al obtener el total de Usuarios: ", error);
    });
}

function limpiarEditStyle() {

    $('#editEmail').removeClass('is-invalid');
    $('#editRole').removeClass('is-invalid');

}

function limpiarCreateStyle() {

    $('#createEmail').removeClass('is-invalid');
    $('#createRole').removeClass('is-invalid');

}

function limpiarCreateModal() {

    $('#createEmail').val('');
    $('#createRole').val('');
}

function limpiarEditModal() {

    $('#editEmail').val('');
    $('#editRole').val('');
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

    var email = $('#createEmail').val();
    var role = $('#createRole').val();

    var newUserData = {
        "email": email,
        "role": role,
    };

    $.ajax({
        url: 'http://localhost:8080/api/v0/users',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newUserData),
        success: function (response) {
            console.log("Nuevo Usuario creado con éxito");
            $('#createModal').modal('hide');
            var miTabla = $('#tablaUsuarios').DataTable();
            actualizarCantidadUsuarios();
            miTabla.ajax.reload();
        },
        error: function (error) {
            if (error.responseJSON && error.responseJSON.message) {
                var errorMessage = error.responseJSON.message;
            }
            console.error("Error al crear el nuevo Usuario", error);
        }
    });
}

function deleteItem(idToDelete) {

    console.log(idToDelete);

    $('#confirmDeleteModal').modal('show');
    $('#confirmDeleteButton').click(function () {
        $.ajax({
            url: `http://localhost:8080/api/v0/users/${idToDelete}`,
            type: 'DELETE',
            success: function (data) {
                $('#confirmDeleteModal').modal('hide');
                var miTabla = $('#tablaUsuarios').DataTable();
                actualizarCantidadUsuarios();
                miTabla.ajax.reload();
            },
            error: function (error) {
                console.error("Error al eliminar el Usuario", error);
            }
        });
    });

}

function editItem(id) {

    editItemId = id;
    limpiarEditModal();
    limpiarEditStyle();

    $.ajax({
        url: `http://localhost:8080/api/v0/users/${id}`,
        type: 'GET',
        success: function (data) {
            var datosActualizados = {
                "email": data.email,
                "role": data.role,
            };

            $('#txtId').text(data.id);
            $('#editEmail').val(data.email);
            $('#editRole').val(data.role);
            $('#editModal').modal('show');
        },
        error: function (error) {
            console.error("Error al crear el nuevo Usuario", error);
        }
    });
}

function confirmEdit() {

    if (editItemId !== null) {

        var email = $('#editEmail').val();
        var role = $('#editRole').val();

        var editedData = {
            "email": email,
            "role": role
        };

        $.ajax({
            url: `http://localhost:8080/api/v0/users/${editItemId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(editedData),
            success: function (response) {
                console.log("Usuario actualizado con éxito");
                $('#editModal').modal('hide');
                var miTabla = $('#tablaUsuarios').DataTable();
                miTabla.ajax.reload();
            },
            error: function (error) {
                if (error.responseJSON && error.responseJSON.message) {
                    var errorMessage = error.responseJSON.message;
                }
                console.error("Error al actualizar el Usuario", error);
            }
        });
    }
}

