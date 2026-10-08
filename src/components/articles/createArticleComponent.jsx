import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import "../../styles/createArticles.scss";
import "../../styles/singleArticle.scss";
import DynamicBlockEditor from "./DynamicBlockEditor";

const CreateArticleComponent = props => {
  const { onChange, onSubmit, onUpload, onBodyChange, image, article, body, title, description, tags } = props;

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
                value={title || ""}
              />
              <TextField
                onChange={onChange}
                label="Description"
                name="description"
                id="description"
                value={description || ""}
              />
              <DynamicBlockEditor
                initialBlocks={body}
                onChange={(blocksString) => onBodyChange({ target: { value: blocksString } })}
                onCoverImageSelect={onUpload}
                coverImageUrl={image}
              />
              <TextField
                onChange={onChange}
                label="Tags"
                name="tags"
                id="tags"
                helperText="Separate your tags with a comma"
                value={tags || ""}
              />

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
