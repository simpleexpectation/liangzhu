const previewButton = document.getElementById("previewButton");
const closeButton = document.getElementById("closeButton");
const previewDialog = document.getElementById("previewDialog");

if (previewButton && closeButton && previewDialog) {
  previewButton.addEventListener("click", () => {
    previewDialog.showModal();
  });

  closeButton.addEventListener("click", () => {
    previewDialog.close();
  });

  previewDialog.addEventListener("click", (event) => {
    const rect = previewDialog.getBoundingClientRect();
    const isInside =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isInside) {
      previewDialog.close();
    }
  });
}
