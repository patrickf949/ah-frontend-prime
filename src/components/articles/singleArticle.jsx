import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { withRouter } from "../../utils/router";
import FollowsButton from "../FollowsButton";
import { followUser, unfollowUser } from "../../actions/profileActions";
import { likeArticle, dislikeArticle } from "../../actions/LikeDislikeActions";
import { reactArticle } from "../../actions/reactionActions";
import { applyArticleSeo } from "../../utils/seo";
import { ThreeDots } from "react-loader-spinner";
import like from "../../styles/images/like.png";
import dislike from "../../styles/images/dislike.png";

import "../../styles/singleArticle.scss";
import { getArticleAction } from "../../actions/getArticle";
import Comments from "../comments";
import { FALLBACK_IMAGE } from "../../utils/constants";

export class SingleArticleComponent extends Component {
  state = {};
  componentDidMount() {
    this.props.getArticleAction(this.props.match.params.slug);
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.props.getArticleAction(this.props.match.params.slug);
    }
    
    // Apply SEO if article data changed
    const currentArticle = this.props.article?.article;
    const prevArticle = prevProps.article?.article;
    if (currentArticle?.seo && currentArticle !== prevArticle) {
      applyArticleSeo(currentArticle.seo);
    }
  }

  handleReact = reaction => {
    const { reactArticle } = this.props;
    const slug = this.props.match.params.slug;
    reactArticle(slug, reaction);
  };

  handlefollowUser = () => {
    const { followUser } = this.props;
    const username = sessionStorage.getItem("userview_name");
    followUser(username);
  };

  handlelike = () => {
    const { likeArticle } = this.props;
    const slug = this.props.match.params.slug;
    likeArticle(slug);
  };

  handledislike = () => {
    const { dislikeArticle } = this.props;
    const slug = this.props.match.params.slug;
    dislikeArticle(slug);
  };

  handleunfollowUser = () => {
    const { unfollowUser } = this.props;
    const username = sessionStorage.getItem("userview_name");
    unfollowUser(username);
  };

  isOwner = username =>
    username === sessionStorage.getItem("username") ? true : false;

  renderBody = (bodyString) => {
    if (!bodyString) return null;
    try {
      const blocks = JSON.parse(bodyString);
      if (Array.isArray(blocks)) {
        return blocks.map((block, index) => {
          if (block.type === "text") {
            return <div key={index} dangerouslySetInnerHTML={{ __html: block.content }} className="article-text-block" />;
          } else if (block.type === "image") {
            return (
              <div key={index} style={{ textAlign: "center", margin: "20px 0" }}>
                <img src={block.url} alt="Article visual" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "8px" }} />
              </div>
            );
          }
          return null;
        });
      }
    } catch (e) {
      return <p>{bodyString}</p>;
    }
    return <p>{bodyString}</p>;
  };

  render() {
    const { isfollowing, article, reactions, loading, likes, dislikes } = this.props;
    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <ThreeDots color="#03a9f4" height={80} width={80} />
        </div>
      );
    }
    const oneArticle = article ? article.article : null;
    const reactionBreakdown =
      (reactions && reactions.breakdown) ||
      (oneArticle && oneArticle.reactions && oneArticle.reactions.breakdown) ||
      [];
    const emojiBar = reactionBreakdown
      .filter(item => !["like", "dislike"].includes(item.reaction))
      .map(item => (
        <button
          key={item.reaction}
          type="button"
          className="emoji-btn"
          title={item.reaction}
          onClick={() => this.handleReact(item.reaction)}
        >
          <span className="emoji-icon">{item.emoji}</span>{" "}
          <span className="emoji-count">{item.count}</span>
        </button>
      ));
    const singleArticle = oneArticle ? (
      <div className="container article-page-container">
        <header className="article-header">
          <h1 className="article-title">{oneArticle.title}</h1>
          <div className="article-meta-bar">
            <div className="author-card">
              <img
                className="author-avatar"
                src={
                  oneArticle.author.image ||
                  "https://static.wixstatic.com/media/2cd43b_4ef9dc9638cc431b956e1c36862b519b~mv2.png?dn="
                }
                alt={oneArticle.author.username}
              />
              <div className="author-details">
                <span className="author-name">{oneArticle.author.username}</span>
                <span className="article-date">
                  Published {moment(oneArticle.createdAt).format("MMM D, YYYY")} · {oneArticle.reading_time}
                </span>
              </div>
            </div>
            <div className="author-action">
              {this.isOwner(oneArticle.author.username) ? (
                <Link to={`/edit-article/${oneArticle.slug}`} className="btn btn-outline-secondary edit-btn">
                  Edit Story
                </Link>
              ) : (
                <FollowsButton
                  followUser={this.handlefollowUser}
                  unfollowUser={this.handleunfollowUser}
                  isfollowing={isfollowing === "True" ? true : false}
                />
              )}
            </div>
          </div>
        </header>

        {oneArticle.image && (
          <div className="article-banner">
            <img
              src={oneArticle.image}
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
              className="article-image"
              alt="article cover"
            />
          </div>
        )}

        <article className="article-content">
          <p className="article-description">{oneArticle.description}</p>
          <div className="article-body">
            {this.renderBody(oneArticle.body)}
          </div>

          <div className="article-reactions-row">
            <button type="button" className="like-dislike-btn" onClick={this.handlelike} title="Like">
              <img src={like} alt="like" />
              <span>{likes}</span>
            </button>
            <button type="button" className="like-dislike-btn" onClick={this.handledislike} title="Dislike">
              <img src={dislike} alt="dislike" />
              <span>{dislikes}</span>
            </button>
            <span className="row-divider" />
            <div className="emoji-reaction-list reaction-bar">{emojiBar}</div>
          </div>

          <hr className="section-divider" />
          <Comments articleSlug={oneArticle.slug} />
        </article>
      </div>
    ) : (
      <div className="not-found">The article you have requested does not exist</div>
    );
    return <div>{singleArticle}</div>;
  }
}

export const mapStateToProps = state => ({
  article: state.getArticleReducer.article,
  isfollowing: state.profileReducer.isfollowing,
  likes: state.getArticleReducer.likes,
  dislikes: state.getArticleReducer.dislikes,
  reactions: state.getArticleReducer.reactions,
  loading: state.getArticleReducer.loading
});



export default withRouter(
  connect(
    mapStateToProps,
    {
      getArticleAction,
      followUser,
      unfollowUser,
      likeArticle,
      dislikeArticle,
      reactArticle
    }
  )(SingleArticleComponent)
);
