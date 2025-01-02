import { FormEvent, useState } from "react";
import { supabase } from "../../utils/supabase-client";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: import.meta.env.PROD
          ? "https://holfreij.github.io/bible-reading-system"
          : "http://localhost:5173/bible-reading-system/",
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-medium text-lg">
        Sign in to store and sync your bookmarks
      </p>
      <form className="form-widget" onSubmit={handleLogin}>
        <div className="flex flex-col items-center gap-2">
          <label className="input input-bordered flex items-center gap-2">
            <p className="font-medium">Email</p>
            <input
              type="email"
              className="grow"
              placeholder="your-mail@site.com"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <div>
            <button className={"btn btn-primary"} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send login link</span>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
