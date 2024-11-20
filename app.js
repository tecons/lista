// Elementos do DOM
const video = document.getElementById("video");
const photoCanvas = document.getElementById("photoCanvas");
const frame = document.getElementById("frame");
const captureButton = document.getElementById("captureButton");
const saveButton = document.getElementById("saveButton");
const frameSelector = document.getElementById("frameSelector");

// Contexto do canvas
const ctx = photoCanvas.getContext("2d");

let currentFacingMode = "environment"; // Começa com a câmera traseira
let currentStream = null; // Armazena o stream atual

const video = document.getElementById("video");
const toggleCameraButton = document.getElementById("toggleCameraButton");

// Função para iniciar a câmera
async function startCamera(facingMode) {
  // Interrompe o stream atual, se existir
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  try {
    // Solicita o novo stream
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode },
    });

    // Atribui o stream ao elemento de vídeo
    video.srcObject = currentStream;

    // Garante que o vídeo é reproduzido corretamente
    video.onloadedmetadata = () => video.play();
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
}

// Alterna entre câmeras traseira e dianteira
toggleCameraButton.addEventListener("click", () => {
  currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
  startCamera(currentFacingMode);
});

// Inicializa com a câmera traseira
startCamera(currentFacingMode);

// Captura a imagem com a moldura
captureButton.addEventListener("click", () => {
  // Ajusta o tamanho do canvas ao vídeo
  photoCanvas.width = video.videoWidth;
  photoCanvas.height = video.videoHeight;

  // Desenha o vídeo capturado no canvas
  ctx.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);

  // Adiciona a moldura sobre a imagem capturada
  const frameImage = new Image();
  frameImage.src = frame.src; // Carrega a moldura selecionada
  frameImage.onload = () => {
    ctx.drawImage(frameImage, 0, 0, photoCanvas.width, photoCanvas.height); // Desenha a moldura
  };

  // Exibe o canvas
  photoCanvas.style.display = "block";
});

// Troca a moldura ao selecionar no menu
frameSelector.addEventListener("change", (e) => {
  frame.src = e.target.value; // Atualiza a URL da moldura
});

// Salva a imagem montada
saveButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "photo_with_frame.png"; // Nome do arquivo salvo
  link.href = photoCanvas.toDataURL("image/png"); // Converte o canvas para imagem PNG
  link.click(); // Aciona o download
});
