"use client";
import { useState } from "react";
import { Code2, Palette, Users } from "lucide-react";
import { bounties } from "@/data/bounties";
import { Button } from "@pearos/ui/button";

export function BuildBoard() {
  const [category, setCategory] = useState("All");
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">APPLES TO PEARS / COMMUNITY</p>
          <h1>Good things come in pears.</h1>
          <p className="muted">
            Small contributions. Useful tools. A better PearOS.
          </p>
        </div>
        <span className="count-label">{bounties.length} proposed builds</span>
      </div>
      <div className="build-intro">
        <div>
          <h2>Build Pear</h2>
          <p>
            Find a task that fits. Agree on the scope and reward with the
            project before starting.
          </p>
        </div>
        <span className="small">Proposed tasks · rewards are not funded</span>
      </div>
      <div className="filter-row" aria-label="Filter tasks">
        {["All", "Engineering", "Design", "Community"].map((value) => (
          <Button
            key={value}
            variant={category === value ? "default" : "outline"}
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="bounty-grid">
        {bounties
          .filter(
            (bounty) => category === "All" || bounty.category === category,
          )
          .map((bounty) => (
            <article className="bounty-card" key={bounty.id}>
              <div className="section-heading">
                <span className="bounty-icon">
                  {bounty.category === "Design" ? (
                    <Palette />
                  ) : bounty.category === "Community" ? (
                    <Users />
                  ) : (
                    <Code2 />
                  )}
                </span>
                <span className="status status-cached">{bounty.status}</span>
              </div>
              <span className="eyebrow">{bounty.category}</span>
              <h2>{bounty.title}</h2>
              <p>{bounty.description}</p>
              <div className="bounty-footer">
                <span>Reward</span>
                <strong>{bounty.reward}</strong>
              </div>
              {bounty.url && /^https:\/\//.test(bounty.url) && (
                <a
                  href={bounty.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  View project issue
                </a>
              )}
            </article>
          ))}
      </div>
      <p className="small muted board-note">
        Task status and agreed rewards are maintained by the project. This board
        does not issue tokens or promise payment.
      </p>
    </>
  );
}
