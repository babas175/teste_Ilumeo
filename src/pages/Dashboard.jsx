import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Dashboard({ usuarioId }) {
  const [historico, setHistorico] = useState([]);
  const [totalHoras, setTotalHoras] = useState(0);
  const [status, setStatus] = useState('');
  const [turnoAberto, setTurnoAberto] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [usuarioId]);

  const carregarDados = () => {
    api.get('/hoje', { params: { usuarioId } }).then((res) => {
      setTotalHoras(res.data.totalHoras || 0);
      const turnos = res.data.turnos || [];
      const algumAberto = turnos.some((t) => !t.end);
      setTurnoAberto(algumAberto);
      if (algumAberto) setStatus('🟢 Turno em andamento');
    });

    api.get('/historico', { params: { usuarioId } }).then((res) => {
      setHistorico(res.data || []);
    });
  };

  const iniciarTurno = () => {
    api.post('/iniciar', { usuarioId }).then(() => {
      setStatus('✅ Controle de ponto iniciado!');
      carregarDados();
    });
  };

  const finalizarTurno = () => {
    api.post('/finalizar', { usuarioId }).then(() => {
      setStatus('⏹️ Turno finalizado.');
      carregarDados();
    });
  };

  const sair = () => {
    window.location.href = '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        borderRadius: '12px',
        padding: '2rem',
        backgroundColor: '#1e1e1e'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700 }}>
            Relógio de ponto
          </h1>
          <button onClick={sair} style={{
            padding: '6px 14px',
            backgroundColor: '#333',
            color: '#ccc',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500
          }}>
            Sair
          </button>
        </div>

        <p style={{ color: '#bbb', fontSize: '14px', marginTop: 4 }}>
          Usuário: <strong>{usuarioId}</strong>
        </p>

        <hr style={{ margin: '20px 0', borderColor: '#333' }} />

        <section>
          <h2 style={{ fontSize: '18px' }}>Horas de hoje</h2>
          <p style={{
            fontSize: '22px',
            fontWeight: 'bold',
            marginTop: 4
          }}>
            {Math.floor(totalHoras)}h {Math.round((totalHoras % 1) * 60)}m
          </p>

          {status && (
            <div style={{
              marginTop: '0.5rem',
              padding: '10px',
              backgroundColor: turnoAberto ? '#2e2e2e' : '#264d26',
              color: turnoAberto ? '#e0a800' : '#7fff7f',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              {status}
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={iniciarTurno}
              disabled={turnoAberto}
              style={{
                marginRight: 10,
                padding: '10px 16px',
                backgroundColor: turnoAberto ? '#555' : '#388e3c',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: turnoAberto ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              Hora de entrada
            </button>
            <button
              onClick={finalizarTurno}
              disabled={!turnoAberto}
              style={{
                padding: '10px 16px',
                backgroundColor: !turnoAberto ? '#555' : '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: !turnoAberto ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              Hora de saída
            </button>
          </div>
        </section>

        <section style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Dias anteriores</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: '1rem' }}>
            {historico.length > 0 ? (
              historico.map((registro, index) => {
                const dataStr = registro.data || registro.dia;
                const dataFormatada = dataStr ? new Date(dataStr).toLocaleDateString() : 'Data inválida';
                const horas = registro.totalHoras?.toFixed(2) ?? '0.00';

                return (
                  <li key={index} style={{
                    backgroundColor: '#2b2b2b',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '15px',
                    color: '#ddd'
                  }}>
                    <span>📅 {dataFormatada}</span>
                    <span>{horas}h</span>
                  </li>
                );
              })
            ) : (
              <li style={{ color: '#888' }}>Nenhum registro anterior</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
