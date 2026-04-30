import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();
      tg.setBackgroundColor("#0f172a");
    }
  }, []);

  return (
    <div className="app">
      {page === "home" && <Home />}
      {page === "duels" && <Duels />}
      {page === "profile" && <Profile />}

      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}

/* ---------------- HOME ---------------- */

function Home() {
  return (
    <div className="screen">
      <h1 className="title">
        COMMIT <span>OR</span> PAY
      </h1>

      <div className="card">
        <div className="user">
          <div className="avatar">V</div>
          <div>
            <div className="name">vlad</div>
            <div className="level">Уровень 1</div>
          </div>
        </div>

        <div className="balance">
          <div>
            Баланс
            <h2>1000</h2>
          </div>
          <div>
            Доступно
            <h2>1000</h2>
          </div>
        </div>
      </div>

      <button className="btn">Создать дуэль</button>
    </div>
  );
}

/* ---------------- DUELS ---------------- */

function Duels() {
  return (
    <div className="screen">
      <h2>Мои дуэли</h2>

      <div className="card">
        <div className="duel">
          <div>
            Сделаю 50 отжиманий
            <div className="sub">@testuser</div>
          </div>
          <div className="price">500$</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */

function Profile() {
  return (
    <div className="screen">
      <div className="card">
        <div className="user">
          <div className="avatar big">V</div>
          <div>
            <div className="name">vlad</div>
            <div className="level">@vlad</div>
          </div>
        </div>

        <div className="stats">
          <div>Баланс: 1000</div>
          <div>Победы: 0</div>
          <div>Поражения: 0</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- NAV ---------------- */

function BottomNav({ page, setPage }) {
  return (
    <div className="nav">
      <button onClick={() => setPage("home")}>🏠</button>
      <button onClick={() => setPage("duels")}>⚔️</button>
      <button onClick={() => setPage("profile")}>👤</button>
    </div>
  );
}
