function LoginPage() {
  return (
    <main className="form-page">
      <section className="form-card">
        <p className="eyebrow">Bienvenue</p>
        <h1>Se connecter</h1>

        <form>
          <label htmlFor="email">Adresse email</label>
          <input id="email" type="email" required />

          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" required />

          <button type="submit">Se connecter</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;