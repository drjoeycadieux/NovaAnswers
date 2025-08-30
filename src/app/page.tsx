import { QASection } from '@/components/qa-section';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Logo />
            <h1 className="text-xl font-bold font-headline ml-2">Nova Answers</h1>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* Nav links can go here */}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Powered by GenAI
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl font-headline">
              Ask Anything, Get Superb Answers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our advanced AI assistant provides comprehensive and attributed answers to your questions.
            </p>
          </div>
          <QASection />
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Logo />
            <p className="text-center text-sm leading-loose md:text-left">
              Built with Next.js and Firebase.
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Nova Answers</p>
        </div>
      </footer>
    </div>
  );
}
