const imageInput = document.getElementById("imageInput");
const imageCanvas = document.getElementById("imageCanvas");
const imagePreview = document.getElementById("imagePreview");
const contrastSlider = document.getElementById("contrastSlider");
const contrastValue = document.getElementById("contrastValue");
const resetButton = document.getElementById("resetButton");
const downloadButton = document.getElementById("downloadButton");
let originalImageData = null;

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ctx = imageCanvas.getContext("2d");
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        originalImageData = ctx.getImageData(0, 0, img.width, img.height);
        imagePreview.src = e.target.result;
        imagePreview.classList.remove("hidden");
        contrastSlider.value = 0;
        contrastValue.textContent = 0;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

contrastSlider.addEventListener("input", () => {
  if (originalImageData) {
    const ctx = imageCanvas.getContext("2d");
    const imageData = ctx.createImageData(
      originalImageData.width,
      originalImageData.height
    );
    const contrast = parseInt(contrastSlider.value);
    contrastValue.textContent = contrast;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < originalImageData.data.length; i += 4) {
      imageData.data[i] = factor * (originalImageData.data[i] - 128) + 128;
      imageData.data[i + 1] =
        factor * (originalImageData.data[i + 1] - 128) + 128;
      imageData.data[i + 2] =
        factor * (originalImageData.data[i + 2] - 128) + 128;
      imageData.data[i + 3] = originalImageData.data[i + 3];
    }
    ctx.putImageData(imageData, 0, 0);
    imagePreview.src = imageCanvas.toDataURL();
  }
});

resetButton.addEventListener("click", () => {
  if (originalImageData) {
    contrastSlider.value = 0;
    contrastValue.textContent = 0;
    imagePreview.src = imageCanvas.toDataURL();
  }
});

downloadButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = imagePreview.src;
  link.download = "adjusted-image.png";
  link.click();
});
