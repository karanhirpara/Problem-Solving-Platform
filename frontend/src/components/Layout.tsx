import { Link, useLocation } from "react-router-dom";
import { Code, Trophy, Book, User, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
              <Code className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                CodeBattle
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/contests"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname.startsWith('/contests')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Trophy className="h-4 w-4" />
                Contests
              </Link>
              <Link
                to="/problems"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname.startsWith('/problems')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Book className="h-4 w-4" />
                Problems
              </Link>
              <Link
                to="/problem-setter"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname.startsWith('/problem-setter')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Settings className="h-4 w-4" />
                Problem Setter
              </Link>
              <Link
                to="/contest-creator"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname.startsWith('/contest-creator')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Trophy className="h-4 w-4" />
                Contest Creator
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;