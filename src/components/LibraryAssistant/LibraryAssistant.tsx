import { useState, useEffect, useRef, type JSX } from 'react';
import {
  FaComment, FaTimes, FaBook, FaSearch, FaQuestionCircle,
  FaInfoCircle
} from 'react-icons/fa';
import './LibraryAssistant.css';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL_Categorias_Recursos_Electronicos;

type Category = {
  ID_Categoria_Recursos_Electronicos: string;
  Nombre: string;
  Activo: boolean; 
};

export const LibraryAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string | JSX.Element; isUser: boolean }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickOptions = [
    { text: 'Consulta de horarios', icon: <FaInfoCircle /> },
    { text: 'Búsqueda de libros por categoria', icon: <FaSearch /> },
    { text: 'Préstamos', icon: <FaBook /> },
    { text: 'Renovación de préstamo en línea', icon: <FaBook /> },
    { text: 'Consulta de recursos electrónicos de paga', icon: <FaBook /> },
    { text: 'Contacto directo', icon: <FaQuestionCircle /> },
  ];

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get<Category[]>(`${BASE_URL}/get-categorias`);
      const activeCategories = data.filter(cat => cat.Activo);
      setCategories(activeCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Opcional: puedes manejar el error de forma más específica
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }
    }
  };




  const botResponses: Record<string, JSX.Element> = {
    'consulta de horarios': (
      <>
        Los horarios de atención de la biblioteca son:<br />
        Lunes a Viernes: 09:00–14:00 y 17:00–20:00<br />
        Sábado y Domingo: Cerrado.
      </>
    ),

    'búsqueda de libros': (
      <>
        Contamos con las siguientes categorías de recursos electrónicos:<br />
        {categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category.ID_Categoria_Recursos_Electronicos}>
                • <a
                  href={`/recursos-electronicos/${category.ID_Categoria_Recursos_Electronicos}`}
                  className="bot-link"
                >
                  {category.Nombre}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <span>Cargando categorías o no hay categorías disponibles.</span>
        )}
      </>
    ),

    'préstamos': (
      <>
        Para realizar un préstamo:<br />
        1. Acude a la Biblioteca.<br />
        2. Selecciona el libro.<br />
        3. Dirígete con la bibliotecóloga y llena la papeleta.<br />
        <strong>*El ejemplar 1 no está disponible para préstamo.*</strong>
      </>
    ),

    'renovación de préstamo en línea': (
      <>
        Para renovar tu préstamo, visita la sección{' '}
        <a href="/renovacion" className="bot-link">Renovación</a>.
      </>
    ),

    'consulta de recursos electrónicos': (
      <>
        Contamos con una seccion de recursos de paga.<br />
        Puedes consultarlos en la seccion de "AYUDA"{' '}
        <a href="/ayuda" className="bot-link">Digitalia y Pearson</a>.
      </>
    ),

    'contacto directo': (
      <>
        Puedes escribirnos directamente a:<br />
        ✉️ Lesliee Lizbeth Martínez Rodríguez<br />
        📩 biblioteca@upqroo.edu.mx<br />
      </>
    ),
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
useEffect(() => {
  fetchCategories(); 
}, []);

  useEffect(() => {
    if (!isOpen || messages.length > 0) return;

    setTimeout(() => {
      setMessages([
        {
          text: '¡Bienvenido a la Biblioteca Virtual Kaxáant! ¿En qué puedo ayudarte?',
          isUser: false,
        },
        {
          text:
            'Puedo ayudarte con:\n' +
            '• Consulta de horarios\n' +
            '• Búsqueda de libros\n' +
            '• Préstamos\n' +
            '• Renovación de préstamo en línea\n' +
            '• Consulta de recursos electrónicos\n' +
            '• Contacto directo\n\n' +
            'Selecciona una opción.',
          isUser: false,
        },
      ]);
    }, 600);
  }, [isOpen, messages.length]);

  const handleSendMessage = async (messageToSend: string) => {
    setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
    setIsTyping(true);

    setTimeout(async () => {
      const lowerMessage = messageToSend.toLowerCase();
      let response: string | JSX.Element = (
        <>
          Puedo ayudarte con:<br />
          • Consulta de horarios<br />
          • Búsqueda de libros<br />
          • Préstamos<br />
          • Renovación de préstamo en línea<br />
          • Consulta de recursos electrónicos<br />
          • Contacto directo<br />
          <br />
          Selecciona una opción.
        </>
      );

      
      if (lowerMessage.includes('consulta de recursos electrónicos')) {
        await fetchCategories(); 
        response = botResponses['consulta de recursos electrónicos']; 
      } else {
        for (const key in botResponses) {
          if (lowerMessage.includes(key)) {
            response = botResponses[key];
            break;
          }
        }
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  const handleQuickOption = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className="assistant-container">
      <button
        className="assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente virtual'}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComment size={24} />}
      </button>

      {isOpen && (
        <div className="assistant-chat" ref={chatRef}>
          <div className="chat-header">
            <h3>Asistente Biblioteca Kaxáant</h3>
          </div>

          <div className="chat-body">
            <div className="chat-messages-section">
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                    {typeof msg.text === 'string' ? (
                      msg.text.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))
                    ) : (
                      msg.text
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="quick-options">
              {quickOptions.map((option, index) => (
                <button
                  key={index}
                  className="quick-option"
                  onClick={() => handleQuickOption(option.text)}
                >
                  {option.icon} {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};