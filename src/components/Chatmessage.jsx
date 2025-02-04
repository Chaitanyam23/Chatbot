import Icon from "./Icon";
const Chatmessage = ({ chat }) => {
  return (
    <div className={`message ${chat.role === "model" ? "bot" : "user"}-message`}>
      {chat.role === "model" && <Icon />}
      {chat.image ? (
        <img
          src={chat.image}
          alt="Uploaded content"
          className="chat-image"
        />
      ) : (
        <p className="message-text">{chat.text}</p>
      )}
    </div>
  );
};

export default Chatmessage;
