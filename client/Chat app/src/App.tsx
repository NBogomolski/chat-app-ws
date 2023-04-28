import { FormEvent, useEffect, useState } from "react";
import {io, Socket } from "socket.io-client";
import "./App.css";
import JoinRoomForm from './components/JoinRoomForm'

const socket: Socket = io("http://localhost:5000"); 

interface Message {
	author: string;
	text: string;
	date: Date;
    room: number;
}


function App() {
	const [roomId, setRoomId] = useState<number>(0)
	const [username, setUsername] = useState('')
	const [roomUsers, setRoomUsers] = useState<string[]>([])
	const [messages, setMessages] = useState<Message[]>([])
    const [currentMessage, setCurrentMessage] = useState<string>('')

/*     useEffect(() => {
        
        return () => {
            socket.off('joinRoomActivated')
            socket.off('recieveMessage')
        }
    }, []) */

	useEffect(() => {
        if (roomId == 0) return
        socket.emit("joinRoom", {
            room: Number(roomId),
            user: username,
        });
        
        socket.on("recieveMessage", (data: Message) => {
            setMessages((prev) => [...prev, data]);
        });
        socket.on("joinRoomActivated", ({ room, username, connected }) => {
            console.log("Room activated", room, username,connected);
            if (room == roomId) {
                setRoomUsers((prev) => {
                    if (prev.includes(username))
                        return prev
                    else
                        return [...prev, username];
                });
            }
        });

        return () => {
            socket.off("joinRoom");
            socket.off("joinRoomActivated");
            socket.off("recieveMessage");
        };
    }, [roomId]);

	function onUserRoomJoin(id: number, username: string) {
		setRoomId(Number(id))
		setUsername(username)
		setRoomUsers([username])
	}

    function sendMessage() {
        if (currentMessage == '') return
        const message: Message = {
            author: username,
            text: currentMessage,
            date: new Date(),
            room: roomId,
        };
        socket.emit("sendMessage", message)
    
    }

    return (
        <>
            {roomId ? (
                //*Logged in and data is retrieved
                <div className="h-screen flex justify-center items-center ">
                    <div className="border border-blue-400 rounded-lg flex flex-row p-3 h-4/6 blue-50">
                        <div>
                            <h1>Room id: {roomId}</h1>
                            <h1>
                                Room users:{" "}
                                {roomUsers.map((user) => (
                                    <h1 key={user}>{user}</h1>
                                ))}
                            </h1>
                        </div>
                        <div className="m-auto-0 w-72 border border-blue-400 ml-4 flex flex-col">
                            <div className="flex-grow h-full overflow-y-auto">
								{messages.map((message, idx) => {
									return (
									<div key={idx}>
										<h3>{message.author}</h3>
										<p>{message.text}</p>
										<p>{message.date.toLocaleTimeString()}</p>
									</div>)
								})}
                            </div>
                            <div className="h-8 border-t border-t-blue-400 flex flex-row">
                                <input
                                    className="flex-grow pl-2"
                                    placeholder="Enter message"
                                    required
                                    type="text"
                                    name="message"
                                    id="message"
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                />
                                <button onClick={sendMessage} className="flex bg-blue-400 px-2">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                //*Not logged in yet
                <JoinRoomForm joinRoom={onUserRoomJoin} />
            )}
        </>
    );
}

export default App;
