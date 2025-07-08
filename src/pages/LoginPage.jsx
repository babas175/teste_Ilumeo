import { useState } from 'react';
import { Dashboard } from './Dashboard';
import { api } from '../services/api';

export function LoginPage() {
  const [usuarioId, setUsuarioId] = useState('');
  const [usuarioValido, setUsuarioValido] = useState(false);
  const [erro, setErro] = useState('');

  const verificarUsuario = () => {
    api.get('/hoje', { params: { usuarioId } })
      .then(() => {
        setUsuarioValido(true);
      })
      .catch(() => {
        setErro('❌ Usuário não encontrado.');
      });
  };

  if (usuarioValido) {
    return <Dashboard usuarioId={usuarioId} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1e1e1e',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '1rem' }}>
          Entrar no sistema
        </h2>

        <input
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          placeholder="Digite seu código de usuário"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #444',
            backgroundColor: '#2a2a2a',
            color: '#fff',
            fontSize: '14px',
            marginBottom: '1rem',
            outline: 'none'
          }}
        />

        <button
          onClick={verificarUsuario}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Entrar
        </button>

        {erro && (
          <p style={{ marginTop: '1rem', color: '#ff6b6b', fontSize: '14px' }}>
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}
