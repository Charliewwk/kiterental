document.addEventListener("DOMContentLoaded", function () {

    new DataTable('#tablaProductos', {
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: false,
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        stateSave: true,
        ajax: 'http://localhost:8080/api/v0/products',
        language: {
            info: 'Página _PAGE_ de _PAGES_',
            infoEmpty: 'Sin Productos para mostrar',
            infoFiltered: '(Filtro activado total _MAX_ registros)',
            lengthMenu: 'Mostrando _MENU_ productos por página',
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
            { data: 'name' },
            { data: 'description' },
            { data: 'category' },
            { data: 'price' },
        ],
        order: [[1, 'desc']]
    });

    actualizarCantidadProductos();

});

var editItemId = null;

function obtenerTotalRegistros() {

    return $.ajax({
        url: 'http://localhost:8080/api/v0/products',
        type: 'GET',
        dataType: 'json'
    });

}

function actualizarCantidadProductos() {
    obtenerTotalRegistros().done(function (data) {
        var totalRecords = data.totalRecords;
        var spanCantidadProductos = document.getElementById('CantidadProductos');
        if (spanCantidadProductos) {
            spanCantidadProductos.textContent = totalRecords;
        }
    }).fail(function (error) {
        console.error("Error al obtener el total de Productos: ", error);
    });
}


function limpiarEditStyle() {

    $('#createNombre').removeClass('is-invalid');
    $('#createDescripcion').removeClass('is-invalid');
    $('#createCategoria').removeClass('is-invalid');
    $('#createPrecio').removeClass('is-invalid');

}

function limpiarCreateStyle() {

    $('#createNombre').removeClass('is-invalid');
    $('#createDescripcion').removeClass('is-invalid');
    $('#createCategoria').removeClass('is-invalid');
    $('#createPrecio').removeClass('is-invalid');

}

function limpiarCreateModal() {

    $('#createNombre').val('');
    $('#createDescripcion').val('');
    $('#createCategoria').val('');
    $('#createPrecio').val('');

}

function limpiarEditModal() {

    $('#editNombre').val('');
    $('#editDescripcion').val('');
    $('#editCategoria').val('');
    $('#editPrecio').val('');
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

function confirmCreate() {
    var nombre = $('#createNombre').val();
    var descripcion = $('#createDescripcion').val();
    var categoria = $('#createCategoria').val();
    var precio = $('#createPrecio').val();

    var newProductoData = {
        "name": nombre,
        "description": descripcion,
        "category": categoria,
        "price": precio,
    };

    $.ajax({
        url: 'http://localhost:8080/api/v0/products',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newProductoData),
        success: function (response) {
            console.log("Nuevo Producto creado con éxito");
            $('#createModal').modal('hide');
            var miTabla = $('#tablaProductos').DataTable();
            actualizarCantidadProductos();
            miTabla.ajax.reload();
        },
        error: function (error) {
            if (error.responseJSON && error.responseJSON.message) {
                    var errorMessage = error.responseJSON.message;
                    $('#createNombre').addClass('is-invalid');
                    $('#createNombre-error').text(errorMessage);
            }
        }
    });
}


function deleteItem(idToDelete) {

    $('#confirmDeleteModal').modal('show');
    $('#confirmDeleteButton').click(function () {
        $.ajax({
            url: `http://localhost:8080/api/v0/products/${idToDelete}`,
            type: 'DELETE',
            success: function (data) {
                $('#confirmDeleteModal').modal('hide');
                var miTabla = $('#tablaProductos').DataTable();
                actualizarCantidadProductos();
                miTabla.ajax.reload();
            },
            error: function (error) {
                console.error("Error al eliminar el producto", error);
            }
        });
    });

}

function editItem(id) {

    editItemId = id;
    limpiarEditModal();
    limpiarEditStyle();

    $.ajax({
        url: `http://localhost:8080/api/v0/products/${id}`,
        type: 'GET',
        success: function (data) {
            var datosActualizados = {
                "name": data.name,
                "description": data.description,
                "category": data.category,
                "price": data.price,
            };

            $('#txtId').text(data.id);
            $('#editNombre').val(data.name);
            $('#editDescripcion').val(data.description);
            $('#editCategoria').val(data.category);
            $('#editPrecio').val(data.price);
            $('#editModal').modal('show');
        },
        error: function (error) {
            console.error("Error al obtener los datos del producto", error);
        }
    });
}

function confirmEdit() {

    if (editItemId !== null) {

        var name = $('#editNombre').val();
        var description = $('#editDescripcion').val();
        var category = $('#editCategoria').val();
        var price = $('#editCategoria').val();

        var editedData = {
            "name": name,
            "description": description,
            "category": category,
            "price": price
        };

        $.ajax({
            url: `http://localhost:8080/api/v0/products/${editItemId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(editedData),
            success: function (response) {
                console.log("Producto actualizado con éxito");
                $('#editModal').modal('hide');
                var miTabla = $('#tablaProductos').DataTable();
                miTabla.ajax.reload();
            },
            error: function (error) {
                if (error.responseJSON && error.responseJSON.message) {
                    var errorMessage = error.responseJSON.message;
                    if (errorMessage.includes("nombre")) {
                        $('#editNombre').addClass('is-invalid');
                        $('#editNombre-error').text(errorMessage);
                    }

                    if (errorMessage.includes("descripcion")) {
                        $('#editDescripcion').addClass('is-invalid');
                        $('#editDescripcion-error').text(errorMessage);
                    }

                }
                console.error("Error al actualizar el producto", error);
            }
        });
    }
}