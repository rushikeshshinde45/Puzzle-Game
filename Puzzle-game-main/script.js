const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileCount = 4;
const tileSize = canvas.width / tileCount;

let tiles = [];

// Initialize the game
function init() {
    // Create pairs of random numbers
    const pairs = Array.from({ length: tileCount * tileCount / 2 }, (_, index) => index + 1);
    const numbers = [...pairs, ...pairs];
    // Shuffle the numbers
    numbers.sort(() => Math.random() - 0.5);

    // Create tiles with randomized numbers
    for (let i = 0; i < tileCount; i++) {
        for (let j = 0; j < tileCount; j++) {
            const tile = {
                x: j * tileSize,
                y: i * tileSize,
                width: tileSize,
                height: tileSize,
                value: numbers.pop(),
                isFlipped: false,
                isMatched: false,
            };
            tiles.push(tile);
        }
    }

    canvas.addEventListener("click", handleTileClick);

    draw();
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tiles.forEach(tile => {
        if (tile.isFlipped || tile.isMatched) {
            ctx.fillStyle = "#ddd";
            ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
            ctx.font = "20px Arial";
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(tile.value, tile.x + tile.width / 2, tile.y + tile.height / 2);
        } else {
            ctx.fillStyle = "#555";
            ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        }
    });
}

// Handle tile click event
function handleTileClick(event) {
    const clickedX = event.clientX - canvas.getBoundingClientRect().left;
    const clickedY = event.clientY - canvas.getBoundingClientRect().top;

    const clickedTile = tiles.find(tile => (
        clickedX >= tile.x && clickedX <= tile.x + tile.width &&
        clickedY >= tile.y && clickedY <= tile.y + tile.height &&
        !tile.isFlipped && !tile.isMatched
    ));

    if (clickedTile) {
        clickedTile.isFlipped = true;

        const flippedTiles = tiles.filter(tile => tile.isFlipped && !tile.isMatched);
        if (flippedTiles.length === 2) {
            setTimeout(() => checkMatch(flippedTiles), 500);
        }

        draw();
    }
}

// Check if the flipped tiles match
function checkMatch(flippedTiles) {
    const [firstTile, secondTile] = flippedTiles;
    if (firstTile.value === secondTile.value) {
        firstTile.isMatched = true;
        secondTile.isMatched = true;
    } else {
        firstTile.isFlipped = false;
        secondTile.isFlipped = false;
    }

    draw();

    // Check if all tiles are matched
    if (tiles.every(tile => tile.isMatched)) {
        alert("Congratulations! You've matched all pairs.");
        resetGame();
    }
}

// Reset the game
function resetGame() {
    canvas.removeEventListener("click", handleTileClick);
    tiles = [];
    init();
}

// Initialize the game
init();
