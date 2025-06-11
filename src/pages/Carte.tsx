import React from "react";

const Carte: React.FC = () => {
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0f2fe 0%, #fce4ec 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    },
    textCenter: {
      textAlign: "center" as const,
    },
    card: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      padding: "48px",
      maxWidth: "672px",
      margin: "0 auto",
      borderTop: "8px solid var(--primary-blue, #1976d2)",
    },
    iconContainer: {
      display: "inline-block",
      padding: "16px",
      backgroundColor: "rgba(233, 30, 99, 0.1)",
      borderRadius: "50%",
      marginBottom: "24px",
    },
    icon: {
      width: "64px",
      height: "64px",
      color: "var(--primary-blue, #1976d2)",
    },
    mainTitle: {
      fontSize: "48px",
      fontWeight: "bold",
      color: "#374151",
      marginBottom: "16px",
      letterSpacing: "-0.025em",
    },
    accentTitle: {
      fontSize: "48px",
      fontWeight: "bold",
      color: "var(--primary-pink, #e91e63)",
      marginBottom: "24px",
      letterSpacing: "-0.025em",
    },
    description: {
      color: "#6b7280",
      marginBottom: "16px",
    },
    subtitle: {
      fontSize: "20px",
      fontWeight: "500",
      marginBottom: "16px",
    },
    text: {
      fontSize: "18px",
      lineHeight: "1.6",
    },
    dotsContainer: {
      marginTop: "32px",
      display: "flex",
      justifyContent: "center",
    },
    dotsInner: {
      display: "flex",
      gap: "8px",
    },
    dot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      animation: "bounce 1s infinite",
    },
    dotBlue: {
      backgroundColor: "var(--primary-blue, #1976d2)",
    },
    dotPink: {
      backgroundColor: "var(--primary-pink, #e91e63)",
    },
    footer: {
      marginTop: "32px",
      fontSize: "14px",
      color: "#9ca3af",
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0,0,0);
            }
            40%, 43% {
              transform: translate3d(0,-30px,0);
            }
            70% {
              transform: translate3d(0,-15px,0);
            }
            90% {
              transform: translate3d(0,-4px,0);
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.textCenter}>
          <div style={styles.card}>
            <div style={{ marginBottom: "32px" }}>
              <div style={styles.iconContainer}>
                <svg
                  style={styles.icon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
                  ></path>
                </svg>
              </div>
              <h1 style={styles.mainTitle}>EN COURS DE</h1>
              <h1 style={styles.accentTitle}>DÉVELOPPEMENT</h1>
            </div>

            <div style={styles.description}>
              <p style={styles.subtitle}>
                La page <strong>[CARTE]</strong> arrive bientôt !
              </p>
            </div>

            <div style={styles.dotsContainer}>
              <div style={styles.dotsInner}>
                <div style={{ ...styles.dot, ...styles.dotBlue }}></div>
                <div
                  style={{
                    ...styles.dot,
                    ...styles.dotPink,
                    animationDelay: "0.1s",
                  }}
                ></div>
                <div
                  style={{
                    ...styles.dot,
                    ...styles.dotBlue,
                    animationDelay: "0.2s",
                  }}
                ></div>
              </div>
            </div>

            <div style={styles.footer}>
              <p>Merci pour votre patience !</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carte;
