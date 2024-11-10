export const handleImageResize = (file) => {
    return new Promise((resolve, reject) => {
      if (file) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target.result;
        };

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set the canvas to the desired dimensions
          canvas.width = 400;
          canvas.height = 250;

          // Draw the image in the canvas, resizing it to 400x250 pixels
          ctx.drawImage(img, 0, 0, 400, 250);

          // Convert the canvas data to a Blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Create a new file from the blob
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              // Resolve the promise with the resized file
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to resize image"));
            }
          }, file.type);
        };

        // Handle error if image loading fails
        img.onerror = () => reject(new Error("Failed to load image"));

        // Read the file as a data URL
        reader.readAsDataURL(file);
      } else {
        reject(new Error("No file provided"));
      }
    });
  };