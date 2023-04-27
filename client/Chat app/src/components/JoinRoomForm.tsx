import { useState } from "react";
import "../App.css";

export interface JoinRoomFormProps {
    joinRoom: (id: number, name: string) => void
}

export default function App({joinRoom}: JoinRoomFormProps) {
    const [roomId, setRoomId] = useState(0);
    const [username, setUsername] = useState("");

    const handleButtonClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        joinRoom(event.currentTarget.room.value, event.currentTarget.username.value);
    };


    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <form onSubmit={handleButtonClick} className="flex flex-col items-center border border-blue-400 rounded-lg p-2 w-56 h-64">
                <h2 className="h-12">Join the room</h2>
                <div className="flex flex-col justify-around m-auto h-full">
                    <div className="w-full">
                        <label htmlFor="room">Room id</label>
                        <input
                            className="border border-blue-400 rounded-lg w-fit"
                            type="number"
                            min="0"
                            required
                            name="room"
                            id="room"
                            onChange={(e) => setRoomId(Number(e.target.value))}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="username">Username</label>
                        <input
                            className="border border-blue-400 rounded-lg w-fit"
                            type="text"
                            name="username"
                            id="username"
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <input type="submit" value="Go" className="" />
                </div>
            </form>
        </div>
    );
}
