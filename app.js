let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const accessCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 500, height: 400 },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    });
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);

  // Использование canvas для рисования видео
  ctx.drawImage(video, 0, 0, 500, 400);

  prediction.forEach((predictions) => {
    // Рисование изображения на лице
    const faceWidth = predictions.bottomRight[0] - predictions.topLeft[0];
    const faceHeight = predictions.bottomRight[1] - predictions.topLeft[1];
    const faceX = predictions.topLeft[0];
    const faceY = predictions.topLeft[1];
    // Загрузка изображения
    const image = new Image();
    image.src = './image.jpg'; // Путь к вашему изображению
    // После загрузки изображения рисуем его на canvas
    image.onload = () => {
      // Увеличиваем размеры изображения
      const scaleFactor = 1.2; // Коэффициент увеличения
      const enlargedWidth = faceWidth * scaleFactor;
      const enlargedHeight = faceHeight * 1.7;
      // Смещаем изображение немного влево и вверх
      const offsetX = 10; // Например, смещаем на 20 пикселей влево
      const offsetY = 50; // Например, смещаем на 50 пикселей вверх
      const adjustedFaceX = faceX - offsetX;
      const adjustedFaceY = faceY - offsetY;
      // Рисуем увеличенное, смещенное изображение на canvas
      ctx.drawImage(image, adjustedFaceX, adjustedFaceY, enlargedWidth, enlargedHeight);
    };
  });
};

accessCamera();
video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  // Вызов функции detectFaces каждые 40 миллисекунд
  setInterval(detectFaces, 30);
});