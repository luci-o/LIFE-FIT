import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { GoHome } from 'react-icons/go';
import { FaDumbbell, FaRobot, FaUserAlt } from 'react-icons/fa';
import { BiChat } from 'react-icons/bi';
import { FiSend } from 'react-icons/fi';
import { peticionApi } from '../../services/api'; 

interface Mensaje {
  id: string;
  remitente: 'bot' | 'usuario';
  texto: string;
}

export default function Chat() {
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      remitente: 'bot',
      texto: '¡Hola!, bienvenido a Life Fit.\nTe dejo tus dietas y tus ejercicios, que de igual forma, los podrás ver en sus pestañas correspondientes.\nNo dudes en preguntarme si te surgen dudas.',
    },
  ]);

  const [inputTexto, setInputTexto] = useState('');
  const [cargandoRespuesta, setCargandoRespuesta] = useState(false);
  const [idConversacion, setIdConversacion] = useState<number | null>(null);

  // Obtener idPerfil guardado o usar '1' por defecto
  const idPerfil = localStorage.getItem('idPerfil') || '1';
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargandoRespuesta]);

  // Al cargar el componente, intentamos obtener la conversación activa o sus mensajes
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const convs = await peticionApi(`/perfil/${idPerfil}/conversacion`);
        if (Array.isArray(convs) && convs.length > 0) {
          const actualId = convs[0].ID_CONVERSACION || convs[0].id_conversacion;
          setIdConversacion(actualId);

          const historial = await peticionApi(`/perfil/${idPerfil}/conversacion/${actualId}/mensaje`);
          if (Array.isArray(historial) && historial.length > 0) {
            const formateados: Mensaje[] = historial.map((m: any) => ({
              id: (m.ID_MENSAJE || m.id_mensaje || Date.now()).toString(),
              remitente: (m.EMISOR || m.emisor) === 'USUARIO' ? 'usuario' : 'bot',
              texto: m.TEXTO || m.texto || '',
            }));
            setMensajes(formateados);
          }
        }
      } catch (error) {
        console.error('Error al obtener conversaciones:', error);
      }
    };

    cargarHistorial();
  }, [idPerfil]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTexto.trim() || cargandoRespuesta) return;

    const consulta = inputTexto;
    setInputTexto('');
    setCargandoRespuesta(true);

    // Agregar mensaje del usuario inmediatamente al chat
    const nuevoMensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      remitente: 'usuario',
      texto: consulta,
    };
    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);

    try {
      let convId = idConversacion;

      // Si no hay ID de conversación, la creamos en el momento
      if (!convId) {
        const nuevaConv = await peticionApi(`/perfil/${idPerfil}/conversacion`, {
          method: 'POST',
          body: JSON.stringify({ titulo: 'Chat Principal' }),
        });
        convId = nuevaConv?.ID_CONVERSACION || nuevaConv?.id_conversacion;
        if (convId) {
          setIdConversacion(convId);
        } else {
          throw new Error('No se pudo crear o recuperar la conversación');
        }
      }

      // Enviar mensaje al backend
      const res = await peticionApi(`/perfil/${idPerfil}/conversacion/${convId}/mensaje`, {
        method: 'POST',
        body: JSON.stringify({ texto: consulta }),
      });

      // Extraer el texto retornado por la IA o el Backend
      const respuestaTexto = 
        res?.respuesta?.TEXTO || 
        res?.respuesta?.texto || 
        res?.message || 
        'No se recibió respuesta de la IA.';

      const respuestaBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        remitente: 'bot',
        texto: respuestaTexto,
      };

      setMensajes((prev) => [...prev, respuestaBot]);
    } catch (error: any) {
      console.error('Error al enviar mensaje:', error);
      setMensajes((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          remitente: 'bot',
          texto: `Error al conectar con el servidor: ${error.message || 'Verifica que el backend esté corriendo.'}`,
        },
      ]);
    } finally {
      setCargandoRespuesta(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-800 flex flex-col items-center justify-between p-3 md:p-5 font-sans text-black">
      <nav className="flex items-center gap-6 bg-zinc-300 px-6 py-2 rounded-full shadow-md mb-3 border border-zinc-400">
        <button
          onClick={() => navigate('/home')}
          className={`p-1.5 rounded-2xl transition-colors text-2xl cursor-pointer ${
            location.pathname === '/home'
              ? 'text-white bg-zinc-400 shadow-inner'
              : 'text-zinc-800 hover:text-black'
          }`}
          title="Inicio"
        >
          <GoHome />
        </button>

        <button
          onClick={() => navigate('/rutinas')}
          className={`p-1.5 rounded-2xl transition-colors text-2xl cursor-pointer ${
            location.pathname === '/rutinas'
              ? 'text-white bg-zinc-400 shadow-inner'
              : 'text-zinc-800 hover:text-black'
          }`}
          title="Rutinas"
        >
          <FaDumbbell />
        </button>

        <button
          onClick={() => navigate('/chat')}
          className={`p-1.5 rounded-2xl transition-colors text-2xl cursor-pointer ${
            location.pathname === '/chat'
              ? 'text-white bg-zinc-400 shadow-inner'
              : 'text-zinc-800 hover:text-black'
          }`}
          title="Chat"
        >
          <BiChat />
        </button>
      </nav>

      <main className="w-full max-w-[95%] bg-zinc-300 rounded-[40px] p-6 md:p-10 flex flex-col justify-between h-[88vh] shadow-2xl relative overflow-hidden flex-1">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {mensajes.map((msg) => {
            const esBot = msg.remitente === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${esBot ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-shrink-0 mb-1">
                  {esBot ? (
                    <div className="w-7 h-7 flex items-center justify-center text-xl text-black">
                      <FaRobot />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs">
                      <FaUserAlt />
                    </div>
                  )}
                </div>

                <div
                  className={`max-w-[80%] md:max-w-[65%] px-6 py-4 text-sm md:text-base leading-relaxed whitespace-pre-line shadow-sm ${
                    esBot
                      ? 'bg-white text-black rounded-[24px] rounded-bl-none'
                      : 'bg-black text-white rounded-[24px] rounded-br-none'
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            );
          })}

          {cargandoRespuesta && (
            <div className="flex items-end gap-3 flex-row">
              <div className="flex-shrink-0 mb-1 w-7 h-7 flex items-center justify-center text-xl text-black">
                <FaRobot />
              </div>
              <div className="bg-white text-black px-6 py-4 rounded-[24px] rounded-bl-none text-sm animate-pulse">
                Procesando mensaje con la IA...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleEnviar} className="mt-4 relative flex items-center">
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            placeholder="Escribe..."
            disabled={cargandoRespuesta}
            className="w-full bg-white text-black text-base md:text-lg rounded-full px-8 py-4 pr-16 focus:outline-none shadow-md placeholder-zinc-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputTexto.trim() || cargandoRespuesta}
            className="absolute right-4 text-black hover:scale-110 disabled:opacity-40 transition-all p-2 text-2xl cursor-pointer"
          >
            <FiSend />
          </button>
        </form>
      </main>
    </div>
  );
}