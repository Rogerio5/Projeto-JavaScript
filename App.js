// src/App.js
import './App.css';
import { useEffect, useState } from 'react';
import Header from './Header';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Firebase auth carregado:", auth);
  }, []);

  const criarConta = (email, senha) => {
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const usuario = userCredential.user;
        console.log("Conta criada com sucesso:", usuario);
        setUser(usuario); // define usuário no estado
      })
      .catch((error) => {
        console.error("Erro ao criar conta:", error.code, error.message);
      });
  };

  return (
    <div className="App">
      <Header setUser={setUser} user={user} criarConta={criarConta} />
    </div>
  );
}

export default App;



