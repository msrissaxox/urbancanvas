'use client'
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";



export default function CommentSection(){
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Sarah Chen',
      text: 'Beautiful composition! Love the lighting in this shot.',
      date: '2024-02-23 14:30'
    },
    {
      id: 2,
      user: 'Mike Johnson',
      text: 'Great capture! The colors are amazing.',
      date: '2024-02-23 15:45'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    setComments([...comments, {
      id: comments.length + 1,
      user: 'Current User',
      text: newComment,
      date: formattedDate
    }]);
    setNewComment('');
  };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{comments.length} Comments</span>
        </button>
      </div>

      {isOpen && (
        <div className="bg-white rounded-lg shadow p-4">
          {/* Comment List */}
          <div className="space-y-4 mb-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-8 h-8" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.user}</span>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" size="sm" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Post
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};


