import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0A0A0F",
  surface: "#12121A",
  card: "#1A1A26",
  border: "#2A2A3E",
  accent: "#C8F135",
  accentDim: "#8FAD1F",
  accentSoft: "rgba(200,241,53,0.12)",
  text: "#F0F0F8",
  textMuted: "#7A7A9A",
  gradient: "linear-gradient(135deg, #C8F135 0%, #5AFFA0 100%)",
  danger: "#FF5C5C",
  info: "#5CC8FF",
};

const GOALS = [
  { id: "abs", icon: "◈", label: "קוביות בבטן" },
  { id: "vline", icon: "▽", label: "קו V" },
  { id: "glutes", icon: "⬟", label: "ישבן מודגש" },
  { id: "legs", icon: "⟡", label: "רגליים חטובות" },
  { id: "weightloss", icon: "↓", label: "ירידה במשקל" },
  { id: "strength", icon: "◉", label: "חיזוק הגוף" },
  { id: "flexibility", icon: "∿", label: "גמישות" },
  { id: "muscle", icon: "▲", label: "עלייה במסת שריר" },
];

const WORKOUT_TYPES = ["אימוני כוח", "אימוני בית", "חדר כושר", "אירובי", "חיטוב", "גמישות"];

// תרגילים בטוחים להריון בלבד — מאושרים קלינית
const PREGNANCY_EXERCISES = [
  {
    name: "הליכה בקצב נוח",
    sets: 1,
    reps: "20-30 דקות",
    muscle: "כל הגוף",
    difficulty: "קל",
    desc: "הליכה בקצב נוח ונוח בקצב שמאפשר לדבר בלי קוצר נשימה. עדיפות לשטח שטוח.",
    safe: true,
    tip: "✅ בטוח בכל שלב ההריון"
  },
  {
    name: "סקוואט עם כיסא",
    sets: 3,
    reps: "10-12",
    muscle: "ישבן + ירכיים + רצפת האגן",
    difficulty: "קל",
    desc: "עמדי ברגליים ברוחב קצת יותר מכתפיים, ברדת לסקוואט השען קלות על הכיסא מאחורייך. שמרי על הגב ישר ואל תכרעי מעבר לזווית 90°.",
    safe: true,
    tip: "✅ מחזק את רצפת האגן ומקל על לידה"
  },
  {
    name: "כריעת ברך על הרצפה (Bird-Dog)",
    sets: 3,
    reps: "8 לכל צד",
    muscle: "גב תחתון + בטן עמוקה + ישבן",
    difficulty: "קל",
    desc: "כרעי על ידיים וברכיים (טבלה). הארכי ביד ימין ורגל שמאל בו-זמנית, החזיקי 3 שניות, חזרי למרכז. שמרי גב ישר לכל אורך התרגיל.",
    safe: true,
    tip: "✅ מצוין לחיזוק הגב ומניעת כאבי גב בהריון"
  },
  {
    name: "גשר אגן שכוב",
    sets: 3,
    reps: "12",
    muscle: "ישבן + גב תחתון + רצפת האגן",
    difficulty: "קל",
    desc: "שכבי על הגב (מותר עד שבוע 20 בלבד לאחר מכן עברי לגרסת הצד). כפות הרגל על הרצפה, הרמי את האגן למעלה לאט, החזיקי 2 שניות, ירדי לאט.",
    safe: true,
    tip: "⚠️ מתאים עד שבוע 20. לאחר מכן — דלגי על תרגיל זה"
  },
  {
    name: "כריעה על צד (Side-lying Clamshell)",
    sets: 3,
    reps: "15 לכל צד",
    muscle: "ירכיים + ישבן + רצפת האגן",
    difficulty: "קל",
    desc: "שכבי על הצד עם ברכיים כפופות בזווית 45°. הרמי את הברך העליונה כמו פתיחת צדפה — מבלי לזוז גב. ירדי לאט. תרגיל זה בטוח גם בשלבים מאוחרים.",
    safe: true,
    tip: "✅ בטוח בכל שלבי ההריון"
  },
  {
    name: "תרגילי קיגל",
    sets: 3,
    reps: "10 כיווצים של 5 שניות",
    muscle: "רצפת האגן",
    difficulty: "קל",
    desc: "הדקי את שרירי רצפת האגן (כאילו את עוצרת שתן), החזיקי 5 שניות, שחררי לאט. ניתן לבצע בישיבה, שכיבה או עמידה. ממליצים לבצע כמה פעמים ביום.",
    safe: true,
    tip: "✅ חיוני להכנה ללידה ולהתאוששות לאחריה"
  },
  {
    name: "מתיחת שרירי החזה בדלת",
    sets: 3,
    reps: "30 שניות החזקה",
    muscle: "כתפיים + חזה + גב עליון",
    difficulty: "קל",
    desc: "עמדי בפתח דלת, הניחי אמות הידיים על המשקוף, הישעני קלות קדימה עד שתרגישי מתיחה בחזה ובכתפיים. נשמי עמוק ורגוע.",
    safe: true,
    tip: "✅ מקל על כאבי גב עליון שנפוצים בהריון"
  },
  {
    name: "שחייה / אירובי מים",
    sets: 1,
    reps: "20-30 דקות",
    muscle: "כל הגוף",
    difficulty: "קל",
    desc: "שחייה בקצב נוח או הליכה בבריכה. המים תומכים במשקל הגוף ומפחיתים עומס על המפרקים. אחד הספורטים הטובים ביותר בהריון.",
    safe: true,
    tip: "✅ מומלץ במיוחד בשלבים מאוחרים"
  },
];

