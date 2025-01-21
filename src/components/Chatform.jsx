import { useRef } from 'react';

const Chatform = ({chatHistory, setChatHistory, generateBotResponse}) => {

const inputRef = useRef();
const fileinputRef = useRef();

    const handleFileclick = () => {
        
        if(fileinputRef.current){
        fileinputRef.current.click();
    }
};

const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update chat history with image placeholder
    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = reader.result;
      setChatHistory((history) => [
        ...history,
        { role: 'user', text: '[Image uploaded]', image: imageUrl }
      ]);

      // Simulate AI response delay
      setTimeout(() => {
        setChatHistory((history) => [
          ...history,
          { role: 'model', text: 'Thinking....' }
        ]);

        // Call the bot response generator or backend to analyze the image
        generateBotResponse({ image: file });
      }, 600);
    };
    reader.readAsDataURL(file);
  };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        //update chat history with user message
        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        //adding thinking message
        setTimeout(() => {
            setChatHistory((history) => [...history, { role: "model", text: "Thinking...." },]);
        //call function to generate bot response
            generateBotResponse([...chatHistory, { role: "user", text: userMessage },]);
        }, 600);
    };

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Message.." className="message-input" required />
           <div className="chat-controls"> 
            <div className="file-upload" >   
            <input ref={fileinputRef} type="file" accept="image/*" onChange={handleFileChange} id="file-input" hidden/>
            <button type="button" id ="file-input" className="material-symbols-rounded" onClick={handleFileclick}>attach_file</button>
            </div>
            <button type="submit" id = "send-message" className="material-symbols-rounded">  keyboard_arrow_up
            </button>
            </div>
        </form>
    )
}

export default Chatform