function mostrarCampo() {
    const selectedField = document.getElementById('campo').value;

    // Ocultar todos los campos de entrada
    const campos = document.getElementsByClassName('campo-busqueda');
    for (let i = 0; i < campos.length; i++) {
        campos[i].style.display = 'none';
    }

    // Mostrar el campo de entrada seleccionado
    if (selectedField) {
        document.getElementById(selectedField).style.display = 'block';
    }
}

document.getElementById('busquedaForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Previene la recarga de la página
    document.getElementById('resultados').style.display = 'block';

    setTimeout(() => {
        document.getElementById('resultados').style.display = 'block';
    }, 500);

    const selectedField = document.getElementById('campo').value;
    const selectedValue = document.getElementById(selectedField + '-input').value;


    fetch('http://192.168.101.4:3000/asesoria_energetica')
        .then(response => response.json())
        .then(data => {
            const resultados = data.filter(item =>
                (selectedValue ? item[selectedField.toUpperCase()] === selectedValue : true)
            );

            const resultadosDiv = document.getElementById('resultados');
            resultadosDiv.innerHTML = ''; // Limpiar los resultados anteriores

            // Si no hay resultados, mostrar un mensaje de error
            if (resultados.length === 0) {
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('mensaje-error'); // Agregar una clase para darle estilo
                errorDiv.innerHTML = '<h3>¡Ups! No hemos encontrado nada.</h3><p>Por favor, verifica tu entrada o intenta con otro término de búsqueda.</p>';
                resultadosDiv.appendChild(errorDiv);
                return;
            }

            // Crear y añadir el título
            const titulo = document.createElement('h2');
            titulo.textContent = 'Resultados de Contacto';
            resultadosDiv.appendChild(titulo);

            resultados.forEach(resultado => {
                const resultadoDiv = document.createElement('div');
                resultadoDiv.classList.add('resultado'); // Agregar una clase para darle estilo

                // Crear un elemento para cada propiedad del objeto
                for (let propiedad in resultado) {
                    const propiedadDiv = document.createElement('div');
                    propiedadDiv.classList.add('propiedad'); // Agregar una clase para darle estilo
                    propiedadDiv.innerHTML = `<strong>${propiedad}</strong>: ${resultado[propiedad]}`;
                    resultadoDiv.appendChild(propiedadDiv);
                }

                resultadosDiv.appendChild(resultadoDiv);
            });
        })
        .catch(error => console.error('Error:', error));
});

var graficaVisible = false;
var myChart = null;

function obtenerComercializadoras(datos) {
    var comercializadoras = {};
    datos.forEach(function (dato) {
        var comercializadora = dato.COMERCIALIZADORA;
        if (comercializadora in comercializadoras) {
            comercializadoras[comercializadora]++;
        } else {
            comercializadoras[comercializadora] = 1;
        }
    });

    return comercializadoras;
}

document.getElementById('mostrarGrafica').addEventListener('click', function () {
    var graficaContainer = document.getElementById('graficaContainer');
    var grafica = document.getElementById('grafica');
    if (graficaVisible) {
        graficaContainer.style.display = 'none';
    } else {
        fetch('http://192.168.101.4:3000/asesoria_energetica')
            .then(response => response.json())
            .then(datos => {
                var contratos = obtenerComercializadoras(datos);
            
                var data = {
                    labels: Object.keys(contratos),
                    datasets: [
                        {
                            label: 'EVOLVE',
                            data: [contratos['EVOLVE']],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 3
                        },
                        {
                            label: 'GANA ENERGIA',
                            data: [contratos['GANA ENERGIA']],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 3
                        },
                        {
                            label: 'ALUZ',
                            data: [contratos['ALUZ']],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 3
                        },
                        {
                            label: 'OPCION ENERGIA',
                            data: [contratos['OPCION ENERGIA']],
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 3
                        },
                        {
                            label: 'ENDESA',
                            data: [contratos['ENDESA']],
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 3
                        },
                        {
                            label: 'ENDESA SX',
                            data: [contratos['ENDESA SX']],
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 3
                        },
                        {
                            label: 'ENDESA SILVIA',
                            data: [contratos['ENDESA SILVIA']],
                            backgroundColor: 'rgba(54, 235, 235, 0.2)',
                            borderColor: 'rgba(54, 235, 235, 1)',
                            borderWidth: 3
                        },
                        {
                            label: 'ENDESA SYMPLI',
                            data: [contratos['ENDESA SYMPLI']],
                            backgroundColor: 'rgba(255, 99, 206, 0.2)',
                            borderColor: 'rgba(255, 99, 206, 1)',
                            borderWidth: 3
                        }
                    ]
                };

                if (myChart !== null) {
                    myChart.destroy(); // Destruye la gráfica anterior
                }

                var ctx = grafica.getContext('2d');
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: data,
                    options: {
                        scales: {
                            x: {
                                display: false,
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                graficaContainer.style.display = 'block';
            })
            .catch(error => console.error('Error:', error));
    }
    graficaVisible = !graficaVisible;
});