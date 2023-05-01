const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_WIDTH = canvas.offsetWidth;
const CANVAS_HEIGHT = canvas.offsetHeight;

const drawingOption = (() => { 
    let isPainting = false;
    let isFilling = "Draw";

    return {
        getIsPainting: () => {
            return isPainting;
        },
        setIsPainting: (b) => {
            isPainting = b;
        },
        getIsFilling: () => {
            return isFilling;
        },
        setIsFilling: (b) => {
            isFilling = b;
        },
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    const doc = document;
    const lineWidth = doc.querySelector('#line-width');

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = "round";

    canvas.addEventListener("mousemove", onDrawing);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", onCanvasClick);
    canvas.addEventListener("dblclick", onDoubleClick);
    canvas.addEventListener("contextmenu", onPreventRight);

    lineWidth.addEventListener("input", onRangeChange);
    doc.querySelector('#mode-btn').addEventListener("click", onModeChange);
    doc.querySelector('#destroy-btn').addEventListener("click", onDestroy);
    doc.querySelector('#eraser-btn').addEventListener("click", onEraser);
    doc.querySelector('#file').addEventListener("change", onFileChange);
    doc.querySelector('#save-btn').addEventListener("click", onSave);

    doc.querySelector('#color').addEventListener("change", onColorChange);
    doc.querySelector('#colorOptions').addEventListener("click", onColorSelectChange);
});

function onDrawing(event) {
    if (drawingOption.getIsPainting()) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }

    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
    drawingOption.setIsPainting(true);
}

function stopPainting() {
    drawingOption.setIsPainting(false);
    if (drawingOption.getIsFilling() === "Bucket") {
        ctx.fill();
    }
    ctx.beginPath();
}

function onCanvasClick() {
    if (drawingOption.getIsFilling() === "Fill") {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

function onDoubleClick(event) {
    const text = document.querySelector("#text").value;
    if (text) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.font = "68px sans-serif";
      ctx.fillText(text, event.offsetX, event.offsetY);
      ctx.restore();
    }
}

function onPreventRight(event) {
    event.preventDefault();
}

function onColorChange(event) {
    const color = event.target.value;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function onColorSelectChange(event) {
    const color = event.target.dataset.color;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    document.querySelector('#color').value = color;
}

function onRangeChange(event) {
    ctx.lineWidth = event.target.value;
}

function onModeChange(event) {
    const mode = event.target.innerText;
    if (mode) {
        drawingOption.setIsFilling(mode);
    }
}

function onFileChange(event) {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      document.getElementById("file").value = null;
    };
  }

function onSave() {
    const url = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = url;
    link.download = "drawing.png";
    link.click();
}

function onDestroy() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraser() {
    ctx.strokeStyle = "white";
    drawingOption.setIsFilling("Draw");
    document.querySelector("#draw-mode").checked = true;
}