const PREGNANCY_WARNINGS = [
  "❌ אין לבצע: תרגילים על הגב לאחר שבוע 20",
  "❌ אין לבצע: קפיצות, תנועות חדות או מהירות",
  "❌ אין לבצע: תרגילי בטן ישירים (כפיפות בטן, פלאנק ארוך)",
  "❌ אין לבצע: מאמץ גבוה שגורם לקוצר נשימה חמור",
  "❌ אין לבצע: תרגילים הגורמים ללחץ על הבטן",
  "⚠️ הפסיקי ופנייה לרופאה אם: כאב, דימום, סחרחורת או קוצר נשימה חריג",
];

const SAMPLE_EXERCISES = {
  abs: [
    { name: "פלאנק", sets: 3, reps: "45 שניות", muscle: "בטן", difficulty: "בינוני", desc: "שכבי/שכב עם משקל על קצות האצבעות ואמות הידיים, שמור/י על הגב ישר." },
    { name: "קראנצ'ים", sets: 3, reps: "20", muscle: "בטן עליונה", difficulty: "קל", desc: "שכבי/שכב על הגב, כף הידיים מאחורי הראש, הרם/י את הכתפיים." },
    { name: "רגליים למעלה-מטה", sets: 3, reps: "15", muscle: "בטן תחתונה", difficulty: "קשה", desc: "שכבי/שכב על הגב, ידיים לצדדים, הרם/י את הרגליים למאונך ורד/י לאט." },
  ],
  glutes: [
    { name: "סקוואט", sets: 4, reps: "15", muscle: "ישבן + ירכיים", difficulty: "בינוני", desc: "עמוד/י ברגליים ברוחב כתפיים, כרע/כרעי כאילו יושב/ת על כיסא." },
    { name: "היפ ת'ראסט", sets: 3, reps: "12", muscle: "ישבן", difficulty: "בינוני", desc: "שכבי/שכב עם הגב על ספסל, דחף/י את האגן למעלה." },
    { name: "לאנג'ים", sets: 3, reps: "10 לכל רגל", muscle: "ישבן + קדמיות", difficulty: "בינוני", desc: "צעד/י קדימה, כרע/כרעי עד שהברך האחורית כמעט נוגעת בקרקע." },
  ],
  weightloss: [
    { name: "ג'אמפינג ג'קס", sets: 4, reps: "30 שניות", muscle: "כל הגוף", difficulty: "קל", desc: "קפוץ/קפצי תוך כדי פרישת ידיים ורגליים הצידה וחזרה." },
    { name: "ברפי", sets: 3, reps: "10", muscle: "כל הגוף", difficulty: "קשה", desc: "סקוואט → פלאנק → שכיבת סמיכה → קפיצה." },
    { name: "הליכה גבוהה", sets: 3, reps: "45 שניות", muscle: "ירכיים + בטן", difficulty: "קל", desc: "הרם/י ברכיים לגובה הירך בקצב מהיר במקום." },
  ],
  strength: [
    { name: "שכיבות סמיכה", sets: 4, reps: "12", muscle: "חזה + כתפיים + טריצפס", difficulty: "בינוני", desc: "ידיים ברוחב כתפיים, שמור/י על הגב ישר, ירד/רדי עד לחזה." },
    { name: "מתח", sets: 3, reps: "6-8", muscle: "גב + ביצפס", difficulty: "קשה", desc: "תפוס/תפסי מוט ברוחת כתפיים, משוך/משכי את הגוף למעלה עד לסנטר." },
    { name: "סקוואט עם משקל", sets: 4, reps: "10", muscle: "רגליים + ישבן", difficulty: "בינוני", desc: "אחז/י משקל ביד או שים/שימי ברזל על הכתפיים, בצע/י סקוואט." },
  ],
};

const MEALS = {
  weightloss: [
    { time: "07:00", name: "ארוחת בוקר", foods: "חביתה מ-2 ביצים, ירקות קצוצים, 1 פרוסת לחם מלא" },
    { time: "10:00", name: "ארוחת ביניים", foods: "תפוח + 10 שקדים" },
    { time: "13:00", name: "ארוחת צהריים", foods: "חזה עוף/טופו 150 גרם, קינואה, סלט ירקות גדול" },
    { time: "16:00", name: "ארוחת ביניים", foods: "יוגורט יווני 0% + פירות יער" },
    { time: "19:00", name: "ארוחת ערב", foods: "דג אפוי, ברוקולי אפוי, בטטה קטנה" },
  ],
  muscle: [
    { time: "07:00", name: "ארוחת בוקר", foods: "שייק חלבון + 2 ביצים + שיבולת שועל עם בננה" },
    { time: "10:30", name: "ארוחת ביניים", foods: "גבינה 5% + לחם מלא + אבוקדו" },
    { time: "13:00", name: "ארוחת צהריים", foods: "חזה עוף 200 גרם, אורז מלא, ירקות מוקפצים" },
    { time: "16:00", name: "לפני אימון", foods: "בננה + 2 כפות חמאת בוטנים" },
    { time: "19:00", name: "אחרי אימון", foods: "שייק חלבון + פחמימה מהירה" },
    { time: "21:00", name: "ארוחת לילה", foods: "גבינת קוטג' + שקדים" },
  ],
};

