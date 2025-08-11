import React, { useState, useEffect, useRef } from "react";
import tmi from "tmi.js";
import "./App.css";

function App() {
    const [messages, setMessages] = useState([]);
    const clientRef = useRef(null);
    const messageLifespan = 15000; // Tempo em ms que uma mensagem permanece na tela (15 segundos)
    const nextPositionRef = useRef(0); // Próxima posição a ser atribuída

    // Extrair usuário da URL
    const getChannelFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user");
        return user || "maahlune"; // Fallback pro melhor canal xD
    };

    // Extrair tema da URL
    const getThemeFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const theme = urlParams.get("theme");
        return theme || "1"; // Tema padrão
    };

    // Efeito para limpar mensagens antigas após o tempo definido
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            const currentTime = Date.now();
            setMessages((prev) => prev.filter((msg) => currentTime - msg.timestamp < messageLifespan));
        }, 1000); // Verifica a cada 1 segundo

        return () => clearInterval(cleanupInterval);
    }, []);

    useEffect(() => {
        if (clientRef.current) return;

        const channel = getChannelFromURL();
        const theme = getThemeFromURL();

        // Aplicar tema ao body
        document.body.className = `theme-${theme}`;

        const client = new tmi.Client({
            connection: { secure: true, reconnect: true },
            channels: [channel],
        });

        clientRef.current = client;
        client.connect();

        console.log(`Conectando ao canal: ${channel}`);

        client.on("message", (channel, userstate, message, self) => {
            if (self) return;

            // Atribuir uma posição fixa para esta mensagem
            const assignedPosition = nextPositionRef.current % 20;
            nextPositionRef.current += 1;

            const newMessage = {
                id: Date.now() + Math.random(),
                username: userstate["display-name"] || "Anônimo",
                text: message,
                emotes: userstate.emotes,
                color: userstate.color || "#ffffff",
                timestamp: Date.now(),
                position: assignedPosition, // Posição fixa atribuída
            };

            // Sem limitação de mensagens
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            if (clientRef.current) {
                clientRef.current.disconnect();
                clientRef.current = null;
            }
        };
    }, []);

    const renderMessage = (text, emotes) => {
        if (!emotes) return text;

        let result = text;
        const emoteArray = [];

        // Coletar emotes
        for (const id in emotes) {
            emotes[id].forEach((pos) => {
                const [start, end] = pos.split("-").map(Number);
                emoteArray.push({ start, end, id });
            });
        }

        emoteArray.sort((a, b) => b.start - a.start);

        // Substituir emotes por imagens
        emoteArray.forEach(({ start, end, id }) => {
            const emoteText = text.substring(start, end + 1);
            const img = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0" alt="${emoteText}" class="emote" />`;
            result = result.substring(0, start) + img + result.substring(end + 1);
        });

        return result;
    };

    return (
        <div className="chat-container">
            <div className="chat-overlay">
                {messages.map((msg) => {
                    // Usa a posição fixa atribuída à mensagem quando foi criada
                    // Aumentado o espaçamento de 4.5% para 5% para evitar sobreposições
                    const topPosition = 5 + msg.position * 5;
                    // Z-index baseado no timestamp para garantir que mensagens mais recentes fiquem na frente
                    const zIndex = Math.floor(msg.timestamp / 1000) % 10000;

                    return (
                        <div
                            key={msg.id}
                            className="message"
                            style={{
                                top: `${topPosition}%`,
                                zIndex: zIndex,
                            }}
                        >
                            <span className="username" style={{ color: msg.color }}>
                                {msg.username}:
                            </span>
                            <span
                                className="text"
                                dangerouslySetInnerHTML={{
                                    __html: renderMessage(msg.text, msg.emotes),
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
