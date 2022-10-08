//Getting the canvas from html
const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 15;
let adjustY = 2;

//Handle Mouse Interaction

const mouse = {
    x: null,
    y: null,
    radius: 80
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    // console.log(mouse.x, mouse.y);
})

//Hidden Text Layer

context.fillStyle = 'white';
context.font = '25px Sans-Serif';
context.fillText('Hello', 0, 30);
const textCoordinates = context.getImageData(0, 0, 200, 100);

//Particle Class

class Particle{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
    }
    draw() {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt( dx * dx + dy * dy);
        let forceDirectionX = dx / distance * 3;
        let forceDirectionY = dy / distance * 3;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        }
        else {
            if (this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -=  dy/10;
            }
        }
    }
}

//Init the canvas
function init() {
    particleArray = [];
    let minValue = -.5
    let maxValue = .5
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX + (Math.random() * (minValue - maxValue) - minValue);
                let positionY = y + adjustY + + (Math.random() * (minValue - maxValue) - minValue);
                particleArray.push(new Particle( positionX * 20, positionY * 20));
            }
        }
    }
}

//Calling the Function

init();
// console.log(particleArray);

//Updating the canvas

function animate(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect(){

    for (let a = 0; a < particleArray.length; a++){
        for(let b = a; b <particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50){
                let opacity = 1 - (distance/50);

                context.strokeStyle = 'rgba(255, 255, 255,' + opacity + ')';
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(particleArray[a].x, particleArray[a].y);
                context.lineTo(particleArray[b].x, particleArray[b].y);
                context.stroke();
            }
        }
    }
}
