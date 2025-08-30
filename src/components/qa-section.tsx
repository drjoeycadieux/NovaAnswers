'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Bot, User, CornerDownLeft, Loader2, BookCheck, History } from 'lucide-react';

import { askQuestionAction, type FormState, type ChatHistoryItem } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { AdPlaceholder } from './ad-placeholder';
import { Separator } from './ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          Ask Nova <CornerDownLeft className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

function AnswerSkeleton() {
    return (
        <Card className="mt-8">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div className="w-full space-y-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ChatHistory({ history }: { history: ChatHistoryItem[] }) {
    if (history.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="flex items-center text-2xl font-bold font-headline mb-6">
                <History className="mr-3 h-6 w-6 text-primary" />
                Your Chat History
            </h2>
            <div className="space-y-8">
                {history.map((item) => (
                    <Card key={item.id} className="shadow-md">
                        <CardContent className="p-6">
                             <div className="flex items-start space-x-4 mb-4">
                                <User className="mt-1 h-8 w-8 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-lg">{item.question}</p>
                                </div>
                            </div>
                            <Separator className="my-4"/>
                            <div className="flex items-start space-x-4 mt-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Bot className="h-6 w-6" />
                                </div>
                                <div className="prose-like max-w-none text-foreground flex-1"
                                    dangerouslySetInnerHTML={{ __html: item.answer.replace(/\n/g, '<br />') }} />
                            </div>
                            {item.sources && item.sources.length > 0 && (
                                <>
                                <Separator className="my-6" />
                                <div className="mt-6">
                                    <h3 className="flex items-center text-lg font-semibold font-headline">
                                        <BookCheck className="mr-2 h-5 w-5"/>
                                        Sources
                                    </h3>
                                    <ul className="mt-3 list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                    {item.sources.map((source, index) => (
                                        <li key={index} className="break-words">{source}</li>
                                    ))}
                                    </ul>
                                </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export function QASection() {
  const initialState: FormState = {};
  const [state, formAction] = useActionState(askQuestionAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    if (!loading && user) {
      toast({
        title: 'Signed In',
        description: `Welcome back, ${user.email}`,
      });

      const fetchHistory = async () => {
          setHistoryLoading(true);
          if (!user) return;
          const q = query(collection(db, "users", user.uid, "chats"), orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const chatHistory = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                  id: doc.id,
                  question: data.question,
                  answer: data.answer,
                  sources: data.sources,
                  createdAt: (data.createdAt as Timestamp).toDate(),
              }
          });
          setHistory(chatHistory);
          setHistoryLoading(false);
      }
      fetchHistory();
    } else if (!loading && !user) {
        setHistory([]);
        setHistoryLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  useEffect(() => {
    if (state.attributedAnswer) {
      formRef.current?.reset();
      answerRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Prepend the new chat to the history
      if (state.question) {
        const newChatItem: ChatHistoryItem = {
            id: new Date().toISOString(), // Temporary ID
            question: state.question,
            answer: state.attributedAnswer,
            sources: state.sources || [],
            createdAt: new Date(),
        }
        setHistory(prev => [newChatItem, ...prev]);
      }
    }
  }, [state.attributedAnswer, state.question, state.sources]);

  return (
    <div className="mx-auto max-w-3xl mt-8">
      <Card className="relative shadow-lg">
        <CardContent className="p-0">
          <form action={formAction} ref={formRef}>
            <div className="flex items-start p-4">
              <User className="mr-4 mt-2 h-8 w-8 text-muted-foreground flex-shrink-0" />
              <Textarea
                name="question"
                placeholder="e.g., What is the future of renewable energy?"
                className="pr-40 text-base border-0 focus-visible:ring-0 shadow-none resize-none min-h-[60px]"
                required
              />
            </div>
            <div className="p-4 pt-0 flex justify-end items-center border-t">
              <p className="text-xs text-muted-foreground mr-auto">Ask a question to our AI assistant.</p>
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
      
      {state.question && state.attributedAnswer && (
        <div ref={answerRef}>
          <Card className="mt-8 animate-in fade-in duration-500 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="prose-like max-w-none text-foreground flex-1"
                     dangerouslySetInnerHTML={{ __html: state.attributedAnswer.replace(/\n/g, '<br />') }} />
              </div>
              {state.sources && state.sources.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="mt-6">
                    <h3 className="flex items-center text-lg font-semibold font-headline">
                        <BookCheck className="mr-2 h-5 w-5"/>
                        Sources
                    </h3>
                    <ul className="mt-3 list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      {state.sources.map((source, index) => (
                        <li key={index} className="break-words">{source}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              <div className="mt-8">
                  <AdPlaceholder />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {historyLoading ? (
          <div className="mt-12 space-y-8">
              <AnswerSkeleton />
              <AnswerSkeleton />
          </div>
      ) : (
        <ChatHistory history={history} />
      )}
    </div>
  );
}
