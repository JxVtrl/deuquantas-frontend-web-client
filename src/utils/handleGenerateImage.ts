import { generateImage } from "@/services/imageGenerator";

export const handleGenerateImage = async (productName: string) => {
  const imageUrl = await generateImage(productName);
    console.log('Generated Image URL:', imageUrl);
    return imageUrl;
};
