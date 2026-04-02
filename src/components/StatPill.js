import styles from "../styles/theme";

function StatPill({ label, value, icon }) {
  return (
    <div style={styles.statPill}>
      <span style={styles.statIcon}>{icon}</span>
      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}

export default StatPill;