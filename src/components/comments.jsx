import React, { Component } from "react";
import moment from "moment";
import { Button, Stack, TextField } from "@mui/material";
import { articleComments, fetchComments } from "../actions/commentsActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import "../styles/comments.scss";
import { getDefaultAvatar } from "../utils/avatar";

export class Comments extends Component {
  constructor(props) {
    super(props);
    const isLoggedIn = Boolean(sessionStorage.token);
    this.state = {
      comments: "",
      visibleCount: isLoggedIn ? 20 : 5,
      replyingTo: null,
      replyComment: ""
    };
  }

  componentDidMount() {
    const { fetchComments, articleSlug } = this.props;
    fetchComments(articleSlug);

    const isLoggedIn = Boolean(sessionStorage.token);
    if (isLoggedIn) {
      window.addEventListener("scroll", this.handleScroll);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.articleSlug !== prevProps.articleSlug) {
      const { fetchComments, articleSlug } = this.props;
      fetchComments(articleSlug);
      const isLoggedIn = Boolean(sessionStorage.token);
      this.setState({
        visibleCount: isLoggedIn ? 20 : 5,
        comments: "",
        replyingTo: null,
        replyComment: ""
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { commentsMessage } = this.props;
    const { visibleCount } = this.state;
    if (!commentsMessage || commentsMessage.length <= visibleCount) {
      return;
    }
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop + windowHeight >= documentHeight - 100) {
      this.setState(prevState => ({
        visibleCount: prevState.visibleCount + 20
      }));
    }
  };

  handleOnChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleOnSubmit = event => {
    event.preventDefault();
    const { articleSlug, articleComments, fetchComments } = this.props;
    const { comments } = this.state;
    const data = {
      body: comments
    };
    const result = articleComments(data, articleSlug);
    if (result && typeof result.then === "function") {
      result.then(() => {
        fetchComments(articleSlug, false);
        this.setState({ comments: "" });
      });
    } else {
      fetchComments(articleSlug, false);
      this.setState({ comments: "" });
    }
  };

  handleReplySubmit = (event, parentId) => {
    event.preventDefault();
    const { articleSlug, articleComments, fetchComments } = this.props;
    const { replyComment } = this.state;
    const data = {
      body: replyComment
    };
    const result = articleComments(data, articleSlug, parentId);
    if (result && typeof result.then === "function") {
      result.then(() => {
        fetchComments(articleSlug, false);
        this.setState({ replyComment: "", replyingTo: null });
      });
    } else {
      fetchComments(articleSlug, false);
      this.setState({ replyComment: "", replyingTo: null });
    }
  };

  renderCommentItem = (message, isReply = false) => {
    const { replyingTo, replyComment } = this.state;
    const isLoggedIn = Boolean(sessionStorage.token);

    return (
      <article
        className={`comment ${isReply ? "comment-reply" : "comment-root"}`}
        style={{
          marginLeft: isReply ? "50px" : "0",
          borderLeft: isReply ? "2px solid #eee" : "none",
          paddingLeft: isReply ? "15px" : "0",
          marginTop: isReply ? "15px" : "0"
        }}
      >
        <a className="comment-img" href={`/profile/${message.author.username}`}>
          <img
            src={
              message.author.image ||
              getDefaultAvatar(message.author.username || "User")
            }
            alt=""
            width="50"
            height="50"
          />
        </a>
        <div className="comment-body">
          <div className="text">
            <p>{message.body}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <p className="attribution" style={{ margin: "4px 0" }}>
              by <a href={`/profile/${message.author.username}`}>{message.author.username}</a> at {moment(message.createdAt).format(
                "h:mm:ss a [on] MMMM Do YYYY."
              )}
            </p>
            {!isReply && isLoggedIn && (
              <Button 
                size="small" 
                onClick={() => this.setState({ replyingTo: replyingTo === message.id ? null : message.id })}
                sx={{
                  textTransform: "none",
                  color: "#03a9f4",
                  fontWeight: 600,
                  minWidth: "auto",
                  padding: "2px 8px",
                  fontSize: { xs: "12px", sm: "13px" }
                }}
              >
                {replyingTo === message.id ? "Cancel" : "Reply"}
              </Button>
            )}
          </div>
          
          {replyingTo === message.id && (
             <form onSubmit={(e) => this.handleReplySubmit(e, message.id)} style={{ marginTop: "12px", width: "100%" }}>
                <Stack spacing={1} direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "flex-start" }}>
                  <TextField
                    name="replyComment"
                    placeholder="Write a reply..."
                    size="small"
                    value={replyComment}
                    onChange={this.handleOnChange}
                    multiline
                    minRows={2}
                    fullWidth
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "#03a9f4",
                      color: "#fff",
                      textTransform: "none",
                      height: { xs: "36px", sm: "40px" },
                      padding: "4px 16px",
                      fontWeight: "bold",
                      alignSelf: { xs: "stretch", sm: "flex-start" }
                    }}
                  >
                    Post
                  </Button>
                </Stack>
             </form>
          )}
        </div>
      </article>
    );
  };

  render() {
    const { commentsMessage, commentsLoading } = this.props;
    const { visibleCount } = this.state;
    const isLoggedIn = Boolean(sessionStorage.token);

    let commentsContent;
    if (commentsLoading) {
      commentsContent = (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
          <ThreeDots color="#03a9f4" height={50} width={50} />
        </div>
      );
    } else if (commentsMessage && commentsMessage.length > 0) {
      const topLevelComments = commentsMessage.filter(c => c.parentId === 0);
      const childComments = commentsMessage.filter(c => c.parentId !== 0);
      
      const slicedComments = topLevelComments.slice(0, visibleCount);
      
      const commentItems = slicedComments.map(message => (
        <section className="comments" key={message.id}>
          {this.renderCommentItem(message, false)}
          {childComments.filter(c => c.parentId === message.id).map(reply => (
            <div key={reply.id}>
              {this.renderCommentItem(reply, true)}
            </div>
          ))}
        </section>
      ));

      const hasMore = topLevelComments.length > visibleCount;

      commentsContent = (
        <div>
          {commentItems}
          {!isLoggedIn && hasMore && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => this.setState(prev => ({ visibleCount: prev.visibleCount + 5 }))}
                sx={{ textTransform: "none", borderRadius: "20px", fontWeight: "bold" }}
              >
                Show More
              </Button>
            </div>
          )}
        </div>
      );
    } else {
      commentsContent = (
        <div style={{ textAlign: "center", color: "#666", padding: "30px 10px", fontSize: "14px", fontStyle: "italic" }}>
          No comments yet. Be the first to share your thoughts!
        </div>
      );
    }

    return (
      <div className="row comments-row">
        <div className="col-lg-1 d-none d-lg-block" />
        <div className="col-12 col-lg-10">
          <div className="row comment-input-row" style={{ marginBottom: "24px" }}>
            <div className="col-lg-1 d-none d-lg-block" />
            <div className="col-12 col-lg-11">
              {!isLoggedIn ? (
                <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px", border: "1px dashed #ced4da", textAlign: "center", margin: "10px 0 20px" }}>
                  <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#495057", fontWeight: "500" }}>Sign in to participate in the discussion.</p>
                  <Link to="/login" className="btn btn-primary btn-sm" style={{ textDecoration: "none", color: "#fff", padding: "6px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold" }}>Sign In</Link>
                </div>
              ) : (
                <form
                  method="POST"
                  onSubmit={this.handleOnSubmit}
                  className="comment-forms"
                >
                  <Stack spacing={1.5} sx={{ alignItems: { xs: "stretch", sm: "flex-end" }, width: "100%" }}>
                    <TextField
                      name="comments"
                      label="Add a comment"
                      value={this.state.comments}
                      onChange={this.handleOnChange}
                      multiline
                      minRows={4}
                      fullWidth
                    />
                    <Button
                      type="submit"
                      className="btn btn-comment"
                      variant="contained"
                      sx={{
                        backgroundColor: "#03a9f4",
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: "bold",
                        width: { xs: "100%", sm: "auto" },
                        "&:hover": { backgroundColor: "#0288d1" }
                      }}
                    >
                      Comment
                    </Button>
                  </Stack>
                </form>
              )}
            </div>
          </div>
          {commentsContent}
        </div>
        <div className="col-lg-1 d-none d-lg-block" />
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  commentsSuccess: state.comments.success,
  commentsErrors: state.comments.errors,
  commentsMessage: state.getComments.comments,
  commentsLoading: state.getComments.loading
});

export default connect(
  mapStateToProps,
  { articleComments, fetchComments }
)(Comments);

