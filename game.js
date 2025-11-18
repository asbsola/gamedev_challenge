// --- Configuración del Canvas ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const SCALE = 2.5; 

// --- Constantes del Juego ---
const GRAVITY = 0.5;
const PLAYER_SPEED = 5;
const JUMP_FORCE = 12;

// Definimos el tamaño del mundo y la cámara
const worldWidth = canvas.width * 3;
let camera = {
    x: 0,
    y: 0
};

// Estado del juego
let gameState = 'intro';
let enterPressed = false;

// Variables para la animación de victoria
let particles = []; // Partículas de confeti
let victoryAnimationTimer = 0;

// --- Variables para las sandías ---
let watermelons = [];
let gameTimer = 0;
// ¡Tus cambios! (20 frames y 7.5% de spawn)
const watermelonStartTime = 20;
const watermelonSpawnRate = 0.075;
const watermelonSpeed = 8;

// --- Partículas de explosión de sandía ---
let watermelonParticles = [];


// --- Carga de Imágenes ---
const images = {};
let imagesLoaded = 0;
const totalImages = 10; 

function loadImage(name, src) {
    images[name] = new Image();
    images[name].src = 'assets/'+src;
    images[name].onload = () => {
        imagesLoaded++;
        
        if (imagesLoaded === totalImages) {
            console.log("Todas las imágenes cargadas, ¡empezando el juego!");
            gameLoop(); 
        }
    };
    images[name].onerror = () => {
        if (name === 'watermelon') {
            console.warn("No se encontró 'watermelon.png'. Usando fallback rojo.");
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                 console.log("Todas las imágenes (excepto sandía) cargadas, ¡empezando el juego!");
                gameLoop();
            }
        } else {
             console.error(`Error al cargar la imagen: ${src}`);
        }
    };
}

loadImage('vito', 'vito.png');
loadImage('pencilcase', 'pencilcase.png');
loadImage('phone', 'phone.png');
loadImage('kuromi', 'kuromi.png');
loadImage('paintbrush', 'paintbrush.png');
loadImage('pokemon_card', 'pokemon_card.png');
loadImage('miku', 'miku.png');
loadImage('background', 'background_grass.jpg');
loadImage('platform', 'platform.png');
loadImage('watermelon', 'watermelon.png');


// --- Objetos del Juego ---
let player = {
    x: 100,
    y: 460,
    width: 80, 
    height: 100,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    image: null 
};
const platforms = [
    { x: 0, y: 580, width: worldWidth, height: 20, color: 'green', image: null }, 
    { x: 200, y: 450, width: 150, height: 20, color: 'green', image: null }, 
    { x: 400, y: 320, width: 150, height: 20, color: 'green', image: null }, 
    { x: 250, y: 190, width: 100, height: 20, color: 'green', image: null }, 
    { x: 850, y: 440, width: 150, height: 20, color: 'green', image: null },
    { x: 1050, y: 300, width: 150, height: 20, color: 'green', image: null },
    { x: 1250, y: 440, width: 100, height: 20, color: 'green', image: null },
    { x: 1500, y: 500, width: 100, height: 20, color: 'green', image: null },
    { x: 1650, y: 360, width: 100, height: 20, color: 'green', image: null },
    { x: 1800, y: 500, width: 100, height: 20, color: 'green', image: null },
    { x: 1950, y: 420, width: 100, height: 20, color: 'green', image: null },
    { x: 2100, y: 340, width: 100, height: 20, color: 'green', image: null },
    { x: 2250, y: 260, width: 100, height: 20, color: 'green', image: null }
];
let items = [
    { name: "Pencilcase", x: 220, y: 400, width: 60, height: 50, image: null, collected: false, imgName: 'pencilcase' },
    { name: "Paintbrush", x: 280, y: 130, width: 60, height: 40, image: null, collected: false, imgName: 'paintbrush' },
    { name: "Phone", x: 1080, y: 250, width: 30, height: 50, image: null, collected: false, imgName: 'phone' },
    { name: "Kuromi plush", x: 1260, y: 510, width: 60, height: 60, image: null, collected: false, imgName: 'kuromi' },
    { name: "Pokemon card", x: 1660, y: 300, width: 70, height: 80, image: null, collected: false, imgName: 'pokemon_card' },
    { name: "Hatsune Miku", x: 2270, y: 180, width: 60, height: 80, image: null, collected: false, imgName: 'miku' }
];

let itemsCollected = 0;
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Enter: false
};

// --- Control de Teclado ---
window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});
window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});


// --- ¡CORREGIDO! (Esta es tu versión correcta) ---
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// --- Función para reiniciar el juego ---
function resetGame() {
    console.log("¡TOCADO! Reiniciando...");
    
    player.x = 100;
    player.y = 460;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
    
    itemsCollected = 0;
    for (let item of items) {
        item.collected = false;
    }
    
    watermelons = [];
    watermelonParticles = [];
    gameTimer = 0;
    
    camera.x = 0;
}

// --- Bucle Principal del Juego ---

