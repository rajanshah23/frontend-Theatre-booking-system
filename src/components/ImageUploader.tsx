import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // Adjust the path if needed

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `show-images/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("show-images")
      .upload(filePath, file);

    if (uploadError) {
      alert("Upload error: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("show-images")
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      alert("Failed to get public URL");
      setUploading(false);
      return;
    }

    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={uploadImage} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
}
