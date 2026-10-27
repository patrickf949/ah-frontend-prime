import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Stack, TextField } from "@mui/material";
import { withRouter } from "../../utils/router";
import { editProfileAction } from "../../actions/profileActions";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/profile.scss";

export class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bio: "",
      full_name: "",
      image: "",
      isProcessing: false,
      uploadDone: false,
      progress: 0,
      imageFile: null,
      previewUrl: ""
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.upDateSuccess === true) {
      const { history } = nextProps;
      history.push(`/profile/${sessionStorage.getItem("username")}`);
    }
    if (nextProps.profile && nextProps.profile !== this.props.profile) {
      const { full_name, bio, image } = nextProps.profile;
      this.setState(prevState => ({
        full_name: prevState.full_name || full_name || "",
        bio: prevState.bio || bio || "",
        image: prevState.image || image || ""
      }));
    }
  }

  componentWillMount() {
    const { full_name, bio, image } = this.props.profile || {};
    this.setState({
      full_name: full_name || "",
      bio: bio || "",
      image: image || ""
    });
  }
  handleNameChange(event) {
    const { value } = event.target;
    this.setState({ full_name: value });
  }
  handleBioChange(event) {
    const { value } = event.target;
    this.setState({ bio: value });
  }
  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        toast.error("Image size exceeds the 500KB limit.");
        return;
      }
      this.setState({ 
        imageFile: file, 
        previewUrl: URL.createObjectURL(file) 
      });
    }
  }
  async handleSubmit(event) {
    event.preventDefault();
    const { bio, full_name, image, imageFile } = this.state;
    
    let uploadedImageUrl = image;

    if (imageFile) {
      this.setState({ isProcessing: true });
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${API_BASE_URL}/articles/upload-image-url/`,
          { filename: imageFile.name, contentType: imageFile.type, size: imageFile.size },
          { headers: { Authorization: "Bearer " + token } }
        );

        const { uploadUrl, url } = res.data;

        await axios.put(uploadUrl, imageFile, {
          headers: { "Content-Type": imageFile.type }
        });
        uploadedImageUrl = url;
        this.setState({ uploadDone: true });
      } catch (error) {
        this.setState({ isProcessing: false });
        toast.error(error.response?.data?.error || "Image upload failed");
        return;
      }
    }

    const data = {
      bio: bio,
      full_name: full_name,
      image: uploadedImageUrl
    };
    this.props.editProfileAction(data, this.props);
  }
  /* Removed Firebase uploadImage function */

  render() {
    return (
      <div>
        <div className="container">
          <div className="container-profile">
            <div className="row">
              <div className="col-md-8">
                <form role="form" method="post" onSubmit={this.handleSubmit}>
                  <Stack spacing={2.25} sx={{ alignItems: "flex-start" }}>
                    <TextField
                      id="full_name"
                      type="text"
                      label="Full name"
                      value={this.state.full_name}
                      onChange={this.handleNameChange}
                    />
                    <TextField
                      id="bio"
                      type="text"
                      label="Short bio"
                      value={this.state.bio}
                      onChange={this.handleBioChange}
                      multiline
                      minRows={3}
                    />
                    <Button type="submit" disabled={this.state.isProcessing}>
                      {this.state.isProcessing ? "Saving..." : "Save"}
                    </Button>
                  </Stack>
                </form>
              </div>

              <div className="col-md-4">
                <div className="styleme">
                  <div className="profile-img">
                    <img
                      src={this.state.previewUrl || this.state.image}
                      className="update-image"
                      alt="Profile"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={this.handleImageUpload}
                      id="banyati"
                      className="upload-button btn-outline-success"
                    />
                  </div>
                </div>
                {this.state.isProcessing && (
                  <progress value={this.state.progress} max="100" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  profile: state.profileReducer.profile,
  upDateSuccess: state.profileReducer.upDateSuccess
});

export default withRouter(
  connect(
    mapStateToProps,
    { editProfileAction }
  )(EditProfile)
);
