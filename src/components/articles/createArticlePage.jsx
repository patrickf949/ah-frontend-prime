import { API_BASE_URL } from "../../config/api";
import React, { Component } from "react";
import { connect } from "react-redux";
import "../../styles/app.scss";
import { articleCreateEditAction } from "../../actions/articleCreateEditAction";
import CreateArticleComponent from "./createArticleComponent";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import axios from "axios";

export class CreateArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      description: "",
      tags: "",
      image: "",
      isUploaded: false,
      showDraftModal: false,
      draftData: null
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.autoSaveDraft = this.autoSaveDraft.bind(this);
    this.saveTimeout = null;
  }

  async componentDidMount() {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(API_BASE_URL + "/articles/autosave/", {
        headers: { Authorization: "Bearer " + token }
      });
      if (res.data && res.data.draft) {
        this.setState({
          showDraftModal: true,
          draftData: res.data.draft
        });
      }
    } catch (err) {
      console.error("Failed to load draft", err);
    }
  }

  handleRestoreDraft = (restore) => {
    if (restore && this.state.draftData) {
      this.setState({
        title: this.state.draftData.title || "",
        body: this.state.draftData.body || "",
        description: this.state.draftData.description || "",
        tags: this.state.draftData.tags ? this.state.draftData.tags.join(",") : "",
        showDraftModal: false,
        draftData: null
      });
    } else {
      this.setState({ showDraftModal: false, draftData: null });
    }
  }

  autoSaveDraft() {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const { title, body, description, tags } = this.state;
    const draft = { title, body, description, tags: tags.split(",") };
    
    axios.post(API_BASE_URL + "/articles/autosave/", draft, {
      headers: { Authorization: "Bearer " + token }
    }).catch(err => console.error("Autosave failed", err));
  }

  triggerAutoSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(this.autoSaveDraft, 3000);
  }

  /* istanbul ignore next */
  onUpload(url) {
    this.setState({ isUploaded: !!url, image: url }, this.triggerAutoSave);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, this.triggerAutoSave);
  }
  onBodyChange(e) {
    this.setState({ body: e.target.value }, this.triggerAutoSave);
  }
  onSubmit(e) {
    e.preventDefault();
    const { title, body, description, tags, image } = this.state;
    const messageObject = {
      title: title,
      body: body,
      description: description,
      tags: tags.split(","),
      image: image
    };

    this.props.articleCreateEditAction(
      messageObject,
      API_BASE_URL + "/articles/",
      "post",
      this.props,
      "created"
    );
  }

  render() {
    const { image, showDraftModal } = this.state;
    return (
      <div>
        <Dialog open={showDraftModal} onClose={() => this.handleRestoreDraft(false)}>
          <DialogTitle>Unsaved Draft Found</DialogTitle>
          <DialogContent>
            <DialogContentText>
              An unsaved draft was found from your previous session. Would you like to restore it?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleRestoreDraft(false)} color="secondary">
              Discard
            </Button>
            <Button onClick={() => this.handleRestoreDraft(true)} color="primary" variant="contained" autoFocus>
              Restore Draft
            </Button>
          </DialogActions>
        </Dialog>

        <CreateArticleComponent
          {...this.state}
          onChange={this.onChange}
          onUpload={this.onUpload}
          onSubmit={this.onSubmit}
          onBodyChange={this.onBodyChange}
          image={image}
        />
      </div>
    );
  }
}

export default connect(
  null,
  { articleCreateEditAction }
)(CreateArticlePage);
