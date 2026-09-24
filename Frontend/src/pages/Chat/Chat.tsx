import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { GoHome } from 'react-icons/go';
import { FaDumbbell, FaRobot, FaUserAlt } from 'react-icons/fa';
import { BiChat } from 'react-icons/bi';
import { FiSend } from 'react-icons/fi';

interface Mensaje {
  id: string;
  remitente: 'bot' | 'usuario';
  texto: string;
}

export default function Chat() {
  const navigate = useNavigate(); // <--- redirige
  const location = useLocation(); // <--- en que ruta esta

  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: '1',
      remitente: 'bot',
      texto: '¡Hola!, bienvenido a Life Fit.\nTe dejo tus dietas y tus ejercicios, que de igual forma, los podrás ver en sus pestañas correspondientes.\nNo doubts en preguntarme si te surgen dudas.',
    },
    {
      id: '2',
      remitente: 'usuario',
      texto: 'Perfecto, gracias.\n¿Podrías decirme si los ejercicios los puedo hacer en cualquier momento?',
    },
  ]);

  const [inputTexto, setInputTexto] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTexto.trim()) return;

    const nuevoMensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      remitente: 'usuario',
      texto: inputTexto,
    };

    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    const consulta = inputTexto;
    setInputTexto('');

    setTimeout(() => {
      const respuestaBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        remitente: 'bot',
        texto: `Recibí tu mensaje: "${consulta}". Podés realizar tus actividades en cualquier momento.`,
      };
      setMensajes((prev) => [...prev, respuestaBot]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-800 flex flex-col items-center justify-between p-3 md:p-5 font-sans text-black">
      {/* Navbar con navegación funcional */}
      <nav className="flex items-center gap-6 bg-zinc-300 px-6 py-2 rounded-full shadow-md mb-3 border border-zinc-400">
        {/* boton home  */}
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

        {/* boton rutinas*/}
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

        {/* boton chat */}
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

      {/* chat principal/general */}
      <main className="w-full max-w-[95%] bg-zinc-300 rounded-[40px] p-6 md:p-10 flex flex-col justify-between h-[88vh] shadow-2xl relative overflow-hidden flex-1">
        
        {/* historial msj */}
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
          <div ref={chatEndRef} />
        </div>

        {/* chat abajo */}
        <form onSubmit={handleEnviar} className="mt-4 relative flex items-center">
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            placeholder="Escribe..."
            className="w-full bg-white text-black text-base md:text-lg rounded-full px-8 py-4 pr-16 focus:outline-none shadow-md placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={!inputTexto.trim()}
            className="absolute right-4 text-black hover:scale-110 disabled:opacity-40 transition-all p-2 text-2xl cursor-pointer"
          >
            <FiSend />
          </button>
        </form>
      </main>
    </div>
  );
}