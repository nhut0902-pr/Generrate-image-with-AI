
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const model = ai.models;

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the Base64 prefix, which we need to remove.
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to read blob as a Base64 string."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await model.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    }
    
    throw new Error('No image data found in the response.');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image from prompt.');
  }
};

export const editImage = async (image: File, prompt: string): Promise<string> => {
  try {
    const base64Image = await blobToBase64(image);

    const response = await model.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: image.type,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    }

    throw new Error('No image data found in the edited response.');
  } catch (error) {
    console.error('Error editing image:', error);
    throw new Error('Failed to edit image.');
  }
};
