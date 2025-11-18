# 🎮 The 2-Hour Gamedev Challenge: Vito's Adventure

![Game Status](https://img.shields.io/badge/Status-Completed-success)
![Tech](https://img.shields.io/badge/Tech-Vanilla%20JS%20%7C%20HTML5%20Canvas-yellow)
![Vibe](https://img.shields.io/badge/Vibe-High-purple)

Un desafío personal de desarrollo: **"Vibe-codear" un juego de plataformas completo en aproximadamente 2 horas.**

Este proyecto fue construido desde cero usando Vanilla JavaScript (sin motores de juegos) como un regalo de cumpleaños para mi hermana, Victoria (a.k.a. Vito).

## 🎯 El Desafío (The Challenge)

El objetivo era simple: ir de una carpeta vacía a un juego jugable en una sola sesión, fluyendo con el código y generando los assets sobre la marcha.

* **Tiempo:** ~2 Horas.
* **Stack:** HTML, CSS, JS (Canvas API).
* **Herramientas:** Editor de código + Asistente de IA para generación de sprites y lógica de físicas.
* **Restricción:** Sin librerías externas (Phaser, Unity, etc.). Solo código nativo.

## 📖 La Historia (Lore)

Un viento mágico de cumpleaños entró por la ventana y esparció los 6 objetos favoritos de Vito por el mundo. Tu misión es recuperarlos todos.

Pero cuidado... el viento también trajo **SANDÍAS GIGANTES** que caen del cielo. 🍉💥

### Objetivos:
1.  Recuperar la **Cartuchera**.
2.  Encontrar el **Celular**.
3.  Rescatar al **Peluche de Kuromi**.
4.  Hallar el **Pincel**.
5.  Recuperar la **Carta de Umbreon**.
6.  Encontrar a **Hatsune Miku**.

## 🕹️ Cómo Jugar (Controls)

El juego corre directamente en el navegador.

1.  **Clona el repositorio** (o descarga el ZIP).
2.  Abre el archivo `index.html` en tu navegador favorito (Chrome, Firefox, Edge).
3.  Presiona **ENTER** en la pantalla de título.

| Tecla | Acción |
| :--- | :--- |
| **⬅️ Flecha Izq** | Mover a la izquierda |
| **➡️ Flecha Der** | Mover a la derecha |
| **⬆️ Flecha Arriba** | Saltar |
| **ENTER** | Iniciar / Reiniciar |

> **Tip Pro:** Las plataformas te protegen de la lluvia de sandías. Si una sandía golpea una plataforma, explotará en partículas y no te hará daño. ¡Usa los techos estratégicamente!

## 🛠️ Características Técnicas

A pesar del corto tiempo de desarrollo, el motor del juego incluye:

* **Física 2D Personalizada:** Gravedad, velocidad y detección de colisiones AABB (Axis-Aligned Bounding Box).
* **Sistema de Cámara (Side-scrolling):** La vista sigue al jugador a través de un mundo más grande que el canvas.
* **Sistemas de Partículas:**
    * 🎉 Confeti al ganar.
    * 🍉 Explosiones dinámicas al chocar las sandías.
* **Game Loop Optimizado:** Uso de `requestAnimationFrame` para un renderizado fluido.
* **Gestión de Estados:** Intro, Gameplay y Win-state.
* **Pixel Art Assets:** Sprites generados y renderizado con `image-rendering: pixelated` para mantener el estilo retro.

## 📂 Estructura del Proyecto

```text
/
├── index.html      # Estructura del Canvas
├── style.css       # Estilos y renderizado pixel-perfect
├── game.js         # Lógica del juego, física y renderizado
└── assets/         # (Imágenes .png de los sprites)
```

## 🚀 Instalación Local

```Bash

git clone [https://github.com/tu-usuario/gamedev_challenge.git](https://github.com/tu-usuario/gamedev_challenge.git)
cd gamedev_challenge
```
Simplemente abre index.html en tu navegador (Chrome/Firefox/Edge)

## 🎂 Dedicatoria
Hecho con ❤️ para Victoria Barthelemy.
¡Feliz Cumpleaños! 🥳

Vibe-codeado por Augusto Barthelemy.
