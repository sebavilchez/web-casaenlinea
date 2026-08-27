document.addEventListener("DOMContentLoaded", () => {
    const apiKey = '335b7f14e11d96ac44fd43d0aacb76c1';
    const cityId = '3865086'; // Bahía Blanca
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=es&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del clima');
            }
            return response.json();
        })
        .then(data => {
            const temp = Math.round(data.main.temp);
            const viento = Math.round(data.wind.speed * 3.6); // Convertir m/s a km/h
            const humedad = data.main.humidity;
            const presion = data.main.pressure;
            const iconoCode = data.weather[0].icon;

            // Inyectar los valores en el HTML
            document.getElementById('clima-temp').textContent = `${temp}°C`;
            document.getElementById('clima-viento').textContent = `${viento} km/h`;
            document.getElementById('clima-humedad').textContent = `${humedad}%`;
            document.getElementById('clima-presion').textContent = `${presion} hPa`;

            // Opcional: mostrar el icono oficial de OpenWeather si tenés el elemento preparado
            const iconoContainer = document.getElementById('clima-icono');
            if (iconoContainer) {
                iconoContainer.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconoCode}.png" alt="Clima" style="width: 30px; height: 30px; vertical-align: middle;">`;
            }
        })
        .catch(error => {
            console.error('No se pudo cargar el clima:', error);
        });
});
