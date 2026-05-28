import React from "react";

export default function WishlistModal({ wishlist, onClose, navigate }) {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          width: "90vw",
          maxWidth: "700px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid #222",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#f59e0b" }}>
              <path d="M19,3H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z"/>
            </svg>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "-0.01em" }}>
              Wishlist
            </span>
            {wishlist.length > 0 && (
              <span style={{ fontSize: "11px", color: "#555", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "1px 7px" }}>
                {wishlist.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#555",
              fontSize: "18px",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: "4px",
              lineHeight: 1,
              transition: "color 0.15s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#e0e0e0"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", padding: "16px 20px", flex: 1 }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#333" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: "12px", opacity: 0.4 }}>
                <path d="M19,3H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z"/>
              </svg>
              <p style={{ margin: 0, fontSize: "13px" }}>Wishlist je prazna</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "10px"
            }}>
              {wishlist.map(game => (
                <div
                  key={game.id}
                  onClick={() => { navigate(`/game/${game.id}`); onClose(); }}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #222",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "border-color 0.15s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#f59e0b"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
                >
                  <img
                    src={game.slika_url}
                    alt={game.naziv}
                    style={{ width: "100%", height: "110px", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#e0e0e0", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {game.naziv}
                    </div>
                    <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {game.zanr}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
