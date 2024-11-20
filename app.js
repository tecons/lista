// Elementos do DOM
const video = document.getElementById("video");
const photoCanvas = document.getElementById("photoCanvas");
const frame = document.getElementById("frame");
const captureButton = document.getElementById("captureButton");
const saveButton = document.getElementById("saveButton");
const frameSelector = document.getElementById("frameSelector");

// Contexto do canvas
const ctx = photoCanvas.getContext("2d");

// Configura a câmera com suporte a iPhone/iOS
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    const video = document.getElementById("video");
    video.srcObject = stream;

    // Garante que o vídeo seja reproduzido corretamente em iOS
    video.onloadedmetadata = () => {
      video.play();
    };
  })
  .catch((err) => {
    alert("Erro ao acessar a câmera: " + err.message);
  });

// Captura a imagem e aplica a moldura
captureButton.addEventListener("click", () => {
  // Define as dimensões do canvas com base no vídeo
  photoCanvas.width = video.videoWidth;
  photoCanvas.height = video.videoHeight;

  // Desenha o vídeo capturado no canvas
  ctx.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);

  // Desenha a moldura selecionada
  const frameImage = new Image();
  frameImage.src = frame.src; // Usa a URL da moldura selecionada
  frameImage.onload = () => {
    ctx.drawImage(frameImage, 0, 0, photoCanvas.width, photoCanvas.height); // Aplica a moldura
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
  // Cria um link para download
  const link = document.createElement("a");
  link.download = "photo_with_frame.png"; // Nome do arquivo salvo
  link.href = photoCanvas.toDataURL("image/png"); // Converte o canvas para imagem PNG
  link.click(); // Aciona o download
});
