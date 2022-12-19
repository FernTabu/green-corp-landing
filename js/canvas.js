const COLORS = ["255,108,80", "5,117,18", "29,39,57", "67,189,81"]; //В методе init нужно инициализировать цвет пузырька 1 из случайных цветов.Для этого заведем глобальную переменную с цветами, в формате RGB
const BUBBLE_DENSITY = 50;

function generateDecimalBetween(left, right) {
    return (Math.random() * (left - right) + right).toFixed(2);//с помощью метода toFixed(2) мы оставляем от числа два знака после запятой
}

class Bubble {
    constructor(canvas) {
        this.canvas = canvas;
        this.getCanvasSize();
        this.init();
    }

    getCanvasSize() {
        this.canvasWidth = this.canvas.clientWidth;
        this.canvasHeight = this.canvas.clientHeight;
    }

    init() {
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = generateDecimalBetween(5, 10) / 10;//прозрачность, которая принимает значения от 0 до 1. 
        this.size = generateDecimalBetween(1, 3);
        this.translateX = generateDecimalBetween(0, this.canvasWidth);
        this.translateY = generateDecimalBetween(0, this.canvasHeight);
        this.velocity = generateDecimalBetween(20, 40);//На это число мы будем все время смещать позицию пузырька, таким образом, эти свойства задают скорость и направление движения:
        this.movementX = generateDecimalBetween(-2, 2) / this.velocity;
        this.movementY = generateDecimalBetween(1, 20) / this.velocity;
    }

    move() {
        this.translateX = this.translateX - this.movementX;
        this.translateY = this.translateY - this.movementY;
        if (this.translateY < 0 || this.translateX < 0 || this.translateX > this.canvasWidth) {
            this.init();
            this.translateY = this.canvasHeight;
        }
    }
}

class CanvasBackground {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.dpr = window.devicePixelRatio;
    }

    start() {
        this.canvasSize();
        this.generateBubbles();
        this.animate();
    }
    canvasSize() {
        this.canvas.width = this.canvas.offsetWidth * this.dpr;
        this.canvas.height = this.canvas.offsetHeight * this.dpr;

        this.ctx.scale(this.dpr, this.dpr);//Метод scale() изменяет масштаб текущего графического объекта, делает его больше или меньше.
    }
    generateBubbles() {
        this.bubblesList = [];
        for (let i = 0; i < BUBBLE_DENSITY; i++) {
            this.bubblesList.push(new Bubble(this.canvas))
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.bubblesList.forEach((bubble) => {
            bubble.move();
            this.ctx.translate(bubble.translateX, bubble.translateY);
            this.ctx.beginPath();
            this.ctx.arc(0, 0, bubble.size, 0, 2 * Math.PI);
            this.ctx.fillStyle = "rgba(" + bubble.color + "," + bubble.alpha + ")";// bubble.color хранится в формате трех цифр через запятую (например, "255,108,80"), а fillStyle должен быть равен строке в другом формате: "rgba(0,0,0,1)"
            this.ctx.fill();
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);//настроить масштабирование
        });
        requestAnimationFrame(this.animate.bind(this));
    }
}
const canvas = new CanvasBackground("orb-canvas");
canvas.start();
