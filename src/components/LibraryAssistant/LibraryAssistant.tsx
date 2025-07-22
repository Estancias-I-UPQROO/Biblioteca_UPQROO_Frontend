import { useState, useEffect, useRef } from 'react';
import { FaComment, FaTimes, FaBook, FaSearch, FaQuestionCircle, FaInfoCircle, FaPaperPlane } from 'react-icons/fa';
import './LibraryAssistant.css';

export const LibraryAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efecto para auto-scroll al fondo del chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Efecto para detectar clics fuera del chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const quickOptions = [
    { text: 'Consulta de horarios', icon: <FaInfoCircle /> },
    { text: 'Búsqueda de libros', icon: <FaSearch /> },
    { text: 'Préstamos', icon: <FaBook /> },
    { text: 'Renovación de préstamo en línea', icon: <FaBook /> },
    { text: 'Consulta de recursos electrónicos', icon: <FaBook /> },
    { text: 'Contacto directo', icon: <FaQuestionCircle /> }
  ];

  const botResponses: Record<string, string> = {
    'consulta de horarios': 'Los horarios de atención de la biblioteca son:\nLunes a Viernes:\n09:00–14:00 y 17:00–20:00\nSábado y Domingo: Cerrado.',
    'búsqueda de libros': 'Para buscar libros puedes usar el catálogo en línea: https://siabuc.ucol.mx/upqroo\nTambién puedes explorar los recursos electrónicos disponibles.',
    'préstamos': 'Para realizar un préstamo:\n1. Acude a la Biblioteca.\n2. Selecciona el libro.\n3. Dirígete con la bibliotecóloga y llena la papeleta.\n*El ejemplar 1 no está disponible para préstamo.*',
    'renovación de préstamo en línea': 'Para renovar tu préstamo:\nIngresa a la sección "Renovación" en nuestro sistema y completa los datos solicitados.',
    'consulta de recursos electrónicos': 'Nuestra biblioteca ofrece acceso a:\n• Digitalia\n• Pearson\n• Recursos gratuitos como revistas electrónicas, diccionarios y más.',
    'contacto directo': 'Puedes escribirnos directamente a:\n✉️ Lesliee Lizbeth Martínez Rodríguez\n📩 biblioteca@upqroo.edu.mx\n📞 998 283 1859'
  };

  useEffect(() => {
    if (!isOpen) return;

    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          { 
            text: '¡Bienvenido a la Biblioteca Virtual Kaxáant! ¿En qué puedo ayudarte?', 
            isUser: false 
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
              'Selecciona una opción o escribe tu duda.',
            isUser: false 
          }
        ]);
      }, 600);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = (text?: string) => {
    const messageToSend = text || inputMessage;
    if (!messageToSend.trim()) return;

    setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = messageToSend.toLowerCase();
      let response = 'Puedo ayudarte con:\n• Consulta de horarios\n• Búsqueda de libros\n• Préstamos\n• Renovación de préstamo en línea\n• Consulta de recursos electrónicos\n• Contacto directo\n\nEscribe tu pregunta o elige una opción.';

      for (const key in botResponses) {
        if (lowerMessage.includes(key)) {
          response = botResponses[key];
          break;
        }
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
 
  const handleQuickOption = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className="assistant-container">
      <button 
        className="assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente virtual"}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComment size={24} />}
      </button>

      {isOpen && (
        <div className="assistant-chat" ref={chatRef}>
          <div className="chat-header">
            <h3>Asistente Biblioteca Kaxáant</h3>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
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
          
          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu pregunta..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};