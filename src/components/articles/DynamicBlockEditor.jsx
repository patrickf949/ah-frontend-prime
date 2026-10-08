import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button, Stack, Box, Alert } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const DynamicBlockEditor = ({ initialBlocks = "[]", onChange, onCoverImageSelect, coverImageUrl }) => {
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (!initialBlocks) return;
    try {
      const parsed = JSON.parse(initialBlocks);
      if (Array.isArray(parsed)) {
        setBlocks(parsed);
      } else {
        // Fallback for legacy plain text
        setBlocks([{ id: Date.now().toString(), type: "text", content: initialBlocks }]);
      }
    } catch (e) {
      // Legacy plain text
      setBlocks([{ id: Date.now().toString(), type: "text", content: initialBlocks }]);
    }
  }, [initialBlocks]);

  // Auto-select the cover image if there is exactly one image block
  useEffect(() => {
    if (!onCoverImageSelect) return;
    const imageBlocks = blocks.filter(b => b.type === "image");
    if (imageBlocks.length === 1 && coverImageUrl !== imageBlocks[0].url) {
      onCoverImageSelect(imageBlocks[0].url);
    }
  }, [blocks, coverImageUrl, onCoverImageSelect]);

  const notifyChange = (newBlocks) => {
    setBlocks(newBlocks);
    onChange(JSON.stringify(newBlocks));
  };

  const addTextBlock = () => {
    notifyChange([...blocks, { id: Date.now().toString(), type: "text", content: "" }]);
  };

  const updateTextBlock = (id, content) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, content } : b);
    notifyChange(newBlocks);
  };

  const removeBlock = (id) => {
    const block = blocks.find(b => b.id === id);
    if (block && block.type === "image" && block.url) {
      if (block.url === coverImageUrl && onCoverImageSelect) {
        onCoverImageSelect("");
      }
      // Background delete request
      const token = sessionStorage.getItem("token");
      axios.delete(`${API_BASE_URL}/articles/upload-image-url/`, {
        headers: { Authorization: "Bearer " + token },
        data: { url: block.url }
      }).catch(err => console.error("Failed to delete image", err));
    }
    notifyChange(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    if (index + direction < 0 || index + direction >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    notifyChange(newBlocks);
  };

  const handleImageClick = () => {
    const imageCount = blocks.filter(b => b.type === "image").length;
    if (imageCount >= 4) {
      setError("Maximum of 4 images allowed per article.");
      return;
    }
    setError("");
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 500 * 1024) {
      setError("Image size exceeds the 500KB limit.");
      return;
    }

    setError("");
    const token = sessionStorage.getItem("token");

    try {
      // 1. Get presigned PUT URL from Django API
      const res = await axios.post(
        `${API_BASE_URL}/articles/upload-image-url/`,
        { filename: file.name, contentType: file.type, size: file.size },
        { headers: { Authorization: "Bearer " + token } }
      );

      const { uploadUrl, url } = res.data;

      // 2. Upload directly to Cloudflare R2 / S3
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type }
      });

      // 3. Add image block
      notifyChange([...blocks, { id: Date.now().toString(), type: "image", url: url }]);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");
    }
    
    // Reset file input
    event.target.value = "";
  };

  return (
    <Box sx={{ my: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      
      {blocks.length === 0 && (
         <Box sx={{ p: 2, textAlign: 'center', color: '#666', border: '1px dashed #ccc' }}>
           Start by adding a text or image block below.
         </Box>
      )}

      {blocks.map((block, index) => (
        <Box key={block.id} sx={{ mb: 3, position: 'relative', border: '1px solid #eee', p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button size="small" onClick={() => moveBlock(index, -1)} disabled={index === 0}>Up</Button>
            <Button size="small" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}>Down</Button>
            <Button size="small" color="error" onClick={() => removeBlock(block.id)}>Remove</Button>
          </Box>
          
          {block.type === "text" ? (
            <ReactQuill 
              value={block.content} 
              onChange={(content) => updateTextBlock(block.id, content)} 
              theme="snow"
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['clean']
                ]
              }}
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <img src={block.url} alt="Article visual" style={{ maxWidth: "100%", maxHeight: "400px" }} />
              {onCoverImageSelect && (
                 <Box sx={{ mt: 1 }}>
                   <Button 
                     size="small" 
                     variant={coverImageUrl === block.url ? "contained" : "outlined"}
                     color={coverImageUrl === block.url ? "success" : "primary"}
                     onClick={() => onCoverImageSelect(block.url)}
                   >
                     {coverImageUrl === block.url ? "Cover Image Selected" : "Set as Cover Image"}
                   </Button>
                 </Box>
              )}
            </Box>
          )}
        </Box>
      ))}

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={addTextBlock}>+ Add Text</Button>
        <Button variant="outlined" onClick={handleImageClick}>+ Add Image</Button>
      </Stack>

      <input 
        type="file" 
        accept="image/*" 
        style={{ display: "none" }} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
    </Box>
  );
};

export default DynamicBlockEditor;
