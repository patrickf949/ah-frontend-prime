import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { API_BASE_URL } from "../../config/api";
import "../../styles/app.scss";
import { ThreeDots } from "react-loader-spinner";

const FALLBACK_IMAGE =
  "https://previews.123rf.com/images/twindesigner/twindesigner1708/twin" +
  "designer170800135/84202763-ah-brush-letter-logo-design-with-black-" +
  "circle-creative-brushed-letters-icon-logo-.jpg";

export default class FavoritesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reactions: [],
      activeTab: "",
      error: null
    };
  }

  componentDidMount() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
      return;
    }
    this.fetchReactedArticles(token);
  }

  fetchReactedArticles = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/articles/reacted/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({
        reactions: response.data,
        loading: false
      }, () => {
        // Automatically select the first tab
        const tabs = this.getSortedTabs();
        if (tabs.length > 0) {
          this.setState({ activeTab: tabs[0].reaction });
        }
      });
    } catch (err) {
      this.setState({
        error: "Failed to load your reacted articles. Please try again.",
        loading: false
      });
    }
  };

  getSortedTabs = () => {
    const { reactions } = this.state;
    const counts = {};
    const grouped = {};

    reactions.forEach(r => {
      counts[r.reaction] = (counts[r.reaction] || 0) + 1;
      if (!grouped[r.reaction]) {
        grouped[r.reaction] = {
          reaction: r.reaction,
          emoji: r.emoji,
          articles: []
        };
      }
      if (!grouped[r.reaction].articles.some(a => a.slug === r.article.slug)) {
        grouped[r.reaction].articles.push(r.article);
      }
    });

    const tabs = Object.values(grouped);
    tabs.sort((a, b) => {
      if (a.reaction === "dislike") return 1;
      if (b.reaction === "dislike") return -1;
      return counts[b.reaction] - counts[a.reaction];
    });

    return tabs;
  };

  renderArticleCard(article) {
    const breakdown = (article.reactions && article.reactions.breakdown) || [];
    const reactionSummary = breakdown
      .filter(item => item.count > 0)
      .slice(0, 3)
      .map(item => `${item.emoji} ${item.count}`)
      .join("  ");

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
              {reactionSummary && (
                <>
                  <span className="divider" />
                  <span className="card-reactions reactions">{reactionSummary}</span>
                </>
              )}
            </div>
          </div>
          <img
            src={article.image ? article.image : FALLBACK_IMAGE}
            className="img-tile"
            alt="article thumbnail"
          />
        </Link>
      </div>
    );
  }

  render() {
    const { loading, error, activeTab } = this.state;

    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <ThreeDots color="var(--accent-color)" height={80} width={80} />
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "red" }}>
          <h4>Error</h4>
          <p>{error}</p>
        </div>
      );
    }

    const tabs = this.getSortedTabs();

    if (tabs.length === 0) {
      return (
        <div className="big-container" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "16px" }}>Your Favorites & Preferences</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "480px" }}>
            You haven't reacted to any articles yet! Start exploring and react to stories to build your personalized preferences here.
          </p>
          <Link to="/" className="btn" style={{ marginTop: "24px", backgroundColor: "var(--accent-color)", color: "white", borderRadius: "30px", padding: "10px 24px" }}>
            Browse Stories
          </Link>
        </div>
      );
    }

    const selectedTab = tabs.find(t => t.reaction === activeTab) || tabs[0];
    const displayReactionName = selectedTab.reaction.charAt(0).toUpperCase() + selectedTab.reaction.slice(1);

    return (
      <div className="big-container" style={{ padding: "40px 24px" }}>
        <header style={{ marginBottom: "32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)" }}>Your Favorites & Preferences</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginTop: "8px" }}>
            Explore the stories you have reacted to, grouped by your interaction preferences.
          </p>
        </header>

        {/* Tab switch bar */}
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "16px", borderBottom: "1px solid var(--border-color)", marginBottom: "32px" }}>
          {tabs.map(t => {
            const isActive = t.reaction === activeTab;
            const name = t.reaction.charAt(0).toUpperCase() + t.reaction.slice(1);
            return (
              <button
                key={t.reaction}
                onClick={() => this.setState({ activeTab: t.reaction })}
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: isActive ? "var(--accent-color)" : "#f1f5f9",
                  color: isActive ? "white" : "var(--text-secondary)",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap",
                  transition: "var(--transition-base)"
                }}
              >
                <span>{t.emoji}</span>
                <span>{name}s</span>
                <span style={{
                  fontSize: "12px",
                  backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                  padding: "2px 8px",
                  borderRadius: "10px"
                }}>
                  {t.articles.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected reaction results */}
        <div className="all-articles-section">
          <div className="heading" style={{ marginBottom: "24px" }}>
            <h3>Reacted with {selectedTab.emoji} {displayReactionName}s</h3>
          </div>
          <div className="all-stories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {selectedTab.articles.map(article => this.renderArticleCard(article))}
          </div>
        </div>
      </div>
    );
  }
}
