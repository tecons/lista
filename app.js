let currentFacingMode = "environment"; // Câmera inicial
let currentStream = null; // Stream de vídeo atual

// Elementos do DOM
const video = document.getElementById("video");
const toggleCameraButton = document.getElementById("toggleCameraButton");
const captureButton = document.getElementById("captureButton");
const saveButton = document.getElementById("saveButton");
const photoCanvas = document.getElementById("photoCanvas");
const frame = document.getElementById("frame");
const frameSelector = document.getElementById("frameSelector");
const ctx = photoCanvas.getContext("2d");

// Função para iniciar a câmera
async function startCamera(facingMode) {
  // Interrompe o stream atual, se existir
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  try {
    // Solicita acesso à câmera
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
    });

    // Atribui o stream ao vídeo
    video.srcObject = currentStream;
    video.onloadedmetadata = () => video.play();
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
}

// Alterna entre câmera traseira e dianteira
toggleCameraButton.addEventListener("click", () => {
  currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
  startCamera(currentFacingMode);
});

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
    ctx.drawImage(frameImage, 0, 0, photoCanvas.width, photoCanvas.height);
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

// Inicializa a câmera ao carregar a página
startCamera(currentFacingMode);
