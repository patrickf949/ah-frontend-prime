import { API_BASE_URL } from "../../config/api";
import React, { Component } from "react";
import { connect } from "react-redux";
import "../../styles/app.scss";
import { articleCreateEditAction } from "../../actions/articleCreateEditAction";
import { getArticleAction } from "../../actions/getArticle";
import CreateArticleComponent from "./createArticleComponent";
import axios from "axios";

export class EditArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      description: "",
      tags: "",
      image: "",
      isUploaded: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.autoSaveDraft = this.autoSaveDraft.bind(this);
    this.saveTimeout = null;
  }

  autoSaveDraft() {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const { title, body, description, tags } = this.state;
    const draft = { title, body, description, tags: tags ? tags.split(",") : "" };
    
    axios.post(API_BASE_URL + "/articles/autosave/", draft, {
      headers: { Authorization: "Bearer " + token }
    }).catch(err => console.error("Autosave failed", err));
  }

  triggerAutoSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(this.autoSaveDraft, 3000);
  }
  componentDidMount() {
    this.props.getArticleAction(this.props.match.params.slug);
  }

  componentDidUpdate(prevProps) {
    const currentArticle = this.props.article?.article;
    const prevArticle = prevProps.article?.article;

    if (currentArticle && currentArticle !== prevArticle) {
      this.setState({
        title: currentArticle.title || "",
        description: currentArticle.description || "",
        body: currentArticle.body || "",
        image: currentArticle.image || "",
        tags: this.props.article?.tagList ? this.props.article.tagList.join(",") : "",
        article: currentArticle
      });
    }
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
      tags: tags ? tags.split(",") : "",
      image: image
    };
    const url =
      API_BASE_URL + "/articles/" +
      this.props.match.params.slug +
      "/";

    this.props.articleCreateEditAction(
      messageObject,
      url,
      "put",
      this.props,
      "updated"
    );
  }

  render() {
    const { image, article } = this.state;

    return (
      <div>
        <CreateArticleComponent
          {...this.state}
          onChange={this.onChange}
          onUpload={this.onUpload}
          onSubmit={this.onSubmit}
          onBodyChange={this.onBodyChange}
          image={image}
          article={article ? article : null}
        />
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  article: state.getArticleReducer.article
});

export default connect(
  mapStateToProps,
  { getArticleAction, articleCreateEditAction }
)(EditArticlePage);
