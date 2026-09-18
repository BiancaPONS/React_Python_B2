function RegisterPage() {
  return (
    <main className="form-page">
      <section className="form-card">
        <p className="eyebrow">Nouveau compte</p>
        <h1>Créer un compte</h1>

        <form>
          <label htmlFor="email">Adresse email</label>
          <input id="email" type="email" required />

          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" required />

          <button type="submit">S’inscrire</button>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;