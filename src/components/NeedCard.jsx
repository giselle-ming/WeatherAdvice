import React from "react";

export default function NeedCard({ title, needed, note, emphasize }) {
  return (
    <div
      className={`needcard ${needed ? "needed" : "not-needed"} ${
        emphasize ? "emphasize" : ""
      }`}
    >
      <div className="leftcol">
        <div className="iconwrap">
          {title === "Umbrella" ? "☂️" : title === "Jacket" ? "🧥" : "🧤"}
        </div>
      </div>
      <div className="midcol">
        <div className="title">{title}</div>
        <div className="note">{note}</div>
        <div className="meta">
          {needed ? (
            <span className="pill required">REQUIRED</span>
          ) : (
            <span className="pill optional">OPTIONAL</span>
          )}
        </div>
      </div>
      <div className="rightcol">{needed && <div className="badge">✔</div>}</div>
    </div>
  );
}
