import { actions } from "astro:actions";
import { useState } from "react";

export default function SlidesList() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin && <a href="/signin">Log in to like a post.</a>}
      <button
        onClick={async () => {
          const { data, error } = await actions.getGreeting({ name: "kkkkkkk" });
        }}
      >
        Like
      </button>
    </>
  );
}
