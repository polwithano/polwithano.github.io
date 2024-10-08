import * as THREE from 'three'; 

function CreateCheckerboardTexture(color1, color2, rows, cols, context, canvas) 
{
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    for (let row = 0; row < rows; row++) 
    {
        for (let col = 0; col < cols; col++) 
        {
            context.fillStyle = (row + col) % 2 === 0 ? color1 : color2;
            context.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter; // Ensures sharpness when scaling up
    texture.minFilter = THREE.NearestFilter; // Ensures sharpness when scaling down

    return texture;
}

function CreateMultiGradientTexture(colors, context, canvas) 
{
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    const step = 1 / (colors.length - 1);

    for (let i = 0; i < colors.length; i++) 
    {
        gradient.addColorStop(i * step, colors[i]);
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.height, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter; // Ensures sharpness when scaling up
    texture.minFilter = THREE.LinearFilter; // Ensures sharpness when scaling down

    return texture;
}

function CreateChartPieTexture(color1, color2, segments, context, canvas) 
{
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height);

    for (let i = 0; i < segments; i++) 
    {
        const startAngle = (i * 2 * Math.PI) / segments;
        const endAngle = ((i + 1) * 2 * Math.PI) / segments;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startAngle, endAngle);
        context.closePath();
        context.fillStyle = i % 2 === 0 ? color1 : color2;
        context.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter; // Ensures sharpness when scaling up
    texture.minFilter = THREE.NearestFilter; // Ensures sharpness when scaling down

    return texture;
}

export default {CreateCheckerboardTexture, CreateMultiGradientTexture, CreateChartPieTexture}