import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Contact = () => {
  const { user } = useAppContext();

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Fetch all support cases
  const fetchCases = async () => {
    try {
      const { data } = await axios.get('/contact');
      setCases(data.cases || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch cases');
    }
  };

  // Fetch messages for a specific case
  const fetchMessages = async (caseId) => {
    setSelectedCase(caseId);
    setMessages([]);
    try {
      const { data } = await axios.get(`/contact/${caseId}`);
      setMessages(data.messages || []);
      setTimeout(scrollToBottom, 100); // scroll after render
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch messages');
    }
  };

  // Submit a new support case
  const submitNewCase = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/contact', {
        subject: subject || 'New Issue',
        message: newMessage.trim(),
      });
      toast.success(data.message || 'Case created');
      setNewMessage('');
      setSubject('');
      fetchCases();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  // Reply to selected case
  const replyToCase = async () => {
    if (!newMessage.trim() || !selectedCase) return;
    setLoading(true);
    try {
      await axios.post(`/contact/${selectedCase}`, { message: newMessage.trim() });
      toast.success('Reply sent');
      setNewMessage('');
      fetchMessages(selectedCase);
      fetchCases(); // update lastMessageAt in cases list
    } catch (err) {
      console.error(err);
      toast.error('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCases();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-blue-100 flex overflow-hidden">
        {/* Cases List */}
        <div className="w-1/3 border-r p-4 flex flex-col">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Your Support Cases</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {cases.length === 0 ? (
              <p className="text-gray-500">No support cases yet.</p>
            ) : (
              cases.map(c => (
                <div
                  key={c.caseId}
                  className={`p-3 border rounded cursor-pointer hover:bg-blue-50 ${selectedCase === c.caseId ? 'bg-blue-100' : ''}`}
                  onClick={() => fetchMessages(c.caseId)}
                >
                  <p className="font-medium">{c.subject || 'No Subject'}</p>
                  <small className="text-gray-500">
                    Status: {c.status} | Last: {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString() : '-'}
                  </small>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setSelectedCase(null)}
            className="mt-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Case
          </button>
        </div>

        {/* Messages / New Case Panel */}
        <div className="w-2/3 p-4 flex flex-col">
          {selectedCase ? (
            <>
              <h3 className="text-lg font-bold mb-2">Messages</h3>
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-gray-500">No messages yet.</p>
                ) : (
                  messages.map(m => (
                    <div key={m.entityKey} className="p-2 rounded border">
                      <strong>{m.sender}:</strong> {m.message}
                      <small className="block text-gray-400">{new Date(m.createdAt).toLocaleString()}</small>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Create a New Support Case</h3>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (optional)"
                className="w-full mb-2 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* Message Input */}
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={selectedCase ? "Type your reply..." : "Describe your issue..."}
            />
            <button
              onClick={selectedCase ? replyToCase : submitNewCase}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading || !newMessage.trim()}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
