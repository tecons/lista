// Elementos do DOM
const video = document.getElementById("video");
const photoCanvas = document.getElementById("photoCanvas");
const frame = document.getElementById("frame");
const captureButton = document.getElementById("captureButton");
const saveButton = document.getElementById("saveButton");
const frameSelector = document.getElementById("frameSelector");

// Contexto do canvas
const ctx = photoCanvas.getContext("2d");
let currentFacingMode = "environment"; // Câmera inicial (traseira)
let currentStream = null; // Stream de vídeo atual

const videoContainer = document.getElementById("video").parentNode; // Contêiner do vídeo
const toggleCameraButton = document.getElementById("toggleCameraButton");

// Inicializa a câmera com o modo atual (traseiro ou frontal)
async function startCamera(facingMode) {
  // Para o stream atual, se existir
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  try {
    // Solicita acesso à câmera
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
    });

    // Remove o vídeo atual
    const oldVideo = document.getElementById("video");
    if (oldVideo) oldVideo.remove();

    // Cria um novo elemento de vídeo
    const newVideo = document.createElement("video");
    newVideo.id = "video";
    newVideo.autoplay = true;
    newVideo.playsinline = true;
    newVideo.srcObject = currentStream;

    // Adiciona o novo vídeo ao contêiner
    videoContainer.appendChild(newVideo);
    newVideo.onloadedmetadata = () => newVideo.play();
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
}

// Alterna entre câmeras (traseira e frontal)
toggleCameraButton.addEventListener("click", () => {
  currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
  startCamera(currentFacingMode);
});

// Inicializa a câmera ao carregar a página
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
