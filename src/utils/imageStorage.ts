// Utility for handling local image storage for novels
export class ImageStorageService {
  private static instance: ImageStorageService;
  private readonly STORAGE_KEY = 'novel_images';
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  static getInstance(): ImageStorageService {
    if (!ImageStorageService.instance) {
      ImageStorageService.instance = new ImageStorageService();
    }
    return ImageStorageService.instance;
  }

  // Store image in localStorage as base64
  async storeImage(file: File, novelId: number): Promise<string> {
    try {
      // Validate file size
      if (file.size > this.MAX_IMAGE_SIZE) {
        throw new Error('La imagen es demasiado grande. Máximo 5MB.');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen.');
      }

      // Convert to base64
      const base64 = await this.fileToBase64(file);
      
      // Store in localStorage
      const storedImages = this.getStoredImages();
      storedImages[novelId] = {
        data: base64,
        filename: file.name,
        size: file.size,
        type: file.type,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedImages));
      
      return base64;
    } catch (error) {
      console.error('Error storing image:', error);
      throw error;
    }
  }

  // Get image for a novel
  getImage(novelId: number): string | null {
    try {
      const storedImages = this.getStoredImages();
      return storedImages[novelId]?.data || null;
    } catch (error) {
      console.error('Error retrieving image:', error);
      return null;
    }
  }

  // Delete image for a novel
  deleteImage(novelId: number): void {
    try {
      const storedImages = this.getStoredImages();
      delete storedImages[novelId];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedImages));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  // Get all stored images info
  getStoredImages(): { [novelId: number]: any } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error parsing stored images:', error);
      return {};
    }
  }

  // Get storage usage statistics
  getStorageStats(): { totalImages: number; totalSize: number; sizeInMB: number } {
    const storedImages = this.getStoredImages();
    const totalImages = Object.keys(storedImages).length;
    const totalSize = Object.values(storedImages).reduce((sum: number, img: any) => sum + (img.size || 0), 0);
    const sizeInMB = totalSize / (1024 * 1024);
    
    return { totalImages, totalSize, sizeInMB };
  }

  // Clear all stored images
  clearAllImages(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Compress image if needed (basic compression)
  async compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}

export const imageStorageService = ImageStorageService.getInstance();