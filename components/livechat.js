import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { getSixIp } from "../api-util/getSixIp";

import Background from "./LiveChat-Componetns/background";
import InputBox from "./LiveChat-Componetns/inputbox";
import MessageList from "./LiveChat-Componetns/messageList";

import styles from "./livechat.module.css";

let socket;

function LiveChat() {
  const [messageData, setMessageData] = useState([]);
  const [sixIp, setSixIp] = useState("");
  const userInput = useRef(null);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    const sixIp = await getSixIp();
    setSixIp(sixIp);
    socket = io();

    socket.on("connect", () => {
      console.log("연결됨");
      socket.emit("loadingMessage");
    });

    socket.on("updateMessage", (data) => {
      setMessageData(data);
    });
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  const sendMessageHandler = (e) => {
    e.preventDefault();
    const enteredUserInput = userInput.current.value;
    socket.emit("newMessage", { text: enteredUserInput, sixIp: sixIp });
    userInput.current.value = "";
  };

  return (
    <>
      <Background />
      <div className={styles.components}>
        <h2>LiveChat</h2>
        <MessageList messageData={messageData} />
        <InputBox sendMessageHandler={sendMessageHandler} ref={userInput} />
      </div>
    </>
  );
}
export default LiveChat;