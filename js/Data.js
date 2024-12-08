function collectData() {
    const cantidadOvejas = parseInt(
        document.getElementById("range1").value,
        10
    );
    const cantidadLobos = parseInt(document.getElementById("range2").value, 10);
    const tasaReproduccionOvejas = parseFloat(
        document.getElementById("range4").value
    );
    const tasaReproduccionLobos = parseFloat(
        document.getElementById("range5").value
    );
    const tasaMortalidadLobos = parseFloat(
        document.getElementById("range6").value
    );
    const tasaDepredacionLobos = parseFloat(
        document.getElementById("range7").value
    );

    const data = {
        cantidadOvejas,
        cantidadLobos,
        tasaReproduccionOvejas,
        tasaReproduccionLobos,
        tasaMortalidadLobos,
        tasaDepredacionLobos,
    };

    // Mostrar los datos en la consola
    console.log("Cantidad de Ovejas:", cantidadOvejas);
    console.log("Cantidad de Lobos:", cantidadLobos);
    console.log(
        "% Tasa de reproducción Ovejas (alpha):",
        tasaReproduccionOvejas
    );
    console.log("% Tasa de reproducción Lobos (delta):", tasaReproduccionLobos);
    console.log("% Tasa de mortalidad de Lobos (gamma):", tasaMortalidadLobos);
    console.log("% Tasa de depredación Lobos (beta):", tasaDepredacionLobos);

    // Guardar en localStorage
    localStorage.setItem("formData", JSON.stringify(data));

    // Redirigir a la página tres
    window.location.href = "/paginastres.html";
}