// ─── Timer Component ───────────────────────────────────────────────────────────
function RestTimer({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) { onDone(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const pct = (left / seconds) * 100;
  return (
    <div style={{ textAlign: "center", padding: "24px" }}>
      <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 16px" }}>
        <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r="44" fill="none" stroke={COLORS.border} strokeWidth="8" />
          <circle cx="50" cy="50" r="44" fill="none" stroke={COLORS.accent} strokeWidth="8"
            strokeDasharray={`${276 * pct / 100} 276`} strokeLinecap="round" />
        </svg>
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 28, fontWeight: 700, color: COLORS.accent }}>
          {left}
        </span>
      </div>
      <p style={{ color: COLORS.textMuted, fontSize: 14 }}>מנוחה בין סטים</p>
    </div>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = COLORS.accent }) {
  return (
    <div style={{ background: COLORS.border, borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 99, transition: "width .5s ease" }} />
    </div>
  );
}

// ─── Water Tracker ─────────────────────────────────────────────────────────────
function WaterTracker() {
  const [cups, setCups] = useState(3);
  const target = 8;
  return (
    <div style={{ background: COLORS.card, borderRadius: 16, padding: 20, border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontWeight: 600, color: COLORS.text }}>💧 מים</span>
        <span style={{ color: COLORS.info, fontWeight: 700 }}>{cups}/{target} כוסות</span>
      </div>
      <ProgressBar value={cups} max={target} color={COLORS.info} />
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {Array.from({ length: target }).map((_, i) => (
          <button key={i} onClick={() => setCups(i + 1)}
            style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${i < cups ? COLORS.info : COLORS.border}`,
              background: i < cups ? "rgba(92,200,255,0.15)" : "transparent", cursor: "pointer", fontSize: 16, transition: "all .2s" }}>
            💧
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Exercise Card ─────────────────────────────────────────────────────────────
function ExerciseCard({ ex, idx }) {
  const [done, setDone] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);

  const diffColor = ex.difficulty === "קשה" ? COLORS.danger : ex.difficulty === "קל" ? COLORS.accent : COLORS.info;
  const pregnancyEmojis = ["🤸‍♀️", "🧘‍♀️", "🚶‍♀️", "💧", "🌸", "🌿", "🕊️", "🏊‍♀️"];

  return (
    <div style={{ background: COLORS.card, borderRadius: 20, padding: 20, border: `1px solid ${done ? COLORS.accent : COLORS.border}`,
      opacity: done ? 0.7 : 1, transition: "all .3s", position: "relative", overflow: "hidden" }}>
      {done && <div style={{ position: "absolute", inset: 0, background: "rgba(200,241,53,0.05)", borderRadius: 20 }} />}

      {ex.tip && (
        <div style={{
          background: ex.tip.startsWith("⚠️") ? "rgba(255,159,92,0.12)" : "rgba(90,255,160,0.08)",
          border: `1px solid ${ex.tip.startsWith("⚠️") ? "rgba(255,159,92,0.5)" : "rgba(90,255,160,0.35)"}`,
          borderRadius: 10, padding: "8px 12px", marginBottom: 14, fontSize: 12, fontWeight: 700,
          color: ex.tip.startsWith("⚠️") ? "#FF9F5C" : "#5AFFA0", lineHeight: 1.5
        }}>
          {ex.tip}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        {/* Exercise visual */}
        <div style={{ width: 80, height: 80, borderRadius: 16, background: ex.safe ? "rgba(90,255,160,0.08)" : COLORS.accentSoft,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0,
          border: `1px solid ${ex.safe ? "rgba(90,255,160,0.25)" : COLORS.border}` }}>
          {ex.safe ? pregnancyEmojis[idx % pregnancyEmojis.length] : ["🏋️", "🤸", "💪", "🧘", "🔥", "⚡"][idx % 6]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h3 style={{ margin: 0, fontSize: 17, color: COLORS.text, fontWeight: 700 }}>{ex.name}</h3>
            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: `${diffColor}20`, color: diffColor, fontWeight: 600 }}>
              {ex.difficulty}
            </span>
          </div>
          <p style={{ margin: "4px 0 8px", fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{ex.desc}</p>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600 }}>🔁 {ex.sets} סטים</span>
            <span style={{ fontSize: 12, color: COLORS.info, fontWeight: 600 }}>× {ex.reps}</span>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>📍 {ex.muscle}</span>
          </div>
        </div>
      </div>

      {showTimer && <RestTimer seconds={60} onDone={() => { setShowTimer(false); setCurrentSet(s => s + 1); }} />}

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={() => setShowTimer(true)} disabled={showTimer}
          style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1px solid ${COLORS.border}`,
            background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          ⏱ מנוחה 60 שניות
        </button>
        <button onClick={() => setDone(d => !d)}
          style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none",
            background: done ? COLORS.accentSoft : COLORS.accent, color: done ? COLORS.accent : COLORS.bg,
            cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          {done ? "✓ הושלם" : "סיימתי סט"}
        </button>
      </div>
    </div>
  );
}

// ─── Onboarding / Questionnaire ────────────────────────────────────────────────
function Questionnaire({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "", age: "", height: "", weight: "", gender: "female",
    fitnessLevel: "", medical: "", pregnant: false,
    timeAvail: "", hasEquip: false, goals: [], diet: ""
  });

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const steps = [
    // Step 0 – Welcome
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔥</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, background: COLORS.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 12px" }}>
        FitPersonal
      </h1>
      <p style={{ color: COLORS.textMuted, fontSize: 16, lineHeight: 1.7, margin: "0 0 32px" }}>
        תוכנית הכושר והתזונה<br />המותאמת אישית רק לך
      </p>
      <input value={data.name} onChange={e => update("name", e.target.value)}
        placeholder="מה שמך?"
        style={{ width: "100%", padding: "16px 20px", borderRadius: 14, border: `2px solid ${COLORS.border}`,
          background: COLORS.card, color: COLORS.text, fontSize: 16, outline: "none", boxSizing: "border-box",
          textAlign: "right", fontFamily: "inherit" }} />
    </div>,

    // Step 1 – Basic info
    <div>
      <h2 style={{ color: COLORS.text, marginBottom: 20 }}>נתונים בסיסיים</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        {["female", "male"].map(g => (
          <button key={g} onClick={() => update("gender", g)}
            style={{ flex: 1, padding: 16, borderRadius: 14, border: `2px solid ${data.gender === g ? COLORS.accent : COLORS.border}`,
              background: data.gender === g ? COLORS.accentSoft : "transparent", color: data.gender === g ? COLORS.accent : COLORS.textMuted,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 15 }}>
            {g === "female" ? "👩 נקבה" : "👨 זכר"}
          </button>
        ))}
      </div>
      {[["age", "גיל", "30"], ["height", "גובה (ס\"מ)", "168"], ["weight", "משקל (ק\"ג)", "65"]].map(([k, label, ph]) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <label style={{ color: COLORS.textMuted, fontSize: 13, display: "block", marginBottom: 6 }}>{label}</label>
          <input type="number" value={data[k]} onChange={e => update(k, e.target.value)}
            placeholder={ph}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `2px solid ${COLORS.border}`,
              background: COLORS.card, color: COLORS.text, fontSize: 16, outline: "none", boxSizing: "border-box",
              textAlign: "right", fontFamily: "inherit" }} />
        </div>
      ))}
    </div>,

    // Step 2 – Fitness level
    <div>
      <h2 style={{ color: COLORS.text, marginBottom: 8 }}>רמת הכושר שלך</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 20 }}>כנה עם עצמך — זה יעזור לנו להתאים נכון</p>
      {[
        { id: "beginner", label: "מתחיל/ה", desc: "לא מתאמן/ת כרגע", icon: "🌱" },
        { id: "intermediate", label: "בינוני/ת", desc: "1-3 פעמים בשבוע", icon: "🌿" },
        { id: "advanced", label: "מתקדם/ת", desc: "4+ פעמים בשבוע", icon: "🌳" },
      ].map(l => (
        <div key={l.id} onClick={() => update("fitnessLevel", l.id)}
          style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 14, marginBottom: 10,
            border: `2px solid ${data.fitnessLevel === l.id ? COLORS.accent : COLORS.border}`,
            background: data.fitnessLevel === l.id ? COLORS.accentSoft : COLORS.card, cursor: "pointer" }}>
          <span style={{ fontSize: 28 }}>{l.icon}</span>
          <div>
            <div style={{ color: COLORS.text, fontWeight: 700 }}>{l.label}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{l.desc}</div>
          </div>
        </div>
      ))}
    </div>,

    // Step 3 – Goals
    <div>
      <h2 style={{ color: COLORS.text, marginBottom: 8 }}>המטרות שלך</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 20 }}>בחר/י עד 3 מטרות עיקריות</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {GOALS.map(g => {
          const sel = data.goals.includes(g.id);
          return (
            <button key={g.id} onClick={() => {
              if (sel) update("goals", data.goals.filter(x => x !== g.id));
              else if (data.goals.length < 3) update("goals", [...data.goals, g.id]);
            }}
              style={{ padding: "14px 10px", borderRadius: 14, border: `2px solid ${sel ? COLORS.accent : COLORS.border}`,
                background: sel ? COLORS.accentSoft : COLORS.card, color: sel ? COLORS.accent : COLORS.textMuted,
                cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{g.icon}</div>
              {g.label}
            </button>
          );
        })}
      </div>
    </div>,

    // Step 4 – Medical & time
    <div>
      <h2 style={{ color: COLORS.text, marginBottom: 20 }}>מגבלות ולו"ז</h2>
      <label style={{ color: COLORS.textMuted, fontSize: 13, display: "block", marginBottom: 6 }}>מגבלות רפואיות / פציעות</label>
      <textarea value={data.medical} onChange={e => update("medical", e.target.value)}
        placeholder="לדוגמה: כאבי גב, בעיית ברך, ללא מגבלות..."
        rows={3}
        style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `2px solid ${COLORS.border}`,
          background: COLORS.card, color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box",
          textAlign: "right", fontFamily: "inherit", resize: "none", marginBottom: 16 }} />

      <div onClick={() => update("pregnant", !data.pregnant)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16,
          borderRadius: 14, border: `2px solid ${data.pregnant ? "#FF9F5C" : COLORS.border}`,
          background: data.pregnant ? "rgba(255,159,92,0.1)" : COLORS.card, cursor: "pointer", marginBottom: 14 }}>
        <span style={{ color: COLORS.text }}>🤰 בהריון</span>
        <div style={{ width: 44, height: 26, borderRadius: 99, background: data.pregnant ? "#FF9F5C" : COLORS.border,
          position: "relative", transition: "background .2s" }}>
          <div style={{ position: "absolute", top: 3, left: data.pregnant ? 21 : 3, width: 20, height: 20,
            borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
        </div>
      </div>

      <label style={{ color: COLORS.textMuted, fontSize: 13, display: "block", marginBottom: 6 }}>זמן לאימון בשבוע</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["2-3 פעמים", "3-4 פעמים", "4-5 פעמים", "כל יום"].map(t => (
          <button key={t} onClick={() => update("timeAvail", t)}
            style={{ padding: "10px 16px", borderRadius: 10, border: `2px solid ${data.timeAvail === t ? COLORS.accent : COLORS.border}`,
              background: data.timeAvail === t ? COLORS.accentSoft : "transparent",
              color: data.timeAvail === t ? COLORS.accent : COLORS.textMuted,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}>
            {t}
          </button>
        ))}
      </div>

      <div onClick={() => update("hasEquip", !data.hasEquip)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16,
          borderRadius: 14, border: `2px solid ${data.hasEquip ? COLORS.accent : COLORS.border}`,
          background: data.hasEquip ? COLORS.accentSoft : COLORS.card, cursor: "pointer", marginTop: 14 }}>
        <span style={{ color: COLORS.text }}>🏠 יש ציוד ספורט בבית</span>
        <div style={{ width: 44, height: 26, borderRadius: 99, background: data.hasEquip ? COLORS.accent : COLORS.border,
          position: "relative", transition: "background .2s" }}>
          <div style={{ position: "absolute", top: 3, left: data.hasEquip ? 21 : 3, width: 20, height: 20,
            borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
        </div>
      </div>
    </div>,

    // Step 5 – Diet
    <div>
      <h2 style={{ color: COLORS.text, marginBottom: 8 }}>הרגלי תזונה</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 20 }}>כדי שנוכל לבנות תפריט מותאם</p>
      {[
        { id: "regular", label: "📋 תזונה רגילה", desc: "אוכל/ת הכל" },
        { id: "vegetarian", label: "🥦 צמחוני/ת", desc: "ללא בשר" },
        { id: "vegan", label: "🌱 טבעוני/ת", desc: "ללא כל מוצרי בעלי חיים" },
        { id: "glutenfree", label: "🌾 ללא גלוטן", desc: "רגישות לגלוטן" },
        { id: "lowcarb", label: "🥑 דל פחמימות", desc: "קטו / פליאו" },
      ].map(d => (
        <div key={d.id} onClick={() => update("diet", d.id)}
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, marginBottom: 10,
            border: `2px solid ${data.diet === d.id ? COLORS.accent : COLORS.border}`,
            background: data.diet === d.id ? COLORS.accentSoft : COLORS.card, cursor: "pointer" }}>
          <div>
            <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 15 }}>{d.label}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{d.desc}</div>
          </div>
          {data.diet === d.id && <span style={{ marginLeft: "auto", color: COLORS.accent, fontSize: 18 }}>✓</span>}
        </div>
      ))}
    </div>,
  ];

  const canNext = [
    data.name.trim() !== "",
    data.age && data.height && data.weight,
    data.fitnessLevel !== "",
    data.goals.length > 0,
    data.timeAvail !== "",
    data.diet !== "",
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Assistant', 'Heebo', sans-serif", direction: "rtl" }}>
      {/* Progress */}
      <div style={{ width: "100%", maxWidth: 420, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: COLORS.textMuted, fontSize: 12 }}>שלב {step + 1} מתוך {steps.length}</span>
          <span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700 }}>{Math.round(((step + 1) / steps.length) * 100)}%</span>
        </div>
        <ProgressBar value={step + 1} max={steps.length} />
      </div>

      <div style={{ width: "100%", maxWidth: 420, background: COLORS.surface, borderRadius: 24, padding: 28, border: `1px solid ${COLORS.border}` }}>
        {steps[step]}

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ flex: 0.4, padding: "14px 0", borderRadius: 14, border: `2px solid ${COLORS.border}`,
                background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 16 }}>
              ← חזור
            </button>
          )}
          <button
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete(data)}
            disabled={!canNext[step]}
            style={{ flex: 1, padding: "14px 0", borderRadius: 14, border: "none",
              background: canNext[step] ? COLORS.accent : COLORS.border,
              color: canNext[step] ? COLORS.bg : COLORS.textMuted,
              cursor: canNext[step] ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 800, fontSize: 16, transition: "all .2s" }}>
            {step < steps.length - 1 ? "המשך ←" : "🚀 בנה לי תוכנית!"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function FitPersonal() {
  const [screen, setScreen] = useState("onboarding"); // onboarding | home | workout | nutrition | progress
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [todayCalories, setTodayCalories] = useState(1240);
  const [weekProgress, setWeekProgress] = useState([true, true, false, false, false, false, false]);

  const handleComplete = (data) => { setUserData(data); setScreen("home"); };

  if (screen === "onboarding") return <Questionnaire onComplete={handleComplete} />;

  const primaryGoal = userData?.goals?.[0] || "weightloss";
  const isPregnant = !!userData?.pregnant;
  const exercises = isPregnant ? PREGNANCY_EXERCISES : (SAMPLE_EXERCISES[primaryGoal] || SAMPLE_EXERCISES.strength);
  const meals = MEALS[primaryGoal === "muscle" ? "muscle" : "weightloss"];
  const calorieTarget = isPregnant ? 2200 : primaryGoal === "muscle" ? 2800 : 1800;
  const firstName = userData?.name?.split(" ")[0] || "שלום";

  // ── TABS ───────────────────────────────────────────────────────────────────
  const tabs = [
    { id: "home", icon: "⌂", label: "ראשי" },
    { id: "workout", icon: "💪", label: "אימון" },
    { id: "nutrition", icon: "🥗", label: "תזונה" },
    { id: "progress", icon: "📈", label: "התקדמות" },
  ];

  // ── HOME TAB ───────────────────────────────────────────────────────────────
  const HomeTab = () => (
    <div>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.surface}, ${COLORS.card})`, borderRadius: 24, padding: 24, marginBottom: 16, border: `1px solid ${COLORS.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, left: -30, width: 150, height: 150, borderRadius: "50%", background: COLORS.accentSoft }} />
        <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "0 0 4px", position: "relative" }}>בוקר טוב,</p>
        <h2 style={{ color: COLORS.text, fontSize: 26, fontWeight: 900, margin: "0 0 16px", position: "relative" }}>{firstName} 👋</h2>
        <div style={{ display: "flex", gap: 12, position: "relative" }}>
          <div style={{ flex: 1, background: COLORS.accentSoft, borderRadius: 14, padding: 14, border: `1px solid ${COLORS.accent}33` }}>
            <div style={{ color: COLORS.accent, fontSize: 22, fontWeight: 800 }}>{exercises.length}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12 }}>תרגילים היום</div>
          </div>
          <div style={{ flex: 1, background: "rgba(92,200,255,0.1)", borderRadius: 14, padding: 14, border: "1px solid rgba(92,200,255,0.2)" }}>
            <div style={{ color: COLORS.info, fontSize: 22, fontWeight: 800 }}>{calorieTarget}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12 }}>יעד קלוריות</div>
          </div>
          <div style={{ flex: 1, background: "rgba(90,255,160,0.1)", borderRadius: 14, padding: 14, border: "1px solid rgba(90,255,160,0.2)" }}>
            <div style={{ color: "#5AFFA0", fontSize: 22, fontWeight: 800 }}>{userData?.timeAvail?.split(" ")[0] || "3"}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12 }}>אימונים/שבוע</div>
          </div>
        </div>
      </div>

      {/* Week tracker */}
      <div style={{ background: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: "0 0 14px", color: COLORS.text, fontSize: 16, fontWeight: 700 }}>מעקב שבועי</h3>
        <div style={{ display: "flex", gap: 6 }}>
          {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((d, i) => (
            <div key={i} onClick={() => setWeekProgress(p => { const n = [...p]; n[i] = !n[i]; return n; })}
              style={{ flex: 1, aspectRatio: 1, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", background: weekProgress[i] ? COLORS.accent : COLORS.surface,
                border: `1px solid ${weekProgress[i] ? COLORS.accent : COLORS.border}`, cursor: "pointer", transition: "all .2s" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: weekProgress[i] ? COLORS.bg : COLORS.textMuted }}>{d}</span>
              {weekProgress[i] && <span style={{ fontSize: 14 }}>✓</span>}
            </div>
          ))}
        </div>
        <p style={{ color: COLORS.textMuted, fontSize: 12, margin: "10px 0 0" }}>
          {weekProgress.filter(Boolean).length} / 7 אימונים השבוע
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "🏃 התחל אימון", color: COLORS.accent, textColor: COLORS.bg, action: () => setActiveTab("workout") },
          { label: "🥗 תפריט יומי", color: COLORS.card, textColor: COLORS.text, action: () => setActiveTab("nutrition") },
          { label: "📊 ההתקדמות", color: COLORS.card, textColor: COLORS.text, action: () => setActiveTab("progress") },
          { label: "⚙️ הגדרות", color: COLORS.card, textColor: COLORS.text, action: () => {} },
        ].map((btn, i) => (
          <button key={i} onClick={btn.action}
            style={{ padding: "18px 14px", borderRadius: 16, border: `1px solid ${COLORS.border}`,
              background: btn.color, color: btn.textColor, cursor: "pointer", fontFamily: "inherit",
              fontWeight: 700, fontSize: 15, textAlign: "center" }}>
            {btn.label}
          </button>
        ))}
      </div>

      <WaterTracker />

      {/* Goals recap */}
      <div style={{ background: COLORS.card, borderRadius: 20, padding: 20, marginTop: 16, border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: "0 0 12px", color: COLORS.text, fontSize: 16, fontWeight: 700 }}>המטרות שלך</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(userData?.goals || []).map(gid => {
            const g = GOALS.find(x => x.id === gid);
            return g ? (
              <span key={gid} style={{ padding: "6px 14px", borderRadius: 99, background: COLORS.accentSoft, color: COLORS.accent, fontSize: 13, fontWeight: 600 }}>
                {g.icon} {g.label}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );

  // ── WORKOUT TAB ────────────────────────────────────────────────────────────
  const WorkoutTab = () => {
    const [started, setStarted] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
      if (!started) return;
      const t = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(t);
    }, [started]);
    const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

    return (
      <div>
        {/* Pregnancy banner — shown at the very top */}
        {isPregnant && (
          <div style={{ background: "rgba(255,159,92,0.1)", borderRadius: 18, padding: 18, marginBottom: 16, border: "2px solid rgba(255,159,92,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>🤰</span>
              <span style={{ color: "#FF9F5C", fontWeight: 800, fontSize: 16 }}>תוכנית אימון מותאמת להריון</span>
            </div>
            <p style={{ color: "#FF9F5C", margin: "0 0 12px", fontSize: 13, lineHeight: 1.6 }}>
              כל התרגילים נבחרו בהתאם להנחיות רפואיות לפעילות גופנית בהריון. חשוב להתייעץ עם הרופאה/מיילדת לפני תחילת כל תוכנית.
            </p>
            <div style={{ borderTop: "1px solid rgba(255,159,92,0.25)", paddingTop: 10 }}>
              {PREGNANCY_WARNINGS.map((w, i) => (
                <div key={i} style={{ fontSize: 12, color: w.startsWith("❌") ? "#FF7070" : "#FF9F5C", marginBottom: 4, fontWeight: 600 }}>{w}</div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0, color: COLORS.text, fontSize: 20, fontWeight: 800 }}>אימון היום</h2>
              <p style={{ margin: "4px 0 0", color: COLORS.textMuted, fontSize: 13 }}>
                {isPregnant ? "🤰 תרגילים בטוחים להריון" : (GOALS.find(g => g.id === primaryGoal)?.label || "חיטוב כללי")} • {exercises.length} תרגילים
              </p>
            </div>
            {started && <span style={{ color: COLORS.accent, fontSize: 20, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmt(elapsed)}</span>}
          </div>
          <button onClick={() => setStarted(s => !s)}
            style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
              background: started ? COLORS.danger : COLORS.accent,
              color: started ? "#fff" : COLORS.bg, cursor: "pointer", fontFamily: "inherit", fontWeight: 800, fontSize: 16 }}>
            {started ? "⏸ השהה אימון" : "▶ התחל אימון"}
          </button>
        </div>

        {!isPregnant && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
            {WORKOUT_TYPES.map(t => (
              <span key={t} style={{ padding: "8px 16px", borderRadius: 99, background: COLORS.card, color: COLORS.textMuted,
                fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", border: `1px solid ${COLORS.border}` }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {exercises.map((ex, i) => <ExerciseCard key={i} ex={ex} idx={i} />)}
        </div>

        {userData?.medical && userData.medical !== "ללא מגבלות" && (
          <div style={{ background: "rgba(255,92,92,0.1)", borderRadius: 16, padding: 16, marginTop: 12, border: "2px solid rgba(255,92,92,0.2)" }}>
            <p style={{ color: COLORS.danger, margin: 0, fontSize: 14, fontWeight: 600 }}>
              ⚠️ תרגילים הותאמו גם למגבלה: {userData.medical}
            </p>
          </div>
        )}
      </div>
    );
  };

  // ── NUTRITION TAB ──────────────────────────────────────────────────────────
  const NutritionTab = () => {
    const [eaten, setEaten] = useState([false, false, false, false, false]);
    const mealCalories = [350, 150, 500, 200, 400, 200];
    const consumed = meals.reduce((s, _, i) => s + (eaten[i] ? mealCalories[i] : 0), 0);

    return (
      <div>
        {/* Calorie ring */}
        <div style={{ background: COLORS.card, borderRadius: 20, padding: 24, marginBottom: 16, border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
          <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 16px" }}>
            <svg viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58" fill="none" stroke={COLORS.border} strokeWidth="12" />
              <circle cx="70" cy="70" r="58" fill="none" stroke={COLORS.accent} strokeWidth="12"
                strokeDasharray={`${364 * Math.min(consumed / calorieTarget, 1)} 364`}
                strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: "stroke-dasharray .5s ease" }} />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ color: COLORS.accent, fontSize: 26, fontWeight: 900 }}>{consumed}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 11 }}>מתוך {calorieTarget}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
            {[["🥩 חלבון", "95 גר׳"], ["🍞 פחמימות", "180 גר׳"], ["🥑 שומן", "55 גר׳"]].map(([l, v]) => (
              <div key={l}>
                <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 15 }}>{v}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <WaterTracker />

        <h3 style={{ color: COLORS.text, margin: "16px 0 12px", fontWeight: 700 }}>ארוחות היום</h3>
        {meals.map((m, i) => (
          <div key={i} onClick={() => setEaten(e => { const n = [...e]; n[i] = !n[i]; return n; })}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, marginBottom: 10,
              border: `2px solid ${eaten[i] ? COLORS.accent : COLORS.border}`,
              background: eaten[i] ? COLORS.accentSoft : COLORS.card, cursor: "pointer", transition: "all .2s" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {["🍳", "🍎", "🍗", "🥛", "🐟", "🌙"][i % 6]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 15 }}>{m.name}</span>
                <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{m.time}</span>
              </div>
              <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "3px 0 0", lineHeight: 1.4 }}>{m.foods}</p>
              <span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 600 }}>~{mealCalories[i]} קל׳</span>
            </div>
            {eaten[i] && <span style={{ color: COLORS.accent, fontSize: 20 }}>✓</span>}
          </div>
        ))}
      </div>
    );
  };

  // ── PROGRESS TAB ───────────────────────────────────────────────────────────
  const ProgressTab = () => {
    const [weight, setWeight] = useState(parseFloat(userData?.weight) || 65);
    const goal = primaryGoal === "muscle" ? weight + 3 : weight - 5;

    const bars = [
      { label: "שריפת קלוריות", value: 68, color: COLORS.accent },
      { label: "עמידה ביעד מים", value: 75, color: COLORS.info },
      { label: "אימונים שהושלמו", value: Math.round((weekProgress.filter(Boolean).length / 7) * 100), color: "#5AFFA0" },
      { label: "ציות לתפריט", value: 55, color: "#FF9F5C" },
    ];

    return (
      <div>
        {/* Weight card */}
        <div style={{ background: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 16px", color: COLORS.text, fontWeight: 700 }}>📊 מעקב משקל</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <button onClick={() => setWeight(w => Math.max(40, +(w - 0.5).toFixed(1)))}
              style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                color: COLORS.text, fontSize: 20, cursor: "pointer" }}>-</button>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: COLORS.accent, fontSize: 36, fontWeight: 900 }}>{weight}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 13 }}>ק"ג כרגע</div>
            </div>
            <button onClick={() => setWeight(w => +(w + 0.5).toFixed(1))}
              style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                color: COLORS.text, fontSize: 20, cursor: "pointer" }}>+</button>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, background: COLORS.surface, borderRadius: 12, padding: 12, textAlign: "center" }}>
              <div style={{ color: COLORS.textMuted, fontSize: 12 }}>משקל ראשוני</div>
              <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 18 }}>{userData?.weight} ק"ג</div>
            </div>
            <div style={{ flex: 1, background: COLORS.surface, borderRadius: 12, padding: 12, textAlign: "center" }}>
              <div style={{ color: COLORS.textMuted, fontSize: 12 }}>יעד משקל</div>
              <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 18 }}>{goal.toFixed(1)} ק"ג</div>
            </div>
            <div style={{ flex: 1, background: COLORS.surface, borderRadius: 12, padding: 12, textAlign: "center" }}>
              <div style={{ color: COLORS.textMuted, fontSize: 12 }}>שינוי</div>
              <div style={{ color: weight < parseFloat(userData?.weight) ? "#5AFFA0" : COLORS.danger, fontWeight: 700, fontSize: 18 }}>
                {(weight - parseFloat(userData?.weight)).toFixed(1)} ק"ג
              </div>
            </div>
          </div>
        </div>

        {/* Stats bars */}
        <div style={{ background: COLORS.card, borderRadius: 20, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 16px", color: COLORS.text, fontWeight: 700 }}>ביצועים השבוע</h3>
          {bars.map(b => (
            <div key={b.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: COLORS.text, fontSize: 14 }}>{b.label}</span>
                <span style={{ color: b.color, fontWeight: 700, fontSize: 14 }}>{b.value}%</span>
              </div>
              <ProgressBar value={b.value} max={100} color={b.color} />
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ background: COLORS.card, borderRadius: 20, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 14px", color: COLORS.text, fontWeight: 700 }}>🏆 הישגים</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🔥", title: "רצף 3 ימים", done: true },
              { icon: "💧", title: "8 כוסות ביום", done: true },
              { icon: "💪", title: "10 אימונים", done: false },
              { icon: "⚖️", title: "הפחתת 2 ק\"ג", done: false },
            ].map((a, i) => (
              <div key={i} style={{ padding: 14, borderRadius: 14, background: a.done ? COLORS.accentSoft : COLORS.surface,
                border: `1px solid ${a.done ? COLORS.accent : COLORS.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{a.icon}</div>
                <div style={{ color: a.done ? COLORS.accent : COLORS.textMuted, fontSize: 12, fontWeight: 600 }}>{a.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const tabContent = { home: <HomeTab />, workout: <WorkoutTab />, nutrition: <NutritionTab />, progress: <ProgressTab /> };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Assistant', 'Heebo', sans-serif", direction: "rtl", color: COLORS.text }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${COLORS.bg}EE`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${COLORS.border}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 900, fontSize: 18, background: COLORS.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FitPersonal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${COLORS.accent}`, fontSize: 14 }}>
            {firstName[0]}
          </div>
          <button onClick={() => setScreen("onboarding")} style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 12 }}>
            ✎ ערוך פרופיל
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 100px", maxWidth: 520, margin: "0 auto" }}>
        {tabContent[activeTab]}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: `${COLORS.surface}F5`, backdropFilter: "blur(16px)", borderTop: `1px solid ${COLORS.border}`, display: "flex", padding: "12px 20px 20px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "transparent", border: "none", cursor: "pointer", transition: "all .2s" }}>
            <span style={{ fontSize: 22, filter: activeTab === t.id ? "none" : "grayscale(1) opacity(.5)" }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: activeTab === t.id ? COLORS.accent : COLORS.textMuted, fontFamily: "inherit" }}>
              {t.label}
            </span>
            {activeTab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.accent }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
