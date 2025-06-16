import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    
    // Generate clean filename with extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_\.]/g, '');
    const fileName = `${Date.now()}-${cleanName.substring(0, 20)}.${fileExt}`;
    
    try {
      // Upload to bucket
      const { error } = await supabase.storage
        .from("show-images")
        .upload(fileName, file, {
          contentType: file.type || 'image/jpeg', // Fallback content type
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        // Handle specific storage errors
        if (error.message.includes('The resource already exists')) {
          throw new Error('File with this name already exists');
        }
        if (error.message.includes('File size limit exceeded')) {
          throw new Error('File size exceeds 5MB limit');
        }
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = await supabase.storage
        .from("show-images")
        .getPublicUrl(fileName);

      if (!publicUrl) throw new Error("Failed to generate public URL");
      
      // Test image loading
      await new Promise((resolve) => {
        const testImg = new Image();
        testImg.onload = resolve;
        testImg.onerror = () => {
          throw new Error("Image failed to load after upload");
        };
        testImg.src = publicUrl;
      });
      
      setImageUrl(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button 
        onClick={uploadImage} 
        disabled={uploading || !file}
        style={{ opacity: uploading || !file ? 0.7 : 1 }}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            style={{ maxWidth: "300px", display: "block" }}
            onError={(e) => {
              console.error("Image failed to load", e);
              alert(`Failed to load image from: ${imageUrl}`);
            }} 
          />
          <div style={{ 
            wordBreak: "break-all", 
            marginTop: "10px",
            fontSize: "0.8rem",
            backgroundColor: "#f0f0f0",
            padding: "5px"
          }}>
            URL: {imageUrl}
          </div>
        </div>
      )}
    </div>
  );
}