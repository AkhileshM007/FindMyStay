import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

const Messages = () => {
  const { listingId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const enquiryOnly = searchParams.get("enquiryOnly") === "true";
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // <-- Success message state
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!enquiryOnly) {
      fetch(`/api/message?listingId=${listingId}&userId=${userId}`)
        .then((res) => res.json())
        .then(setMessages);
    }
  }, [listingId, userId, enquiryOnly]);

  const handleSend = async (e) => {
    e.preventDefault();
    const payload = {
      listingId,
      receiverId: userId,
      content,
    };
    if (currentUser) payload.senderId = currentUser._id;
    else {
      payload.senderName = senderName;
      payload.senderEmail = senderEmail;
      payload.senderContact = senderContact;
    }

    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const newMsg = await res.json();
    setMessages((msgs) => [...msgs, newMsg]);
    setContent("");
    setSenderName("");
    setSenderEmail("");
    setSenderContact("");
    setSuccessMsg("Your enquiry has been successfully submitted!"); // <-- Set success message
    setTimeout(() => setSuccessMsg(""), 4000); // <-- Hide after 4 seconds
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      {successMsg && (
        <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">{successMsg}</div>
      )}
      {/* Only show chat history if not enquiryOnly and user is logged in */}
      {!enquiryOnly && currentUser && (
        <div className="border rounded p-2 h-64 overflow-y-auto mb-2 bg-gray-50">
          {Array.isArray(messages) ? (
            messages.map((msg) => (
              <div key={msg._id} className="mb-2">
                <span className="inline-block px-2 py-1 rounded bg-blue-100">
                  {msg.senderName ? <b>{msg.senderName}: </b> : null}
                  {msg.content}
                </span>
              </div>
            ))
          ) : (
            <div className="text-red-500">No messages or an error occurred.</div>
          )}
        </div>
      )}
      <form onSubmit={handleSend} className="flex flex-col gap-2">
        {!currentUser && (
          <>
            <input
              className="border rounded px-2 py-1"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your name"
              required
            />
            <input
              className="border rounded px-2 py-1"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="Your email "
            />
            <input
              className="border rounded px-2 py-1"
              value={senderContact}
              onChange={(e) => setSenderContact(e.target.value)}
              placeholder="Your contact info"
            />
          </>
        )}
        <input
          className="flex-1 border rounded px-2 py-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          required
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">
          {currentUser ? "Send" : "Enquire Now"}
        </button>
      </form>
    </div>
  );
};

export default Messages;