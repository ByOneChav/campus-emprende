import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reactToPost } from '../../store/post/postSlice';
import { Button } from '../ui/button';

const PostCard = ({ post, currentUser }) => {
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);

  // Check if current user has reacted
  const userReaction = post.reactions?.find(r => r.user.id === currentUser?.id);

  const handleReact = (type) => {
    dispatch(reactToPost({ postId: post.id, type }));
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          {post.author.fullName.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold">{post.author.fullName}</h4>
          <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        
        {post.images && post.images.length > 0 && (
          <div className="mt-3 grid gap-2 grid-cols-2">
            {post.images.map((img, i) => (
              <img key={i} src={img.imageUrl} alt="Post content" className="rounded-lg object-cover w-full max-h-64" />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3 flex items-center gap-4 text-muted-foreground text-sm">
        <button 
          onClick={() => handleReact('LIKE')}
          className={`flex items-center gap-1 hover:text-primary transition-colors ${userReaction?.reactionType === 'LIKE' ? 'text-primary font-medium' : ''}`}
        >
          <span>👍</span> {post.reactions?.length || 0}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <span>💬</span> {post.comments?.length || 0} Comentarios
        </button>
        <button className="flex items-center gap-1 hover:text-foreground transition-colors">
          <span>🔄</span> {post.shares?.length || 0} Compartir
        </button>
      </div>

      {showComments && (
        <div className="mt-4 border-t border-border pt-4">
          {/* We will render CommentSection here */}
          <p className="text-sm text-muted-foreground">La sección de comentarios está en construcción.</p>
        </div>
      )}
    </div>
  );
};

export default PostCard;
