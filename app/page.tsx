import { cookies, headers } from "next/headers";
import { getChatGPTUser, chatGPTSignInPath } from "./chatgpt-auth";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const cookieStore = await cookies();
  const localSignedIn = isLocal && cookieStore.get("incomemate-local-session")?.value === "active";
  const chatGPTUser = await getChatGPTUser();
  const user = chatGPTUser ?? (localSignedIn ? {
    displayName: "Demo User",
    email: "demo@incomemate.local",
    fullName: "Demo User",
  } : null);

  if (!user) {
    return (
      <main className="login-page">
        <section className="login-copy">
          <a className="login-brand" href="#"><span>¥</span> IncomeMate</a>
          <div>
            <p className="eyebrow">YOUR WORK, YOUR MONEY</p>
            <h1>働いた分を、<br />きちんと手元に。</h1>
            <p>掛け持ちバイトの複雑な収入を、ひとつの場所で。<br />時給、日払い、現金手渡しも、すっきり管理できます。</p>
          </div>
          <div className="login-features">
            <span><b>✓</b> 勤務先ごとの時給管理</span>
            <span><b>✓</b> 計算額と実受取額を比較</span>
            <span><b>✓</b> 未受取の給与を見逃さない</span>
          </div>
          <small>© 2026 IncomeMate</small>
        </section>
        <section className="login-box-wrap">
          <div className="login-box">
            <div className="login-mark">¥</div>
            <p className="eyebrow">WELCOME BACK</p>
            <h2>ログイン</h2>
            <p>あなた専用の収入台帳を開きます。<br />データはアカウントごとに分けて管理されます。</p>
            <a className="chatgpt-login" href={isLocal ? "/api/local-login" : chatGPTSignInPath("/")}>
              <span>✦</span> {isLocal ? "ローカルデモでログイン" : "ChatGPTでログイン"}
            </a>
            <p className="login-security">▣ {isLocal ? "開発確認用のローカルセッションです" : "認証情報をこのアプリが保存することはありません"}</p>
          </div>
        </section>
      </main>
    );
  }

  return <Dashboard user={{ displayName: user.displayName, email: user.email }} logoutUrl={isLocal ? "/api/local-logout" : "/signout-with-chatgpt?return_to=%2F"} />;
}
