import { Book } from './BookCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book;
  isProfile?: boolean;
}

export function ShareDialog({ open, onOpenChange, book, isProfile = false }: ShareDialogProps) {
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const socialPlatforms = [
    { name: 'WhatsApp', color: 'bg-green-500', textColor: 'text-white' },
    { name: 'X (Twitter)', color: 'bg-black', textColor: 'text-white' },
    { name: 'Threads', color: 'bg-black', textColor: 'text-white' },
    { name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500', textColor: 'text-white' },
    { name: 'Facebook', color: 'bg-blue-600', textColor: 'text-white' },
    { name: 'LinkedIn', color: 'bg-blue-700', textColor: 'text-white' },
  ];

  const getShareText = () => {
    if (isProfile) {
      return `Confira meu perfil de leitura! 📚 ${customMessage}`;
    }
    if (book) {
      return `${customMessage || `Acabei de adicionar \"${book.title}\" de ${book.author} à minha estante! 📚`}`;
    }
    return '';
  };

  const getShareUrl = () => {
    // URL fictícia para demonstração
    return isProfile 
      ? 'https://meuapp.com/perfil/leitor123'
      : `https://meuapp.com/livro/${book?.id}`;
  };

  const handleShare = (platform: string) => {
    const text = getShareText();
    const url = getShareUrl();
    const fullMessage = `${text}\n\n${url}`;

    // URLs reais dos aplicativos/plataformas
    const shareUrls = {
      'WhatsApp': `https://wa.me/?text=${encodeURIComponent(fullMessage)}`,
      'X (Twitter)': `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      'Threads': `https://threads.net/intent/post?text=${encodeURIComponent(fullMessage)}`,
      'Instagram': `https://www.instagram.com/`, // Instagram não suporta share direto via URL
      'Facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      'LinkedIn': `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
    };

    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const getDialogDescription = () => {
    if (isProfile) {
      return 'Compartilhe seu perfil de leitura com seus amigos nas redes sociais e mostre quais livros você está lendo e já leu.';
    }
    if (book) {
      return `Compartilhe "${book.title}" de ${book.author} com seus amigos nas redes sociais ou copie o link para enviar diretamente.`;
    }
    return 'Compartilhe este conteúdo com seus amigos nas redes sociais.';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isProfile ? 'Compartilhar perfil' : 'Compartilhar livro'}
          </DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview do item a ser compartilhado */}
          {book && !isProfile && (
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-20 bg-muted rounded overflow-hidden">
                    <ImageWithFallback
                      src={book.cover}
                      alt={`Capa do livro ${book.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{book.title}</h4>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    {book.rating && book.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs" aria-label="Avaliação">⭐</span>
                        <span className="text-xs">{book.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Mensagem personalizada */}
          <div>
            <label htmlFor="custom-message" className="block text-sm font-medium mb-2">
              Mensagem personalizada (opcional)
            </label>
            <Textarea
              id="custom-message"
              placeholder={isProfile 
                ? 'Adicione uma mensagem sobre seu perfil de leitura...'
                : 'Adicione uma mensagem sobre este livro...'
              }
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              aria-describedby="message-help"
            />
            <p id="message-help" className="text-xs text-muted-foreground mt-1">
              Esta mensagem será incluída no seu compartilhamento
            </p>
          </div>
          
          {/* Botões das redes sociais */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Compartilhar em:
            </label>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Opções de compartilhamento">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  className={`${platform.color} ${platform.textColor} border-0 hover:opacity-90`}
                  onClick={() => handleShare(platform.name)}
                  aria-label={`Compartilhar no ${platform.name}`}
                >
                  {platform.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Copiar link */}
          <div>
            <label htmlFor="share-url" className="block text-sm font-medium mb-2">
              Ou copie o link:
            </label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={getShareUrl()}
                readOnly
                className="flex-1"
                aria-label="Link para compartilhamento"
              />
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="px-3"
                aria-label={copied ? 'Link copiado' : 'Copiar link'}
              >
                {copied ? (
                  'Copiado!'
                ) : (
                  <Copy size={16} />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-1" role="status" aria-live="polite">
                Link copiado para a área de transferência!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}