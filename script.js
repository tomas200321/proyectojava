const abrirCajaBtn = document.getElementById('abrirCajaBtn'); 
const carruselContainer = document.getElementById('carrusel-container');
const resultadoDiv = document.getElementById('resultado');
const tiendaDiv = document.getElementById('skins-tienda');
const listaCarrito = document.getElementById('lista-carrito');
const totalSpan = document.getElementById('total');
const comprarBtn = document.getElementById('comprarBtn');
const inventarioDiv = document.getElementById('contenedor-inventario');

let skins = [];
let carrito = [];
let inventario = [];

async function cargarSkins() {
  try {
    const response = await fetch('skins.json');
    if (!response.ok) throw new Error('Error al cargar skins.json');
    skins = await response.json();
    mostrarTienda();
  } catch (error) {
    resultadoDiv.textContent = 'Error cargando skins: ' + error.message;
  }
}

function mensajeRareza(rareza) {
  switch (rareza) {
    case "común": return "Es una skin común. Nada mal.";
    case "raro": return "¡Una skin rara! Bien ahí.";
    case "épico": return "¡Épico! Esta skin es bastante valiosa.";
    case "legendario": return "¡Legendaria! Una joya del arsenal.";
    default: return "Rareza desconocida.";
  }
}

function abrirCaja() {
  if (!skins.length || abrirCajaBtn.disabled) return;

  abrirCajaBtn.disabled = true;
  resultadoDiv.textContent = "";
  carruselContainer.innerHTML = "";

  const strip = document.createElement('div');
  strip.className = 'strip';

  const tirada = [];
  for (let i = 0; i < 50; i++) {
    const skin = skins[Math.floor(Math.random() * skins.length)];
    tirada.push(skin);

    const item = document.createElement('div');
    item.className = `item ${skin.rareza}`;
    item.innerHTML = `<img src="${skin.img}" alt="${skin.nombre}" /><span>${skin.nombre}</span>`;
    strip.appendChild(item);
  }

  carruselContainer.appendChild(strip);

  const ganadorIndex = 30 + Math.floor(Math.random() * 10);
  const desplazamiento = -(ganadorIndex * 130 - (carruselContainer.clientWidth / 2 - 130 / 2));
  strip.style.left = '0px';

  setTimeout(() => {
    strip.style.transition = 'left 3s cubic-bezier(0.4, 0, 0.2, 1)';
    strip.style.left = `${desplazamiento}px`;
  }, 100);

  setTimeout(() => {
    const skinGanadora = tirada[ganadorIndex];
    const claseRareza = `rareza-${skinGanadora.rareza}`;
    // Agregar al inventario
    inventario.push(skinGanadora);
    actualizarInventario();
    console.log("🎯 Skin obtenida:", skinGanadora);
    console.log("🔎 Detalle del inventario:");
    inventario.forEach((skin, i) => {
      console.log(`#${i + 1}: ${skin.nombre} (${skin.rareza})`);
    });

    resultadoDiv.innerHTML = `
      <p><strong class="${claseRareza}">¡Obtuviste:</strong> ${skinGanadora.nombre}</p>
      <p class="${claseRareza}">${mensajeRareza(skinGanadora.rareza)}</p>
      <img src="${skinGanadora.img}" alt="${skinGanadora.nombre}" />
    `;
    abrirCajaBtn.disabled = false;
  }, 3200);
}

function actualizarInventario() {
  inventarioDiv.innerHTML = '';

  if (inventario.length === 0) {
    inventarioDiv.innerHTML = '<p>No tienes skins aún.</p>';
    return;
  }

  inventario.forEach((skin) => {
    const skinDiv = document.createElement('div');
    skinDiv.className = 'skin-inventario';
    skinDiv.innerHTML = `
      <img src="${skin.img}" alt="${skin.nombre}" />
      <p>${skin.nombre}</p>
    `;
    inventarioDiv.appendChild(skinDiv);
  });
}

// ---- TIENDA ----

function mostrarTienda() {
  tiendaDiv.innerHTML = '';
  skins.forEach((skin, index) => {
    const card = document.createElement('div');
    card.className = `skin-card ${skin.rareza}`;
    card.innerHTML = `
      <img src="${skin.img}" alt="${skin.nombre}" />
      <h3>${skin.nombre}</h3>
      <p>${skin.precio} monedas</p>
      <button onclick="agregarAlCarrito(${index})">Agregar al carrito</button>
    `;
    tiendaDiv.appendChild(card);
  });
  mostrarTiendaConsola();
}

window.agregarAlCarrito = function(index) {
  carrito.push(skins[index]);
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;
  carrito.forEach((skin, idx) => {
    const li = document.createElement('li');
    li.textContent = `${skin.nombre} - ${skin.precio} monedas`;
    listaCarrito.appendChild(li);
    total += skin.precio;
  });
  totalSpan.textContent = total;
  mostrarCarritoConsola();
}

comprarBtn.addEventListener('click', () => {
  if (carrito.length === 0) return alert('Tu carrito está vacío');
  
  // Agregar skins del carrito al inventario
  inventario = inventario.concat(carrito);
  
  alert('¡Gracias por tu compra! Tus skins han sido añadidas al inventario.');
  
  carrito = [];
  actualizarCarrito();
  actualizarInventario();
});


// FUNCIONES CONSOLA

function mostrarTiendaConsola() {
  console.log("🛒 Tienda de Skins:");
  skins.forEach((skin, i) => {
    console.log(`#${i + 1}: ${skin.nombre} - Precio: ${skin.precio} monedas - Rareza: ${skin.rareza}`);
  });
}

function mostrarCarritoConsola() {
  if (carrito.length === 0) {
    console.log("🛒 El carrito está vacío.");
    return;
  }
  console.log("🛒 Carrito de Compra:");
  carrito.forEach((skin, i) => {
    console.log(`#${i + 1}: ${skin.nombre} - Precio: ${skin.precio} monedas`);
  });
  const total = carrito.reduce((acc, skin) => acc + skin.precio, 0);
  console.log(`Total: ${total} monedas`);
}

// Inicializar
abrirCajaBtn.addEventListener('click', abrirCaja);
window.addEventListener('DOMContentLoaded', async () => {
  await cargarSkins();
  resultadoDiv.textContent = '¡Presiona "Abrir Caja" para comenzar!';
});




