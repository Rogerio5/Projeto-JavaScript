import { useEffect, useState } from 'react';
import { auth, storage, db } from './firebase.js';
import { serverTimestamp } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

function Header(props) {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {
    props.setUser();
  }, []);

  function criarConta(e) {
    e.preventDefault();
    const email = document.getElementById('email-cadastro').value;
    const username = document.getElementById('username-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;

    createUserWithEmailAndPassword(auth, email, senha)
      .then((authUser) => {
        updateProfile(authUser.user, { displayName: username })
          .then(() => {
            alert('Conta criada com sucesso!');
            document.querySelector('.modalCriarConta').style.display = "none";
          })
          .catch((err) => {
            alert(`Erro ao atualizar perfil: ${err.message}`);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function logar(e) {
    e.preventDefault();
    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;

    signInWithEmailAndPassword(auth, email, senha)
      .then((authUser) => {
        props.setUser(authUser.user.displayName);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  function abrirModalCriarConta(e) {
    e.preventDefault();
    document.querySelector('.modalCriarConta').style.display = "block";
  }

  function abrirModalUpload(e) {
    e.preventDefault();
    document.querySelector('.modalUpload').style.display = "block";
  }

  function fecharModalCriar() {
    document.querySelector('.modalCriarConta').style.display = "none";
  }

  function fecharModalUpload() {
    document.querySelector('.modalUpload').style.display = "none";
  }

  function UploadPost(e) {
    e.preventDefault();
    const tituloPost = document.getElementById('titulo-upload').value;
    console.log("🚀 Evento disparado para UploadPost");

    if (!file) {
      alert("Por favor, selecione uma imagem antes de postar.");
      console.log("⚠️ Nenhum arquivo foi selecionado.");
      return;
    }

    console.log("📁 Arquivo selecionado:", file.name);

    try {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressValue = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progressValue);
          console.log("⏳ Progresso:", progressValue + "%");
        },
        (error) => {
          console.error("❌ Erro no upload:", error.message);
          alert("Erro no upload: " + error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log("✅ Upload finalizado. URL da imagem:", url);

            db.collection('posts').add({
              titulo: tituloPost,
              image: url,
              username: props.user,
              timestamp: serverTimestamp()
            }).then(() => {
              console.log("📝 Post salvo no Firestore com sucesso");
              alert('Upload realizado com sucesso!');
              setProgress(0);
              setFile(null);
              document.getElementById('form-upload').reset();
              fecharModalUpload();
            }).catch((err) => {
              console.error("❌ Erro ao salvar no Firestore:", err.message);
              alert("Erro ao salvar post: " + err.message);
            });
          });
        }
      );
    } catch (error) {
      console.error("❌ Erro inesperado:", error.message);
      alert("Erro inesperado: " + error.message);
    }
  }

  return (
    <div className="header">
      {/* Modal Criar Conta */}
      <div className="modalCriarConta">
        <div className="formCriarConta">
          <div onClick={fecharModalCriar} className="close-modal-criar">X</div>
          <h2>Criar conta</h2>
          <form onSubmit={criarConta}>
            <input id="email-cadastro" placeholder="Seu e-mail..." />
            <input id="username-cadastro" placeholder="Seu username..." />
            <input id="senha-cadastro" placeholder="Sua senha..." />
            <input type="submit" value="Criar Conta" />
          </form>
        </div>
      </div>

      {/* Modal Upload */}
      <div className="modalUpload">
        <div className="formUpload">
          <div onClick={fecharModalUpload} className="close-modal-criar">X</div>
          <div className="upload__mensagem">Olá {props.user}, Postar</div>
          <h2>Fazer Upload</h2>
          <form id="form-upload" onSubmit={UploadPost}>
            <progress id="progress-upload" value={progress} max="100"></progress>
            <input id="titulo-upload" type="text" placeholder="Nome da sua foto..." />
            <input
              type="file"
              name="file"
              onChange={(e) => {
                if (e && e.target && e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                } else {
                  alert("Erro ao selecionar o arquivo. Tente novamente.");
                }
              }}
            />
            <input type="submit" value="Postar no Instagram" />
          </form>
        </div>
      </div>

      {/* Header principal */}
      <div className="header__logo">
        <a href="#" className="logo-link">
          <img
            src="https://3d-survey.net/wp/wp-content/uploads/2020/06/753488cc2767dec4acdb073812790038.png"
            alt="Instagram Logo Rosa"
            className="logo-img"
          />
          
        </a>
      </div>

      {props.user ? (
        <div className="header__logadoInfo">
          <span>Olá, <b>{props.user}</b></span>
          <a onClick={abrirModalUpload} href="#">Postar!</a>
        </div>
      ) : (
        <div className="header__loginForm">
          <form onSubmit={logar}>
            <input id="email-login" placeholder="Usuário ou Email..." />
            <input id="senha-login" placeholder="Senha..." />
            <input type="submit" name="acao" value="Logar!" />
          </form>
          <div className="btn__criarConta">
            <a onClick={abrirModalCriarConta} href="#">Criar conta</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
