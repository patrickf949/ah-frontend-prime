import React from "react";
import "../styles/about.scss";

export const contributors = [
  {
    name: "PATRICK FITZ",
    handle: "patrickf949",
    role: "Software Engineer",
    bio: "Software developer passionate about scalable web platforms and AI-driven systems.",
    avatar: "https://avatars.githubusercontent.com/u/43245704?v=4",
    github: "https://github.com/patrickf949"
  },
  {
    name: "David Muhanguzi",
    handle: "MuhanguziDavid",
    role: "Full-Stack Software Engineer",
    bio: "Full-stack software engineer crafting robust user-facing applications.",
    avatar: "https://avatars.githubusercontent.com/u/38077368?v=4",
    github: "https://github.com/MuhanguziDavid"
  },
  {
    name: "Kisekka David",
    handle: "Genza999",
    role: "Software Engineer",
    bio: "Software Engineer | Pythonista | Django enthusiast.",
    avatar: "https://avatars.githubusercontent.com/u/26630001?v=4",
    github: "https://github.com/Genza999"
  },
  {
    name: "Brian Anyati",
    handle: "anyatibrian",
    role: "Software Developer",
    bio: "Software developer from Uganda, thinking in cognito.",
    avatar: "https://avatars.githubusercontent.com/u/18057325?v=4",
    github: "https://github.com/anyatibrian"
  },
  {
    name: "Emmanuel Ian",
    handle: "e-ian",
    role: "Software Engineer",
    bio: "Luck is a function of intent! Building impactful technology.",
    avatar: "https://avatars.githubusercontent.com/u/36891299?v=4",
    github: "https://github.com/e-ian"
  },
  {
    name: "Elton Maiyo",
    handle: "eltronix",
    role: "Software Engineer",
    bio: "Passionate software engineer building resilient web and cloud backends.",
    avatar: "https://avatars.githubusercontent.com/u/4558078?v=4",
    github: "https://github.com/eltronix"
  },
  {
    name: "Ephraim Malinga",
    handle: "malep2007",
    role: "Software Developer",
    bio: "Software developer passionate about solving problems with technology.",
    avatar: "https://avatars.githubusercontent.com/u/17592399?v=4",
    github: "https://github.com/malep2007"
  },
  {
    name: "Ogilo",
    handle: "Ogilo",
    role: "Software Engineer",
    bio: "Engineer contributing to authentication and system architecture.",
    avatar: "https://avatars.githubusercontent.com/u/80688520?v=4",
    github: "https://github.com/Ogilo"
  }
];

export const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <span className="about-badge">About Authors Haven</span>
        <h1>A Social Haven for the Creative at Heart</h1>
        <p className="about-lead">
          Authors Haven is a modern publishing platform where writers, thinkers, and
          creatives come together to share stories, exchange feedback, and cultivate
          meaningful conversations.
        </p>
      </div>

      <div className="about-story-card">
        <h2>Our Origin</h2>
        <p>
          Authors Haven was originally conceived and built in <strong>2019</strong> as
          part of a collaborative simulation project while at{" "}
          <span className="andela-highlight">Andela</span>. The goal was to build a
          production-grade, full-stack publishing ecosystem from scratch with high
          test coverage, modern architecture, and an intuitive reading and writing
          experience.
        </p>
        <p>
          Today, the project has been updated and modernized with contemporary web standards,
          serverless deployments, responsive design, and robust security.
        </p>
      </div>

      <div className="about-team-section">
        <div className="team-heading">
          <h2>Contributors & Dev Team</h2>
          <p>
            The developers who contributed to bringing Authors Haven to life as part of a
            collaborative simulation project while at{" "}
            <a
              href="https://andela.com"
              target="_blank"
              rel="noopener noreferrer"
              className="andela-link"
            >
              Andela
            </a>{" "}
            in 2019.
          </p>
        </div>

        <div className="team-grid">
          {contributors.map(member => (
            <div
              key={member.handle}
              className="contributor-card"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="avatar"
                onError={e => {
                  e.target.src = "https://img.icons8.com/color/96/000000/user.png";
                }}
              />
              <h3>{member.name}</h3>
              <span className="handle">@{member.handle}</span>
              <span className="role">{member.role}</span>
              <p className="bio">{member.bio}</p>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                GitHub Profile ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
