import { useEffect, useState } from "react";
const PHRASES = ["Machine Learning","Deep Learning","Natural Language Processing","Computer Vision","Data Science"];
export function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = PHRASES[i];
    const t = setTimeout(() => {
      if (!del) {
        const next = cur.slice(0, text.length + 1);
        setText(next);
        if (next === cur) setTimeout(() => setDel(true), 1400);
      } else {
        const next = cur.slice(0, text.length - 1);
        setText(next);
        if (next === "") { setDel(false); setI((i + 1) % PHRASES.length); }
      }
    }, del ? 35 : 70);
    return () => clearTimeout(t);
  }, [text, del, i]);
  return <span className="caret font-mono text-primary neon-text">{text}</span>;
}
