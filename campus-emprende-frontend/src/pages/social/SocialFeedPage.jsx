import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeed } from '../../store/post/postSlice';
import { getUnreadCount } from '../../store/notification/notificationSlice';
import PostCard from '../../components/social/PostCard';
import CreatePostModal from '../../components/social/CreatePostModal';
import { Button } from '../../components/ui/button';

const SocialFeedPage = () => {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFeed({ page: 0, size: 20 }));
    dispatch(getUnreadCount());
  }, [dispatch]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inicio</h1>
          <p className="text-muted-foreground mt-1">Descubre lo que comparte la comunidad.</p>
        </div>
        <CreatePostModal />
      </div>

      <div className="space-y-6">
        {feed.map((post) => (
          <PostCard key={post.id} post={post} currentUser={user} />
        ))}

        {feed.length === 0 && !loading && (
          <div className="text-center py-12 border border-border rounded-xl bg-card">
            <p className="text-muted-foreground">Tu feed está vacío. ¡Sigue a otros usuarios o crea tu primera publicación!</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <span className="text-primary font-medium">Cargando publicaciones...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeedPage;
