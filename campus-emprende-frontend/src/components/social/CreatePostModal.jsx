import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../store/post/postSlice';
import { Button } from '../ui/button';

const CreatePostModal = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  // In a real scenario we'd handle file uploads to AWS here
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    dispatch(createPost({ 
      content, 
      imageUrls: imageUrl ? [imageUrl] : [] 
    }));
    
    setContent('');
    setImageUrl('');
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Crear Publicación</Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card text-card-foreground rounded-xl border border-border w-full max-w-lg shadow-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-lg">Crear una publicación</h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="¿De qué te gustaría hablar?"
                className="w-full bg-transparent border-none outline-none resize-none min-h-[120px] text-foreground"
                autoFocus
              />
              
              <div className="mt-4 pt-4 border-t border-border">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL de imagen (Opcional - AWS S3 próximamente)"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={!content.trim()}>
                  Publicar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostModal;
