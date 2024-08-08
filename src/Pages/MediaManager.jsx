import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";

const Input = styled("input")({
  display: "none",
});

const UploadButton = styled(Button)({
  marginTop: "16px",
  marginBottom: "32px",
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#115293",
  },
});

const SaveButton = styled(Button)({
  marginTop: "16px",
  backgroundColor: "#4caf50",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#388e3c",
  },
});

const MediaBox = styled(Box)({
  position: "relative",
  borderRadius: "4px",
  overflow: "hidden",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
});

const DeleteButton = styled(IconButton)({
  position: "absolute",
  top: "8px",
  right: "8px",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
});

function MediaManager() {
  const [mediaEntries, setMediaEntries] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const accessToken = localStorage.getItem('accessToken');
  const backendUrl = import.meta.env.VITE_BACK_END_URL;

  useEffect(() => {
    // Fetch media data on mount
    axios
      .get(`${backendUrl}/api/media/all`)
      .then((response) => {
        console.log("Media data", response.data);
        setMediaEntries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching media data", error);
      });
  }, []);

  const handleImageUploadChange = (event) => {
    setNewImage(event.target.files[0]);
  };

  const handleVideoUrlChange = (event) => {
    setNewVideoUrl(event.target.value);
  };

  const handleSave = () => {
    const formData = new FormData();

    if (newImage) {
      formData.append("images", newImage); // 'images' should match the field name expected by multer
    }

    if (newVideoUrl) {
      formData.append("videoUrl", newVideoUrl);
    }

    axios
      .post(`${backendUrl}/api/media/add`, formData ,{
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
      .then((response) => {
        setMediaEntries((prevEntries) => [...prevEntries, response.data]);
        setNewImage(null);
        setNewVideoUrl("");
      })
      .catch((error) => {
        console.error("Error saving media data", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${backendUrl}/api/media/delete/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
      .then((response) => {
        setMediaEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting image", error);
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Ads Management
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Upload Image
        </Typography>
        <label htmlFor="upload-image-button">
          <Input
            accept="image/*"
            id="upload-image-button"
            type="file"
            onChange={handleImageUploadChange}
          />
          <UploadButton
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
          >
            Select Image
          </UploadButton>
        </label>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Video URL
        </Typography>
        <TextField
          fullWidth
          value={newVideoUrl}
          onChange={handleVideoUrlChange}
          placeholder="Enter video URL"
        />
        <SaveButton variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
          Save
        </SaveButton>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Media Entries
      </Typography>
      {mediaEntries.map((media, index) => (
        <Box key={media.id} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Media Entry {index + 1}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Video URL: {media.videoUrl}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Uploaded Images
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {JSON.parse(media.images).map((image, imgIndex) => (
              <Grid item key={imgIndex} xs={12} sm={6} md={4} lg={3}>
                <MediaBox>
                  <img
                    src={`${image.url}`}
                    alt={`Uploaded ${imgIndex}`}
                    style={{ width: "100%" }}
                  />
                  <DeleteButton
                    color="secondary"
                    aria-label="delete"
                    onClick={() => handleDelete(media.id, image.url)}
                  >
                    <DeleteIcon />
                  </DeleteButton>
                </MediaBox>
              </Grid>
            ))}
          </Grid>
          <Button variant="outlined" color="error" onClick={() => handleDelete(media.id)}>
            Delete Media Entry
            
          </Button>
        </Box>
      ))}
    </Box>
  );
}

export default MediaManager;
