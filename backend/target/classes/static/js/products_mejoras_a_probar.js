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
            { data: 'product_type' },
            { data: 'price' },
            { data: 'active' },
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

function limpiarStyles() {
    $('#createNombre, #createDescripcion, #createCategoria, #createTipo, #createPrecio, #createActivo, #editNombre, #editDescripcion, #editCategoria, #editTipo, #editPrecio, #editActivo').removeClass('is-invalid');
}

function limpiarModal(modalId) {
    $('#' + modalId + ' input[type=text], #' + modalId + ' input[type=number], #' + modalId + ' input[type=checkbox]').val('');
}

$('#editModal, #createModal').on('show.bs.modal', function (e) {
    limpiarStyles();
    limpiarModal(e.target.id);
});

$('#btnaddCreate').click(function () {
    $('#createModal').modal('show');
});

function confirmCreate() {
    var nombre = $('#createNombre').val();
    var descripcion = $('#createDescripcion').val();
    var categoria = $('#createCategoria').val();
    var tipo = $('#createTipo').val();
    var precio = $('#createPrecio').val();
    var activo = $('#createActivo').val();

    var newProductoData = {
        "name": nombre,
        "description": descripcion,
        "categoria": categoria,
        "tipo": tipo,
        "precio": precio,
        "activo": activo,
    };

    $.ajax({
        url: 'http://localhost:8080/api/v0/products',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newProductoData),
        success: function (response) {
            console.log("Nuevo Producto creado con éxito");
            $('#createModal').modal('hide');
            $('#tablaProductos').DataTable().ajax.reload();
            actualizarCantidadProductos();
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
                $('#tablaProductos').DataTable().ajax.reload();
                actualizarCantidadProductos();
            },
            error: function (error) {
                console.error("Error al eliminar el producto", error);
            }
        });
    });
}

function editItem(id) {
    editItemId = id;
    limpiarModal('editModal');
    limpiarStyles();
    $.ajax({
        url: `http://localhost:8080/api/v0/products/${id}`,
        type: 'GET',
        success: function (data) {
            $('#txtId').text(data.id);
            $('#editNombre').val(data.name);
            $('#editDescripcion').val(data.description);
            $('#editCategoria').val(data.category);
            $('#editTipo').val(data.type);
            $('#editPrecio').val(data.price);
            $('#editActivo').val(data.active);
            $('#editModal').modal('show');
        },
        error: function (error) {
            console.error("Error al obtener los datos del producto", error);
        }
    });
}

function confirmEdit() {
    if (editItemId !== null) {
        var editedData = {
            "name": $('#editNombre').val(),
            "description": $('#editDescripcion').val(),
            "category": $('#editCategoria').val(),
            "type": $('#editTipo').val(),
            "price": $('#editPrecio').val(),
            "active": $('#editActivo').val(),
        };
        $.ajax({
            url: `http://localhost:8080/api/v0/products/${editItemId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(editedData),
            success: function (response) {
                console.log("Producto actualizado con éxito");
                $('#editModal').modal('hide');
                $('#tablaProductos').DataTable().ajax.reload();
            },
            error: function (error) {
                if (error.responseJSON && error.responseJSON.message) {
                    var errorMessage = error.responseJSON.message;
                    $.each(editedData, function (key, value) {
                        if (errorMessage.includes(key)) {
                            $('#' + key).addClass('is-invalid');
                            $('#' + key + '-error').text(errorMessage);
                        }
                    });
                }
                console.error("Error al actualizar el producto", error);
            }
        });
    }
}
