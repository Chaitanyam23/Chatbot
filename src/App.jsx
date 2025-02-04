import { useEffect, useRef, useState } from "react" 
import Chatform from "./components/Chatform"
import Chatmessage from "./components/Chatmessage"
import Icon from "./components/Icon"

const App = () => {

  const [chatHistory, setChatHistory] = useState([]);
  const  chatBodyRef = useRef();
  

  const generateBotResponse = async (input) => {
    const updateHistory = (text) => {
      setChatHistory((prev) =>
        [...prev.filter((msg) => msg.text !== "Thinking...."), { role: "model", text }]
      );
    };
   
   
    if (input.image) {
      // Handle image analysis
      const userMessage = input.inputMessage || ""; // Default to empty if not provided
      console.log(input.image);
  
    
      const formData = new FormData();
      formData.append("file", input.image);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1]; // Extract base64 string
        console.log("base64Image", base64Image);
      
  
      try {
        // API call to analyze the image
        const userData = {
          message: null,
          file:{
            data:null,
            mime_type:null,
          }
        }
        userData.file={
          data:base64Image,
          mime_type:"image/jpeg",
        }
        const requestOptions = {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: JSON.stringify({ 
            contents: [{
              parts: [
                { text: userMessage }, 
                ...(input.image ? [{ inline_data: userData.file }] : [])
              ],  
            }],
          }),
        
        };

        const response = await fetch (import.meta.env.VITE_API_URL,requestOptions);
        const data = await response.json();
        console.log("api response", data);
  
        if (!response.ok) throw new Error(data.error.message || "Failed to analyze the image");
  
        // Update chat history with bot response (image analysis result)

        const botResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        updateHistory(botResponse);
      } catch (error) {
        console.error(error);
        updateHistory("An error occurred while analyzing the image. Please try again.");
      }
    };
     reader.readAsDataURL(input.image);
  } else if (Array.isArray(input)) {
      // Handle text-based messages
      const history = input.map(({ role, text }) => ({ role, parts: [{ text }] }));
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history }),
      };
  
      try {
        // API call to get bot response for text
        const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.error.message || "Something went wrong");
  
        // Update chat history with bot response
        const botResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        updateHistory(botResponse);
      } catch (error) {
        console.error(error);
        updateHistory("An error occurred while processing your message. Please try again.");
      }
    }
  };
  

  useEffect(() => {
    //auto-chat scroll
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight,behaviour :"smooth"});
  },[chatHistory]);

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* Header*/}
        <div className="chatbot-header">
          <div className="header-info">
            <Icon />
            <h2 className="logo-text">CHATBOT</h2>
            </div>
            <button className="material-symbols-rounded">  keyboard_arrow_down
            </button>
        </div>

          {/*Body */}
          <div ref = {chatBodyRef} className="chatbot-body">
            <div className=" message bot-message">
              <Icon/>
              <p className="message-text">heyy!!!<br/>How can I help you ?</p>
            </div>

          {/* Rendering the Chat messages */}
          {chatHistory.map((chat, index) => (
             <Chatmessage key={index} chat= {chat}/>
          ))}
          </div>

          {/*Footer */}
          <div className="chatbot-footer">
         <Chatform chatHistory ={chatHistory} setChatHistory = {setChatHistory} generateBotResponse = {generateBotResponse}/>
          </div>
      </div>
    </div>
  )
}
  
export default App