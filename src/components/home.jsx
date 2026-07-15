import React, { Component } from "react";
import { connect } from "react-redux";
import "../styles/app.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import { getArticlesAction } from "../actions/getArticles";
import { getHomeArticlesAction } from "../actions/homeArticlesActions";

const FALLBACK_IMAGE =
  "https://previews.123rf.com/images/twindesigner/twindesigner1708/twin" +
  "designer170800135/84202763-ah-brush-letter-logo-design-with-black-" +
  "circle-creative-brushed-letters-icon-logo-.jpg";

const reactionSummary = article => {
  const breakdown =
    (article.reactions && article.reactions.breakdown) || [];
  return breakdown
    .filter(item => item.count > 0)
    .slice(0, 3)
    .map(item => `${item.emoji} ${item.count}`)
    .join("  ");
};

export class Home extends Component {
  constructor(props) {
    super(props);
    this.fetchNext = this.fetchNext.bind(this);
    this.fetchPrevious = this.fetchPrevious.bind(this);
  }
  componentDidMount() {
    const { getArticlesAction, getHomeArticlesAction } = this.props;
    getArticlesAction();
    if (getHomeArticlesAction) {
      getHomeArticlesAction();
    }
  }
  fetchNext() {
    const { next, getArticlesAction } = this.props;
    getArticlesAction(next);
  }
  fetchPrevious() {
    const { previous, getArticlesAction } = this.props;
    getArticlesAction(previous);
  }

  renderArticleCard(article) {
    const reactions = reactionSummary(article);
    return (
      <div className="article" key={article.slug}>
        <div className="inner">
          <Link
            className="links"
            to={{
              pathname: "/article/" + article.slug
            }}
          >
            <div className="article-card">
              <h3>{article.title.substring(0, 30)} ...</h3>
              <p>
                <b>{article.description.substring(0, 60)} ...</b>
              </p>
              <span>
                <b>Author: {article.author.username}</b>
              </span>
              <br />

              <span className="card-date">
                Created at{" "}
                {moment(article.createdAt).format(
                  "h:mm:ss a [on] MMMM Do YYYY."
                )}
              </span>
              <br />
              <p>
                <b>{article.reading_time}</b>
              </p>
              {reactions && (
                <p className="card-reactions">{reactions}</p>
              )}
            </div>

            <div>
              <img
                src={article.image ? article.image : FALLBACK_IMAGE}
                className="img-tile"
              />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  renderHero(article) {
    if (!article) {
      return null;
    }
    return (
      <div className="best-article">
        <div className="inner">
          <Link
            className="links"
            to={{
              pathname: "/article/" + article.slug
            }}
          >
            <img
              src={article.image ? article.image : FALLBACK_IMAGE}
              className="img-top"
            />
            <div className="inner">
              <div className="inner">
                <div className="best-article-card">
                  <h3>{article.title}</h3>
                  <span>
                    <b>Author: {article.author.username}</b>
                  </span>
                  <br />
                  <span className="card-date">
                    Created {moment(article.createdAt).fromNow()} —{" "}
                    {article.reading_time}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div />
      </div>
    );
  }

  render() {
    const {
      articles,
      latest = [],
      trending = [],
      popular = []
    } = this.props;
    const articleList = articles.length ? (
      articles.map(article => this.renderArticleCard(article))
    ) : (
      <div>No Articles in Authors Haven Yet</div>
    );
    const heroArticle = latest[0];
    const recentArticles = latest
      .slice(1)
      .map(article => this.renderArticleCard(article));
    const trendingList = trending.length
      ? trending.map(article => this.renderArticleCard(article))
      : articleList;
    const popularList = popular.length
      ? popular.map(article => this.renderArticleCard(article))
      : articleList;

    return (
      <div className="big-container">
        <div className="articles-top">
          {this.renderHero(heroArticle)}
          <div className="top-articles">{recentArticles}</div>
        </div>

        <div className="articles">
          <div className="heading">
            <h3>Trending Articles</h3>
          </div>
          <hr />
          {trendingList}
        </div>
        <div className="articles1">
          <div className="heading">
            <h3>Popular Articles</h3>
          </div>
          <hr />
          {popularList}
        </div>
        <div className="articles">
          <div className="heading">
            <h3>All Articles</h3>
          </div>
          <hr />
          {articleList}
        </div>
        <div>
          <button
            className="btn btn-outline-success btn eian"
            onClick={() => this.fetchPrevious()}
          >
            Previous
          </button>{" "}
          <button
            className="btn btn-outline-success btn aken"
            onClick={() => this.fetchNext()}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  articles: state.getArticlesReducer.articles,
  next: state.getArticlesReducer.next,
  previous: state.getArticlesReducer.previous,
  latest: state.homeArticlesReducer.latest,
  trending: state.homeArticlesReducer.trending,
  popular: state.homeArticlesReducer.popular
});

export default connect(
  mapStateToProps,
  { getArticlesAction, getHomeArticlesAction }
)(Home);