function updateIntro() {
    if (keys.Enter) {
        if (!enterPressed) {
            gameState = 'playing';
            enterPressed = true;
            gameTimer = 0;
        }
    } else {
        enterPressed = false;
    }
}

function updateGame() {
    // 1. Mover al jugador
    if (keys.ArrowLeft) {
        player.velocityX = -PLAYER_SPEED;
    } else if (keys.ArrowRight) {
        player.velocityX = PLAYER_SPEED;
    } else {
        player.velocityX = 0;
    }

    if (keys.ArrowUp && !player.isJumping) {
        player.velocityY = -JUMP_FORCE;
        player.isJumping = true;
    }

    // 2. Aplicar física
    player.y += player.velocityY;
    player.x += player.velocityX;
    player.velocityY += GRAVITY;

    // Límites del MUNDO
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > worldWidth) {
        player.x = worldWidth - player.width;
    }

    // 3. Colisiones con plataformas
    let onPlatform = false;
    for (let platform of platforms) {
        if (player.velocityY >= 0 && checkCollision(player, platform)) {
            if (player.y + player.height - player.velocityY <= platform.y + 1) { 
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                onPlatform = true;
                break;
            }
        }
    }

    // 4. Colisiones con items
    for (let item of items) {
        if (!item.collected && checkCollision(player, item)) {
            item.collected = true;
            itemsCollected++;
        }
    }
    
    // --- Actualizar la Cámara ---
    camera.x = player.x - (canvas.width / 2) + (player.width / 2);
    
    if (camera.x < 0) {
        camera.x = 0;
    }
    if (camera.x + canvas.width > worldWidth) {
        camera.x = worldWidth - canvas.width;
    }
    
    // --- Lógica de Sandías ---
    gameTimer++;
    
    // Solo spawnea sandías si el juego NO se ha ganado
    if (itemsCollected < items.length && gameTimer > watermelonStartTime) {
        if (Math.random() < watermelonSpawnRate) {
            spawnWatermelon();
        }
    }
    
    updateWatermelons();
    updateWatermelonParticles(); 
    
    
    // --- Actualizar animación de victoria ---
    updateParticles();
    
    if (itemsCollected === items.length) {
        victoryAnimationTimer += 0.05;
        if (Math.random() < 0.25) { 
            spawnConfetti();
        }
    }
}

