import React, { useState, useEffect, useRef } from "react";
import tmi from "tmi.js";
import "./App.css";

function App() {
    const [messages, setMessages] = useState([]);
    const clientRef = useRef(null);

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

            const newMessage = {
                id: Date.now() + Math.random(),
                username: userstate["display-name"] || "Anônimo",
                text: message,
                emotes: userstate.emotes,
                color: userstate.color || "#ffffff",
            };

            setMessages((prev) => [...prev.slice(-19), newMessage]);
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
                {messages.map((msg, index) => (
                    <div key={msg.id} className="message" style={{ top: `${5 + index * 7}%` }}>
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
                ))}
            </div>
        </div>
    );
}

export default App;
