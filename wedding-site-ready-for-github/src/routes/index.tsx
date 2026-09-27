import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock3, Heart, MapPin, MessageCircle } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Comment = {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "გიორგი და ანი — ქორწილის მოსაწვევი" },
      { name: "description", content: "გიორგისა და ანის ქორწილი — 24 ოქტომბერი, 2026." },
      { property: "og:title", content: "გიორგი და ანი — ქორწილის მოსაწვევი" },
      { property: "og:description", content: "გელოდებით ჩვენს განსაკუთრებულ დღეს, ტალერის ტერასებზე, სალხინოში." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeddingInvitation,
});

function PageFrame() {
  return (
    <div aria-hidden="true">
      <div className="vine-bar vine-bar-top" />
      <div className="vine-bar vine-bar-bottom" />
      <div className="vine-rail vine-rail-left" />
      <div className="vine-rail vine-rail-right" />
    </div>
  );
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <span className="ornament-mark">❧</span>
      <span />
    </div>
  );
}

function WeddingInvitation() {
  const [commentName, setCommentName] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentStatus, setCommentStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let active = true;
    supabase
      .from("wedding_comments")
      .select("id, guest_name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (active && data) setComments(data);
      });
    return () => {
      active = false;
    };
  }, []);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCommentStatus("loading");
    const { data, error } = await supabase
      .from("wedding_comments")
      .insert({ guest_name: commentName.trim(), message: message.trim() })
      .select("id, guest_name, message, created_at")
      .single();
    if (error || !data) {
      setCommentStatus("error");
      return;
    }
    setComments((current) => [data, ...current]);
    setMessage("");
    setCommentStatus("idle");
  }

  return (
    <main className="invitation-page overflow-hidden">
      <PageFrame />
      <section className="cover-section section-shell text-center">
        <p className="eyebrow">გელოდებით</p>
        <h1 className="names hero-names">
          გიორგი <span>&amp;</span> ანი
        </h1>
        <div className="hero-illustration">
          <img
            src="/images/couple-illustration.png"
            alt="გიორგი და ანის ილუსტრაცია"
            fetchPriority="high"
            decoding="async"
            width={832}
            height={696}
          />
        </div>
        <div className="hero-meta">
          <span><CalendarDays aria-hidden="true" /> 24 ოქტომბერი, 2026</span>
          <span><MapPin aria-hidden="true" /> სალხინო, ტალერის ტერასები</span>
        </div>
      </section>

      <section className="story-section section-shell text-center">
        <p className="eyebrow">ჩვენი სიყვარულის დღე</p>
        <h2>გეპატიჟებით ჩვენს ქორწილში</h2>
        <Ornament />
        <div className="prose-copy">
          <p>ჩვენი ცხოვრების ერთ-ერთი ყველაზე ლამაზი და მნიშვნელოვანი დღე ახლოვდება…</p>
          <p>ამ განსაკუთრებულ დღეს ჩვენთვის ყველაზე ძვირფასი ადამიანების გვერდით ყოფნა ძალიან მნიშვნელოვანია. გვინდა, ჩვენი ბედნიერება, სიყვარული და ამ დღის სიხარული თქვენთან ერთად გავიზიაროთ და ერთად შევქმნათ მოგონებები, რომლებიც მთელი ცხოვრება გაგვყვება.</p>
          <Ornament />
          <p>თქვენი მოსვლა ჩვენთვის მხოლოდ დასწრებას არ ნიშნავს — ეს არის თქვენი სითბოს, სიყვარულისა და ჩვენდამი გულწრფელი დამოკიდებულების გაზიარება ჩვენი ცხოვრების ერთ-ერთ ყველაზე მნიშვნელოვან მომენტში.</p>
        </div>
      </section>

      <section className="portrait-section section-shell">
        <div className="portrait-wrap">
          <span className="portrait-corner portrait-corner-one" aria-hidden="true">❦</span>
          <div className="portrait-frame">
            <img
              src="/images/couple-portrait.jpg"
              alt="გიორგი და ანი ტრადიციულ ქართულ სამოსში"
              loading="lazy"
              decoding="async"
              width={860}
              height={1075}
            />
          </div>
          <span className="portrait-corner portrait-corner-two" aria-hidden="true">❧</span>
        </div>
      </section>

      <section className="details-section section-shell text-center">
        <div className="prose-copy">
          <p>ამიტომ, მთელი გულით გელოდებით და გვინდა, ეს დღე თქვენთან ერთად გავილამაზოთ.</p>
          <Ornament />
          <p>გთხოვთ, დაგვიდასტუროთ თქვენი მობრძანება, რადგან ჩვენთვის ძალიან მნიშვნელოვანია ვიცოდეთ, რომ ამ განსაკუთრებულ დღეს აუცილებლად ჩვენს გვერდით იქნებით.</p>
        </div>
        <p className="signature">სიყვარულით და დიდი მოლოდინით,<br /><strong>გიორგი და ანი</strong></p>

        <div className="event-facts">
          <div><CalendarDays /><span>24 ოქტომბერი, 2026</span></div>
          <div><Clock3 /><span>18:00</span></div>
          <div><MapPin /><span>ტალერის ტერასები, სალხინო</span></div>
        </div>
      </section>

      <section className="confirm-note section-shell text-center">
        <p><MapPin aria-hidden="true" /> დასტურის შემთხვევაში მომწერეთ პირად შეტყობინებაში</p>
      </section>

      <section className="location-section section-shell text-center">
        <a className="map-link" href="https://www.google.com/maps/search/?api=1&query=%E1%83%A2%E1%83%90%E1%83%9A%E1%83%94%E1%83%A0%E1%83%98%E1%83%A1%20%E1%83%A2%E1%83%94%E1%83%A0%E1%83%90%E1%83%A1%E1%83%94%E1%83%91%E1%83%98%2C%20%E1%83%A1%E1%83%90%E1%83%9A%E1%83%AE%E1%83%98%E1%83%9C%E1%83%9D" target="_blank" rel="noreferrer"><MapPin /> რუკაზე გახსნა</a>
      </section>

      <section className="wishes-section">
        <div className="section-shell wishes-grid">
          <div>
            <p className="eyebrow">სტუმრების სურვილები</p>
            <h2>დაგვიტოვეთ თბილი სიტყვები</h2>
            <form className="comment-form" onSubmit={submitComment}>
              <label className="field-label" htmlFor="comment-name">ვინ ხართ?</label>
              <input id="comment-name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={commentName} onChange={(e) => setCommentName(e.target.value)} placeholder="თქვენი სახელი" />
              <label className="field-label" htmlFor="comment-message">თქვენი კომენტარი</label>
              <textarea id="comment-message" required maxLength={1000} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="დაწერეთ თქვენი სურვილი…" />
              <Button type="submit" disabled={commentStatus === "loading"}><MessageCircle />{commentStatus === "loading" ? "იგზავნება…" : "კომენტარის დატოვება"}</Button>
              {commentStatus === "error" && <p className="form-error" role="alert">კომენტარი ვერ გაიგზავნა. გთხოვთ, სცადოთ თავიდან.</p>}
            </form>
          </div>
          <div className="comments-list" aria-live="polite">
            {comments.length === 0 ? (
              <div className="empty-wish"><Heart /><p>პირველი თბილი სიტყვა თქვენგან იყოს.</p></div>
            ) : comments.map((comment) => (
              <article key={comment.id} className="comment-item">
                <Heart aria-hidden="true" />
                <p>{comment.message}</p>
                <footer>— {comment.guest_name}</footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="finale">
        <Ornament />
        <p className="names">გიორგი <span>&amp;</span> ანი</p>
        <p>24 • 10 • 2026</p>
      </footer>
    </main>
  );
}
