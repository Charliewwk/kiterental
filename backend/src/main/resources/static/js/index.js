document.addEventListener('DOMContentLoaded', function () {

    var calendar;
    let turnos = obtenerTurnosDesdeAPI();
    configurarCalendario(turnos);
    cargarOpcionesCrearPacientes();
    cargarOpcionesCrearOdontologos();

    function configurarCalendario(turnos) {

        var calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
           customButtons: {
              crearTurnoButton: {
                text: '+ Turno',
                click: function() {
                  $('#modalCrearTurno').modal('show');

                }
              }
            },
            headerToolbar: {
                left: 'crearTurnoButton prev,today,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            themeSystem: 'bootstrap',
            initialView: 'timeGridWeek',
            timeZone: 'UTC',
            locale: 'es',
            eventTimeFormat: { // like '14:30:00'
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                meridiem: false
            },
            firstDay: 0,
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
            },
            editable: true,
            droppable: true,
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '09:00',
                endTime: '18:00'
            },
            scrollTime: '08:00',
            slotMinTime: '08:00:00',
            slotMaxTime: '19:00:00',
            slotDuration: '00:30:00',
            allDaySlot: false,
            nowIndicator: true,
            drop: function (info) {
                if (checkbox.checked) {
                    info.draggedEl.parentNode.removeChild(info.draggedEl);
                }
            },
            eventClick: function (info) {
                 abrirModalEditarTurno(info);
            },
            eventDrop: function (info) {
                const turnoId = info.event.id;
                const fechaHora = info.event.start.toISOString();
                const extendedProps = info.event.extendedProps;
                const motivo = extendedProps.motivo;
                const pacienteId = extendedProps.paciente_id;
                const odontologoId = extendedProps.odontologo_id;
                actualizarTurno(turnoId, fechaHora, motivo, pacienteId, odontologoId);
            },
            events: turnos
        });

        calendar.render();

    }

    function obtenerTurnosDesdeAPI() {

        return fetch('http://localhost:8092/api/turnos')
            .then(response => response.json())
            .then(data => {
                const turnos = data.data.map(turno => {
                    const start = turno.fechaHora;
                    const end = new Date(start);
                    end.setHours(end.getHours() - 3);
                    end.setMinutes(end.getMinutes() + 30);
                    const extendedProps = {
                        motivo: turno.motivo,
                        paciente_id: turno.paciente_id,
                        odontologo_id: turno.odontologo_id,
                    };
                    return {
                        id: turno.id,
                        title: extendedProps.motivo,
                        start: start,
                        end: end,
                        allDay: false,
                        backgroundColor: obtenerColorPorOdontologo(turno.odontologo_id),
                        borderColor: obtenerColorPorOdontologo(turno.odontologo_id),
                        extendedProps: extendedProps
                    };
                });

                configurarCalendario(turnos);

            })
            .catch(error => {
                console.error('Error al cargar eventos desde la API:', error);
            });

    }

    function obtenerColorPorOdontologo(odontologoId) {

        switch (odontologoId) {
            case 1:
                return '#00c0ef';
            case 2:
                return '#f39c12';
            case 3:
                return '#00a65a';
            default:
                return '';
        }

    }

    function abrirModalEditarTurno(info) {

        const turnoId = info.event.id;
        const fechaHoraISO = info.event.start.toISOString();
        const motivo = info.event.extendedProps.motivo;
        const fechaHora = fechaHoraISO.slice(0, 16);

        document.getElementById('turnoId').value = turnoId;
        document.getElementById('editarFechaHora').value = fechaHora;
        document.getElementById('editarMotivo').value = motivo;
        const pacienteId = info.event.extendedProps.paciente_id;
        const odontologoId = info.event.extendedProps.odontologo_id;

        cargarOpcionesEditarPacientes(pacienteId);
        cargarOpcionesEditarOdontologos(odontologoId);

        $('#modalEditarTurno').modal('show');

    }

    document.getElementById('guardarCrearTurno').addEventListener('reset', function () {
        calendar.refetchEvents();
    });

    document.getElementById('guardarCrearTurno').addEventListener('click', function () {

        const fechaHora = document.getElementById('fechaHora').value;
        const pacienteId = document.getElementById('crearPaciente').value;
        const odontologoId = document.getElementById('crearOdontologo').value;
        const motivo = document.getElementById('motivo').value;
        const nuevoTurno = {
            fechaHora: fechaHora,
            paciente_id: pacienteId,
            odontologo_id: odontologoId,
            motivo: motivo
        };
        fetch('http://localhost:8092/api/turnos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoTurno)
        })
        .then(response => {
            if (response.status === 201) {
                calendar.refetchEvents();
                $('#modalCrearTurno').modal('hide');
                alert('Turno creado exitosamente.');
                window.location.reload();
            } else {
                alert('Error al crear el turno.');
            }
        })
        .catch(error => {
            console.error('Error al guardar el turno:', error);
        });

    });

    document.getElementById('guardarEditarTurno').addEventListener('click', function () {

        const turnoId = document.getElementById('turnoId').value;
        const fechaHora = document.getElementById('editarFechaHora').value;
        const pacienteId = document.getElementById('editarPaciente').value;
        const odontologoId = document.getElementById('editarOdontologo').value;
        const motivo = document.getElementById('editarMotivo').value;
        actualizarTurno(turnoId, fechaHora, motivo, pacienteId, odontologoId);

    });

    document.getElementById('eliminarTurno').addEventListener('click', function () {

        const turnoId = document.getElementById('turnoId').value;
        eliminarTurno(turnoId);

    });

    function eliminarTurno(turnoId) {

        $('#confirmDeleteModal').modal('show');
        $('#confirmDeleteButton').click(function () {
            fetch(`http://localhost:8092/api/turnos/${turnoId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.status === 204) {
                    alert('Turno eliminado exitosamente.');
                    window.location.reload();
                } else {
                    alert('Error al eliminar el turno.');
                }
            })
            .catch(error => {
                console.error('Error al eliminar el turno:', error);
            });
        });

    }

    function actualizarTurno(turnoId, fechaHora, motivo, pacienteId, odontologoId) {

            const turnoActualizado = {
            fechaHora: fechaHora,
            motivo: motivo,
            paciente_id: pacienteId,
            odontologo_id: odontologoId
        };
        fetch(`http://localhost:8092/api/turnos/${turnoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(turnoActualizado)
        })
        .then(response => {
            if (response.status === 200) {
                alert('Turno actualizado exitosamente.');
                $('#modalEditarTurno').modal('hide');
                window.location.reload();
            } else {
                alert('Error al actualizar el turno.');
            }
        })
        .catch(error => {
            console.error('Error al actualizar el turno:', error);
        });

    }

    function cargarOpcionesCrearPacientes() {

        fetch('http://localhost:8092/api/pacientes')
            .then(response => response.json())
            .then(data => {
                const pacienteSelect = document.getElementById('crearPaciente');
                pacienteSelect.innerHTML = '';
                data.data.forEach(paciente => {
                    const option = document.createElement('option');
                    option.value = paciente.id;
                    option.textContent = `${paciente.nombre} ${paciente.apellido}`;
                    pacienteSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar opciones de pacientes:', error);
            });

    }


    function cargarOpcionesCrearOdontologos() {

        fetch('http://localhost:8092/api/odontologos')
            .then(response => response.json())
            .then(data => {
                const odontologoSelect = document.getElementById('crearOdontologo');
                odontologoSelect.innerHTML = '';

                data.data.forEach(odontologo => {
                    const option = document.createElement('option');
                    option.value = odontologo.id;
                    option.textContent = `${odontologo.nombre} ${odontologo.apellido}`;
                    odontologoSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar opciones de odontólogos:', error);
            });


    }

    function cargarOpcionesEditarPacientes(pacienteIdSeleccionado) {

        fetch('http://localhost:8092/api/pacientes')
            .then(response => response.json())
            .then(data => {
                const pacienteSelect = document.getElementById('editarPaciente');
                pacienteSelect.innerHTML = '';
                data.data.forEach(paciente => {
                    const option = document.createElement('option');
                    option.value = paciente.id;
                    option.textContent = `${paciente.nombre} ${paciente.apellido}`;
                    pacienteSelect.appendChild(option);
                });
                if (pacienteIdSeleccionado) {
                    pacienteSelect.value = pacienteIdSeleccionado;
                }
            })
            .catch(error => {
                console.error('Error al cargar opciones de pacientes:', error);
            });

    }

    function cargarOpcionesEditarOdontologos(odontologoIdSeleccionado) {

        fetch('http://localhost:8092/api/odontologos')
            .then(response => response.json())
            .then(data => {
                const odontologoSelect = document.getElementById('editarOdontologo');
                odontologoSelect.innerHTML = '';
                data.data.forEach(odontologo => {
                    const option = document.createElement('option');
                    option.value = odontologo.id;
                    option.textContent = `${odontologo.nombre} ${odontologo.apellido}`;
                    odontologoSelect.appendChild(option);
                });
                if (odontologoIdSeleccionado) {
                    odontologoSelect.value = odontologoIdSeleccionado;
                }
            })
            .catch(error => {
                console.error('Error al cargar opciones de odontólogos:', error);
            });

    }

    function obtenerHoraCortaDeISO(isoString) {
        const fecha = new Date(isoString);
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();

        // Formatear la hora y minutos en formato corto (HH:mm)
        const horaCorta = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

        return horaCorta;
    }

});