import { API_BASE_URL } from "../../config/api";
import React, { Component } from "react";
import { connect } from "react-redux";
import "../../styles/app.scss";
import moment from "moment";
import { withRouter } from "../../utils/router";
import { getArticlesAction } from "../../actions/getArticles";
import { deleteArticleAction } from "../../actions/deleteArticleAction";
import { Link } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { FALLBACK_IMAGE } from "../../utils/constants";

export class UserArticles extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getArticlesAction(
      API_BASE_URL + "/articles/" +
        "?email=" +
        sessionStorage.getItem("email")
    );
  }
  deleteArticle(slug) {
    this.props.deleteArticleAction(slug, this.props);
  }
  render() {
    const { articles, loading } = this.props;
    const articleList =
      loading && (!articles || !articles.length) ? (
        <div
          className="user-articles-loader"
          style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "35vh" }}
        >
          <ThreeDots color="#03a9f4" height={80} width={80} />
        </div>
      ) : articles && articles.length ? (
        articles.map(article => {
          return (
            <div className="article" key={article.slug}>
              <div className="inner">
                <Link to={"/article/" + article.slug}>
                  <div className="article-card">
                    <h3>{article.title.substring(0, 30)} ...</h3>
                    <p>
                      <b>{article.description.substring(0, 60)} ...</b>
                    </p>
                    <p>{article.body.substring(0, 60)} ...</p>
                    <span>
                      <b>Author: {article.author.username}</b>
                    </span>
                    <br />
                    <span className="card-date">
                      Created at{" "}
                      {moment(article.createdAt).format(
                        "HH:MM:SS [on] MMMM Do YYYY."
                      )}
                    </span>
                  </div>
                  <div className="img-div">
                    <img
                      src={article.image ? article.image : FALLBACK_IMAGE}
                      onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                      className="img-tile"
                    />
                  </div>
                </Link>
                <div className="action-buttons">
                  <Link
                    to={{
                      pathname: "/edit-article/" + article.slug
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    className="delete"
                    onClick={e => this.deleteArticle(article.slug)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>You have not yet created any articles sofar</div>
      );
    return (
      <div className="big-container">
        <div className="user-articles">
          <div className="heading">
            <h3>{sessionStorage.getItem("username")}'s articles</h3>
          </div>
          <hr />
          {articleList}
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  articles: state.getArticlesReducer.articles,
  loading: state.getArticlesReducer.loading
});

export default withRouter(
  connect(
    mapStateToProps,
    { getArticlesAction, deleteArticleAction }
  )(UserArticles)
);
