document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const circle = document.getElementById('circle');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const finalScoreDisplay = document.getElementById('final-score-value');

    const startMusic = document.getElementById('start-music');
    const gameMusic = document.getElementById('game-music');
    const clickSound = document.getElementById('click-sound');
    const missSound = document.getElementById('miss-sound');
    const gameOverSound = document.getElementById('game-over-sound');
    const gameVideo = document.getElementById('game-video');
    const startVideo = document.getElementById('start-video');
    const gameOverVideo = document.getElementById('game-over-video');

    let score = 0;
    let timeLeft = 30;
    let circleSize = 150; // Tamaño inicial del círculo
    let circleSpeed = 1000;
    let gameInterval;
    let timerInterval;
    let isGamePlaying = false; // Variable para controlar si el juego está en curso
    let hasStarted = false; // Variable para controlar si la música de inicio ya se ha reproducido

    // Oculta el círculo inicialmente
    circle.classList.add('hidden');

    function moveCircle() {
        const maxWidth = gameScreen.clientWidth - circleSize;
        const maxHeight = gameScreen.clientHeight - circleSize;

        const randomX = Math.floor(Math.random() * maxWidth);
        const randomY = Math.floor(Math.random() * maxHeight);

        circle.style.left = `${randomX}px`;
        circle.style.top = `${randomY}px`;
        circle.classList.remove('hidden'); // Muestra el círculo cuando sea necesario
    }

    function moveCircleToCenter() {
        const gameScreenWidth = gameScreen.clientWidth;
        const gameScreenHeight = gameScreen.clientHeight;
        const centerX = (gameScreenWidth - circleSize) / 2;
        const centerY = (gameScreenHeight - circleSize) / 2;

        circle.style.left = `${centerX}px`;
        circle.style.top = `${centerY}px`;
        circle.classList.remove('hidden'); // Asegura que el círculo esté visible
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function startGame() {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        moveCircle();
        gameInterval = setInterval(moveCircle, circleSpeed);
        timerInterval = setInterval(updateTimer, 1000);

        // Detener la música de inicio
        if (!startMusic.paused) {
            startMusic.pause();
            startMusic.currentTime = 0;
        }

        // Reproducir la música del juego solo si no está ya en reproducción
        if (!isGamePlaying) {
            gameVideo.play().catch(error => {
                console.error('Error playing game video:', error);
            });
            gameMusic.loop = true; // Reproducir música del juego en loop
            gameMusic.play().catch(error => {
                console.error('Error playing game music:', error);
            });
            isGamePlaying = true;
        }
    }

    function updateTimer() {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        circle.classList.add('hidden'); // Oculta el círculo al terminar el juego

        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        finalScoreDisplay.textContent = score;

        // Detener la música del juego
        gameMusic.pause();
        gameMusic.currentTime = 0;
        isGamePlaying = false;

        gameOverSound.play().catch(error => {
            console.error('Error playing game over sound:', error);
        });
    }

    function resetGame() {
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        circleSize = 150; // Restablece el tamaño inicial del círculo
        circle.style.width = `${circleSize}px`;
        circle.style.height = `${circleSize}px`;

        gameOverScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden'); // Muestra la pantalla del juego directamente

        clearInterval(timerInterval); // Asegura que el temporizador anterior se detenga
        timerInterval = setInterval(updateTimer, 1000); // Reinicia el temporizador

        moveCircleToCenter(); // Mueve el círculo al centro de la pantalla al reiniciar

        // Reproducir el video y la música del juego solo si no está ya en reproducción
        if (!isGamePlaying) {
            gameVideo.play().catch(error => {
                console.error('Error playing game video:', error);
            });
            gameMusic.loop = true; // Asegura que la música del juego esté en loop
            gameMusic.play().catch(error => {
                console.error('Error playing game music:', error);
            });
            isGamePlaying = true;
        }
    }

    function createParticles() {
        const circleRect = circle.getBoundingClientRect();
        const circleCenterX = circleRect.left + circleRect.width / 2;
        const circleCenterY = circleRect.top + circleRect.height / 2;

        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 20 + 10; // Tamaño aumentado de las partículas
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${circleCenterX - size / 2}px`;
            particle.style.top = `${circleCenterY - size / 2}px`;
            particle.style.backgroundColor = getRandomColor();
            gameScreen.appendChild(particle);

            const distance = Math.random() * 200 + 100; // Distancia aumentada para partículas
            const angle = Math.random() * 2 * Math.PI;
            const xVelocity = Math.cos(angle) * distance;
            const yVelocity = Math.sin(angle) * distance;

            setTimeout(() => {
                particle.style.transform = `translate(${xVelocity}px, ${-yVelocity}px)`;
                particle.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                particle.remove();
            }, 1500); // Tiempo aumentado para eliminar las partículas
        }
    }

    circle.addEventListener('click', function() {
        score++;
        scoreDisplay.textContent = score;
        timeLeft += 5;
        moveCircle();
        circle.style.backgroundColor = getRandomColor();
        createParticles();
        clickSound.play().catch(error => {
            console.error('Error playing click sound:', error);
        });

        if (score % 5 === 0) {
            circleSpeed = Math.max(200, circleSpeed - 100);
            circleSize = Math.max(50, circleSize - 10);
            circle.style.width = `${circleSize}px`;
            circle.style.height = `${circleSize}px`;
            clearInterval(gameInterval);
            gameInterval = setInterval(moveCircle, circleSpeed);
        }
    });

    startButton.addEventListener('click', function() {
        startGame();
    });

    restartButton.addEventListener('click', function() {
        resetGame();
    });

    function handleMissedClick() {
        timeLeft -= 2;
        if (timeLeft < 0) timeLeft = 0;
        timeDisplay.textContent = timeLeft;
        missSound.play().catch(error => {
            console.error('Error playing miss sound:', error);
        });
    }

    gameScreen.addEventListener('click', function(event) {
        if (event.target !== circle) {
            handleMissedClick();
        }
    });

    startVideo.oncanplaythrough = () => startVideo.play().catch(error => {
        console.error('Error playing start video:', error);
    });
    gameOverVideo.oncanplaythrough = () => gameOverVideo.play().catch(error => {
        console.error('Error playing game over video:', error);
    });

    // Reproduce la música de inicio solo después de una interacción del usuario
    document.body.addEventListener('click', function() {
        if (!hasStarted) {
            startMusic.play().catch(error => {
                console.error('Error playing start music:', error);
            });
            hasStarted = true;
        }
    });

    // Manejo de toques en pantalla táctil
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            return; // Ignora eventos de múltiples toques
        }
        const touch = event.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;

        const rect = circle.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            circle.click(); // Simula el clic si se toca el círculo
        }
    });
});



