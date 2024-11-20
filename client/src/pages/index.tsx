import type { FormEvent } from "react";
import { useLocation } from "wouter";

export default function Index() {
  const [, navigate] = useLocation(); // `navigate` es la función para redirigir

  localStorage.getItem("user") && navigate("/chat");

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = formData.get("user");
    if (!user) {
      alert("Debes introducir un usuario");
      return;
    }
    localStorage.setItem("user", user.toString());
    navigate("/chat");
  };
  return (
    <main className="flex flex-col gap-4 items-center justify-center w-screen h-screen">
      <h1 className="text-2xl font-bold">Introduce tu usuario</h1>
      <form onSubmit={handleOnSubmit}>
        <input
          className="border rounded border-zinc-100 p-1"
          type="text"
          name="user"
        />
      </form>
    </main>
  );
}
