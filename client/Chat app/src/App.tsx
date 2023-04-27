import { useEffect, useState } from "react";
import {io, Socket } from "socket.io-client";
import "./App.css";
import JoinRoomForm from './components/JoinRoomForm'

const socket: Socket = io("http://localhost:5000"); 

function App() {
	const [roomId, setRoomId] = useState(0)
	const [username, setUsername] = useState('')

	useEffect(() => {
		socket.emit('join_room', {
			room: roomId,
			user: username
		})
	}, [roomId])

	function onUserRoomJoin(id: number, username: string) {
		setRoomId(id)
		setUsername(username)
	}

    return (
		<>	
			{roomId ? (
				//*Logged in and data is retrieved
				<h1>Room id: {roomId}</h1>
			) : ( 
				//*Not logged in yet
				<JoinRoomForm joinRoom={onUserRoomJoin}/>
			)}
			
		</>
    );
}

export default App;