// --- ¡ACTUALIZADO! (Esta es la versión con la advertencia) ---
function drawIntro() {
    // 1. Dibujar el fondo
    if (images.background) {
        ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#d0e7ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Caja de texto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(50, 100, canvas.width - 100, canvas.height - 200);
    
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    // 3. Título
    ctx.font = 'bold 36px Arial';
    ctx.fillText('¡Oh no, Vito!', canvas.width / 2, 160);

    // 4. El Lore (historia)
    ctx.font = '20px Arial';
    
    const loreLines = [
        "Un viento mágico de cumpleaños entró por tu ventana...",
        "¡y esparció tus 6 objetos favoritos por el mundo!",
        "¡Ahora están perdidos!",
        "",
        "¡Pero cuidado! El viento también trajo...",
        "¡SANDÍAS!"
    ];

    let startY = 220;
    for (let line of loreLines) {
        // Reset styles for each line
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';

        if (line === "¡SANDÍAS!") {
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#FF6347'; // Un rojo/rosa
        }
        
        ctx.fillText(line, canvas.width / 2, startY);
        startY += 30; // Espacio entre líneas
    }

    // 5. Instrucción
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('¡Debes recuperarlos!', canvas.width / 2, 410);

    // 6. Prompt para empezar
    ctx.font = '22px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("Presiona 'Enter' para empezar", canvas.width / 2, 460);
}


function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-camera.x, 0);

    // DIBUJO DEL MUNDO
    if (images.background) {
        let bgTileWidth = images.background.width; 
        if (bgTileWidth <= 0) bgTileWidth = canvas.width; 
        let startX = Math.floor(camera.x / bgTileWidth) * bgTileWidth;
        let endX = camera.x + canvas.width;
        for (let x = startX; x < endX; x += bgTileWidth) {
            ctx.drawImage(images.background, x, 0, bgTileWidth, canvas.height);
        }
    } else {
        ctx.fillStyle = '#d0e7ff';
        ctx.fillRect(0, 0, worldWidth, canvas.height); 
    }

    if (images.platform) {
        for (let platform of platforms) {
            ctx.drawImage(images.platform, platform.x, platform.y, platform.width, platform.height);
        }
    } else {
        ctx.fillStyle = 'green';
        for (let platform of platforms) {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    }

    if (images.vito) {
        ctx.drawImage(images.vito, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    for (let item of items) {
        if (!item.collected) {
            if (images[item.imgName]) {
                ctx.drawImage(images[item.imgName], item.x, item.y, item.width, item.height);
            } else {
                ctx.fillStyle = 'gray'; 
                ctx.fillRect(item.x, item.y, item.width, item.height);
            }
        }
    }
    
    drawWatermelons();
    drawWatermelonParticles();
    
    ctx.restore();

    // DIBUJO DE LA UI
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left'; 
    ctx.fillText(`Objetos: ${itemsCollected} / ${items.length}`, 10, 30);

    drawParticles();

    if (itemsCollected === items.length) {
        let textYOffset = Math.sin(victoryAnimationTimer) * 10;
        let textY = (canvas.height / 2) + textYOffset;
        
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 7;
        ctx.fillStyle = '#FFD700';
        ctx.fillText('¡FELIZ CUMPLEAÑOS VICTORIA!', canvas.width / 2, textY);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeText('¡FELIZ CUMPLEAÑOS VICTORIA!', canvas.width / 2, textY);
        ctx.shadowBlur = 0;
    }
}

// --- Funciones del sistema de partículas (Confeti) ---
function spawnConfetti() {
    let colors = ['#FFD700', '#FF1493', '#00BFFF', '#32CD32', '#FFFFFF'];
    let newParticle = {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 200
    };
    particles.push(newParticle);
}
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0 || p.y > canvas.height) {
            particles.splice(i, 1);
        }
    }
}
function drawParticles() {
    for (let p of particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
}

// --- Funciones de Sandías ---

function spawnWatermelon() {
    let spawnX = Math.random() * worldWidth;
    
    if (Math.abs(spawnX - player.x) > canvas.width * 2) {
        return;
    }

    let watermelon = {
        x: spawnX,
        y: -50,
        width: 40,
        height: 40,
        velocityY: watermelonSpeed,
        velocityX: (Math.random() - 0.5) * 8,
        imgName: 'watermelon'
    };
    watermelons.push(watermelon);
}

function updateWatermelons() {
    for (let i = watermelons.length - 1; i >= 0; i--) {
        let melon = watermelons[i];
        
        melon.x += melon.velocityX;
        melon.y += melon.velocityY;
        
        // 1. Comprobar colisión con el jugador
        // Solo reinicia si el juego no se ha ganado
        if (itemsCollected < items.length && checkCollision(player, melon)) {
            resetGame();
            break; 
        }
        
        // 2. Comprobar colisión con plataformas
        let explodedOnPlatform = false;
        for (let platform of platforms) {
            if (melon.y + melon.height >= platform.y && melon.y < platform.y + platform.height &&
                melon.x + melon.width > platform.x && melon.x < platform.x + platform.width) {
                
                if (melon.velocityY > 0 && melon.y + melon.height - melon.velocityY <= platform.y) {
                     explodeWatermelon(melon.x + melon.width / 2, platform.y);
                     watermelons.splice(i, 1);
                     explodedOnPlatform = true;
                     break; 
                }
            }
        }
        if (explodedOnPlatform) continue;
        
        // 3. Eliminar si está fuera de la pantalla O si golpea el suelo
        if (melon.y > canvas.height - 20) {
            explodeWatermelon(melon.x + melon.width / 2, canvas.height - 20);
            watermelons.splice(i, 1);
        } else if (melon.x < -melon.width || melon.x > worldWidth) {
            watermelons.splice(i, 1);
        }
    }
}

// --- ¡CORREGIDO! (Esta es tu versión correcta) ---
function drawWatermelons() {
    for (let melon of watermelons) {
        if (images[melon.imgName]) {
            // Usa 'melon.y' (minúscula)
            ctx.drawImage(images[melon.imgName], melon.x, melon.y, melon.width, melon.height);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(melon.x, melon.y, melon.width, melon.height);
        }
    }
}

// --- Funciones de Partículas de Explosión de Sandía ---
function explodeWatermelon(x, y) {
    const numParticles = 10 + Math.floor(Math.random() * 10);
    const colors = ['#32CD32', '#90EE90', '#DC143C', '#FF6347', '#8B0000'];

    for (let i = 0; i < numParticles; i++) {
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 5 + 2;
        let size = Math.random() * 4 + 2;
        
        let newParticle = {
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (Math.random() * 2),
            size: size,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 30 + Math.random() * 30
        };
        watermelonParticles.push(newParticle);
    }
}

function updateWatermelonParticles() {
    for (let i = watermelonParticles.length - 1; i >= 0; i--) {
        let p = watermelonParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY * 0.5;
        p.life--;
        p.size *= 0.98;

        if (p.life <= 0 || p.size < 0.5) {
            watermelonParticles.splice(i, 1);
        }
    }
}

function drawWatermelonParticles() {
    for (let p of watermelonParticles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }
}


// --- Inicio del Bucle del Juego ---

function gameLoop() {
    if (imagesLoaded === totalImages) {
        
        if (gameState === 'intro') {
            updateIntro();
            drawIntro();
        } else if (gameState === 'playing') {
            updateGame();
            drawGame();
        }

    } else {
        // Pantalla de carga
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        ctx.fillText(`Cargando... ${imagesLoaded} / ${totalImages}`, canvas.width / 2, canvas.height / 2);
    }
    
    requestAnimationFrame(gameLoop);
}