async function obtenerClima() {
    const lat = "-38.7196";
    const lon = "-62.2724";
    const apiKey = "335b7f14e11d96ac44fd43d0aacb76c1"; 
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`HTTP: ${respuesta.status}`);
        
        const datos = await respuesta.json();
        
        const temperatura = Math.round(datos.main.temp);
        const humedad = datos.main.humidity;
        const presion = datos.main.pressure;
        const vientoKmH = Math.round(datos.wind.speed * 3.6); 
        
        const iconoCodigo = datos.weather[0].icon;
        const iconoUrl = `https://openweathermap.org/img/wn/${iconoCodigo}.png`;
        const descripcionAlt = datos.weather[0].description;

        document.getElementById("clima-temp").textContent = `${temperatura}°C`;
        document.getElementById("clima-viento").textContent = `${vientoKmH} km/h`;
        document.getElementById("clima-humedad").textContent = `${humedad}%`;
        document.getElementById("clima-presion").textContent = `${presion} hPa`;
        document.getElementById("clima-icono").innerHTML = `<img src="${iconoUrl}" alt="${descripcionAlt}" title="${descripcionAlt}">`;
        
        document.getElementById("widget-clima").style.opacity = "1";

    } catch (error) {
        console.error("Error al cargar el clima:", error);
        document.getElementById("widget-clima").style.opacity = "0";
    }
}

document.addEventListener("DOMContentLoaded", obtenerClima);
