import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Inbox = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [replyToMsgId, setReplyToMsgId] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    fetch(`/api/message/inbox/${currentUser._id}`)
      .then((res) => res.json())
      .then(setMessages);
  }, [currentUser]);

  // Delete message handler
  const handleDeleteMessage = async (msgId) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;
    await fetch(`/api/message/${msgId}`, {
      method: "DELETE",
    });
    setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Inbox</h2>
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg._id} className="mb-2 border-b pb-2">
            <div>
              <b>From:</b> {msg.senderName || "User"} {msg.senderEmail && `(${msg.senderEmail})`}
            </div>
            <div>
              <b>Listing:</b>{" "}
              {msg.listing && msg.listing.name
                ? `${msg.listing.name} (${msg.listing.address})`
                : "Listing info not available"}
            </div>
            {msg.senderContact && (
              <div>
                <b>Contact Info:</b> {msg.senderContact}
              </div>
            )}
            <div>
              <b>Message:</b> {msg.content}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(msg.createdAt).toLocaleString()}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="text-red-600 underline"
                onClick={() => handleDeleteMessage(msg._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No messages received yet.</div>
      )}
    </div>
  );
};

export default Inbox;