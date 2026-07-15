import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import "../../styles/createArticles.scss";
import "../../styles/singleArticle.scss";

const CreateArticleComponent = props => {
  const { onChange, onSubmit, onUpload, onBodyChange, image, article, body } = props;

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col col-lg-3" />
        <div className="col col-lg-6">
          <h1>Tell A story</h1>
          <form>
            <Stack spacing={2.25}>
              <TextField
                onChange={onChange}
                label="Title"
                name="title"
                id="title"
                defaultValue={article ? article.title : ""}
              />
              <TextField
                onChange={onChange}
                label="Description"
                name="description"
                id="description"
                defaultValue={article ? article.description : ""}
              />
              <TextField
                onChange={onBodyChange}
                label="Body"
                value={body}
                multiline
                minRows={8}
              />
              <TextField
                onChange={onChange}
                label="Tags"
                name="tags"
                id="tags"
                helperText="Separate your tags with a comma"
                defaultValue={
                  article
                    ? article.tagList
                      ? article.tagList.join(",")
                      : ""
                    : ""
                }
              />
            <div className="image-div">
              <div className="actual-image">
                <img
                  src={image ? image : article ? article.image : " "}
                  className="image-fluid"
                  alt=""
                />
              </div>
              <input
                type="file"
                name="imageUpload"
                onChange={event => onUpload(event.target.files)}
                id="fitz"
              />
            </div>

              <Button onClick={onSubmit}>
                Publish Story
              </Button>
            </Stack>
          </form>
        </div>
        <div className="col col-lg-3" />
      </div>
    </div>
  );
};

export default CreateArticleComponent;
