export function TextSettingsPanel({
  textColor,
  setTextColor,
  textSize,
  setTextSize,
}: {
  textColor: string;
  setTextColor: (color: string) => void;
  textSize: number;
  setTextSize: (size: number) => void;
}) {
  return (
    <div
      className="text-black"
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 50,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 180,
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ minWidth: 60 }}>Color:</span>
        <input
          type="color"
          value={textColor}
          onChange={e => setTextColor(e.target.value)}
          style={{ width: 32, height: 32, border: "none", background: "none" }}
        />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ minWidth: 60 }}>Size:</span>
        <input
          type="number"
          min={10}
          max={72}
          value={textSize}
          onChange={e => setTextSize(Number(e.target.value))}
          style={{ width: 60 }}
        />
        <span>px</span>
      </label>
    </div>
  );
}
