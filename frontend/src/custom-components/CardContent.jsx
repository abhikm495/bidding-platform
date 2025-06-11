import React from "react";
import { Spinner } from "reactstrap";

const CardContent = ({
  title,
  count,
  icon: Icon,
  loading,
  description, // New description prop
  color = {
    backGround: "#e4de89",
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
  },
}) => {
  return (
    <div
      className="position-relative p-4 rounded-3 cursor-pointer"
      style={{
        width: "100%",
        height: "100%", // Fixed height for all cards
        background: color.backGround,
        boxShadow: color.boxShadow,
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "none")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = color.boxShadow)}
    >
      <div className="row h-100">
        {/* Left section with icon */}
        <div className="col-4 d-flex justify-content-center align-items-center h-100">
          {Icon && (
            <img
              src={Icon}
              alt={title}
              style={{
                width: "20%",
                height: "20%",
                objectFit: "contain",
                filter: "drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.7))",
              }}
            />
          )}
        </div>

        {/* Right section with title, description, and count */}
        <div className="col-8 d-flex flex-column justify-content-between h-100 py-2">
          <div className="text-end" style={{ minHeight: "60px" }}>
            {/* Added minHeight for title area */}
            <h2
              className="text-white mb-0"
              style={{
                fontSize: "1.5rem",
                lineHeight: "1.2",
                wordWrap: "break-word",
                hyphens: "auto",
                textShadow: "0px 0px 5px rgba(255, 255, 255, 0.7)",
                marginBottom:"10px"
              }}
            >
              {title}
            </h2>
            {description && ( // Render description if it exists
              <p
                className="text-white mb-0"
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.2",
                  wordWrap: "break-word",
                  hyphens: "auto",
                  textShadow: "0px 0px 3px rgba(255, 255, 255, 0.5)",
                }}
              >
                {description}
              </p>
            )}
          </div>

          <div className="text-end mt-auto">
            {/* Added mt-auto to push count to bottom */}
            <div
              className="text-white fw-bold"
              style={{
                fontSize: "3rem",
                textShadow: "0px 0px 8px rgba(255, 255, 255, 0.7)",
              }}
            >
              {loading ? <Spinner color="light" size="sm" /> : count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardContent;
