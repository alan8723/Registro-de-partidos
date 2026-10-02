// Seleccionamos todas las tarjetas
const cards = document.querySelectorAll(".card");

// Variable para guardar si es liga o copa
let modo = "";

// Recorremos cada card
cards.forEach(card => {

    const texto = card.querySelector(".texto").textContent;

    card.addEventListener("click", () => {

        // guardamos el modo
        modo = texto.toLowerCase();
        console.log("Modo:", modo);

        // buscamos si ya hay un menú abierto
        const existingMenu = card.querySelector(".menu");

        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        // cerramos otros menus
        document.querySelectorAll(".menu").forEach(menu => {
            menu.remove();
        });

        // creamos el menu
        const menu = document.createElement("div");
        menu.classList.add("menu");

        menu.innerHTML = `
            <button class="opcion" data-equipos="4">4 equipos</button>
            <button class="opcion" data-equipos="8">8 equipos</button>
            <button class="opcion" data-equipos="16">16 equipos</button>
            <button class="opcion" data-equipos="32">32 equipos</button>
            <button class="opcion" data-equipos="custom">Personalizado</button>
        `;

        // agregamos el menu a la tarjeta
        card.appendChild(menu);

        // detectamos que opcion se toca
        menu.querySelectorAll(".opcion").forEach(btn => {

            btn.addEventListener("click", (e) => {

                const cantidad = e.target.dataset.equipos;

                console.log("Modo:", modo);
                console.log("Equipos:", cantidad);

                const contenedor = document.getElementById("configuracion");

                contenedor.innerHTML = `
                <button id="crearTorneo">Crear torneo</button>
                `;
                document.getElementById("crearTorneo").addEventListener("click", function(){

                document.querySelector(".cards").style.display = "none";

                crearJugadores(parseInt(cantidad));

            }); 
            });

        });

    });

});