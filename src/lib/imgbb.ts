const IMGBB_API_URL = "https://api.imgbb.com/1/upload";
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

export class ImgbbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImgbbError";
  }
}

export const uploadToImgbb = async (file: File): Promise<string> => {
  if (!IMGBB_API_KEY) {
    throw new ImgbbError("Imgbb API key not configured");
  }

  const base64 = await fileToBase64(file);

  const formData = new FormData();
  formData.append("key", IMGBB_API_KEY);
  formData.append("image", base64);

  const response = await fetch(IMGBB_API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new ImgbbError("Failed to upload image");
  }

  const data = await response.json();

  if (!data.success) {
    throw new ImgbbError(data.error?.message || "Upload failed");
  }

  return data.data.url;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
