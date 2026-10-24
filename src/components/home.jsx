import React, { Component } from "react";
import { connect } from "react-redux";
import "../styles/app.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import { getArticlesAction } from "../actions/getArticles";
import { getHomeArticlesAction } from "../actions/homeArticlesActions";
import { API_BASE_URL } from "../config/api";
import { ThreeDots } from "react-loader-spinner";

import { FALLBACK_IMAGE } from "../utils/constants";
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
    this.allArticlesRef = React.createRef();
  }

  scrollToResults = () => {
    setTimeout(() => {
      if (this.allArticlesRef.current) {
        this.allArticlesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  componentDidMount() {
    const { getArticlesAction, getHomeArticlesAction } = this.props;
    const searchParams = new URLSearchParams(this.props.location?.search || "");
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      getArticlesAction(API_BASE_URL + "/articles/?search=" + encodeURIComponent(searchQuery));
      this.scrollToResults();
    } else {
      getArticlesAction();
    }
    if (getHomeArticlesAction) {
      getHomeArticlesAction();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location?.search !== prevProps.location?.search) {
      const { getArticlesAction } = this.props;
      const searchParams = new URLSearchParams(this.props.location?.search || "");
      const searchQuery = searchParams.get("search");
      if (searchQuery) {
        getArticlesAction(API_BASE_URL + "/articles/?search=" + encodeURIComponent(searchQuery));
        this.scrollToResults();
      } else {
        getArticlesAction();
      }
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
      <div className="article-card-row" key={article.slug}>
        <Link
          className="links"
          to={{
            pathname: "/article/" + article.slug
          }}
        >
          <div className="article-card-info">
            <h3>{article.title.length > 55 ? article.title.substring(0, 55) + "..." : article.title}</h3>
            <p className="desc">
              {article.description.length > 90 ? article.description.substring(0, 90) + "..." : article.description}
            </p>
            <div className="meta">
              <span className="author-name">by {article.author.username}</span>
              <span className="divider" />
              <span className="read-time">{article.reading_time}</span>
              {reactions && (
                <>
                  <span className="divider" />
                  <span className="card-reactions reactions">{reactions}</span>
                </>
              )}
            </div>
          </div>
          <img
            src={article.image ? article.image : FALLBACK_IMAGE}
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
            className="img-tile"
            alt="authors haven"
          /> 
        </Link>
      </div>
    );
  }

  renderHero(article) {
    if (!article) {
      return null;
    }
    const heroReactions = reactionSummary(article);
    return (
      <div className="best-article">
        <Link
          className="links"
          to={{
            pathname: "/article/" + article.slug
          }}
        >
          <img
            src={article.image ? article.image : FALLBACK_IMAGE}
            className="img-top"
            alt="featured article"
          />
          <div className="best-article-card">
            <h3>{article.title}</h3>
            <p className="desc" style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "8px 0 16px 0", lineHeight: "1.6" }}>
              {article.description && article.description.length > 160
                ? article.description.substring(0, 160) + "..."
                : article.description}
            </p>
            <span className="card-author">
              by <b>{article.author.username}</b>
            </span>
            <span className="card-date">
              Created {moment(article.createdAt).fromNow()} — {article.reading_time}
              {heroReactions && (
                <>
                  {" — "}
                  <span className="card-reactions reactions">{heroReactions}</span>
                </>
              )}
            </span>
          </div>
        </Link>
      </div>
    );
  }

  render() {
    const {
      articles,
      latest = [],
      trending = [],
      popular = [],
      loading = false
    } = this.props;

    if (loading && (!articles || articles.length === 0)) {
      return (
        <div className="big-container">
          <div
            className="articles-loader"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "55vh",
              gap: "12px"
            }}
          >
            <ThreeDots color="#03a9f4" height={80} width={80} />
            <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
              Loading stories, please wait...
            </p>
          </div>
        </div>
      );
    }

    const searchParams = new URLSearchParams(this.props.location?.search || "");
    const searchQuery = searchParams.get("search");

    const articleList = loading ? (
      <div
        className="articles-loader"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "260px",
          gridColumn: "1/-1",
          gap: "12px",
          padding: "40px"
        }}
      >
        <ThreeDots color="#03a9f4" height={60} width={60} />
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
          Loading stories, please wait...
        </p>
      </div>
    ) : articles.length ? (
      articles.map(article => this.renderArticleCard(article))
    ) : (
      <div style={{ textAlign: "center", color: "#64748b", gridColumn: "1/-1", padding: "40px" }}>
        {searchQuery ? `No articles match the query "${searchQuery}".` : "No Articles in Authors Haven Yet"}
      </div>
    );

    const heroArticle = latest.length ? (trending.length ? trending[0] : latest[0]) : null;

    const recentArticles = latest
      .filter(article => !heroArticle || article.slug !== heroArticle.slug)
      .slice(0, 4)
      .map(article => this.renderArticleCard(article));

    const trendingList = trending.length
      ? trending
          .filter(article => !heroArticle || article.slug !== heroArticle.slug)
          .slice(0, 3)
          .map(article => this.renderArticleCard(article))
      : articles
          .filter(article => !heroArticle || article.slug !== heroArticle.slug)
          .slice(0, 3)
          .map(article => this.renderArticleCard(article));

    const popularList = popular.length
      ? popular
          .filter(article => !heroArticle || article.slug !== heroArticle.slug)
          .slice(0, 3)
          .map(article => this.renderArticleCard(article))
      : articles
          .filter(article => !heroArticle || article.slug !== heroArticle.slug)
          .slice(0, 3)
          .map(article => this.renderArticleCard(article));

    const hasPrevious = Boolean(this.props.previous);
    const hasNext = Boolean(this.props.next);

    return (
      <div className="big-container">
        {/* Top Hero Layout */}
        <div className="articles-top">
          {this.renderHero(heroArticle)}
          <div className="top-articles">
            <div className="heading" style={{ margin: "0 0 16px 0" }}>
              <h3>Latest Stories</h3>
            </div>
            {recentArticles.length > 0 ? recentArticles : <div style={{ color: "#64748b" }}>No other recent articles.</div>}
          </div>
        </div>

        {/* Featured side-by-side grids */}
        <div className="featured-sections">
          <div className="articles">
            <div className="heading">
              <h3>Trending Articles</h3>
            </div>
            {trendingList}
          </div>
          <div className="articles1">
            <div className="heading">
              <h3>Popular Articles</h3>
            </div>
            {popularList}
          </div>
        </div>

        {/* Explore section with all articles in clean grid */}
        <div className="all-articles-section" ref={this.allArticlesRef}>
          <div className="heading">
            {searchQuery ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%", flexWrap: "wrap", gap: "12px" }}>
                <h3>Search Results for "{searchQuery}"</h3>
                <Link to="/" style={{ fontSize: "14px", color: "var(--accent-color)", fontWeight: "600" }}>Clear search</Link>
              </div>
            ) : (
              <h3>Explore Stories</h3>
            )}
          </div>
          <div className="all-stories-grid">
            {articleList}
          </div>
          <div className="articles-pagination" aria-label="Article pagination">
            <button
              type="button"
              className="pagination-button eian"
              disabled={!hasPrevious || loading}
              onClick={() => this.fetchPrevious()}
            >
              Previous
            </button>
            <button
              type="button"
              className="pagination-button aken"
              disabled={!hasNext || loading}
              onClick={() => this.fetchNext()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  articles: state.getArticlesReducer.articles,
  loading: state.getArticlesReducer.loading,
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
