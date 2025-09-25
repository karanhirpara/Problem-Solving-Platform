import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Trophy, Book, Users, Target, Clock, LogIn, UserPlus } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Code className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              CodeBattle
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master competitive programming with challenging contests, comprehensive problem sets, and real-time code submission
          </p>
          <div className="flex gap-4 justify-center">
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link to="/signin" className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/signup" className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Sign Up
                </Link>
              </Button>
            </div>
            <Button size="lg" asChild>
              <Link to="/contests" className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Join Contest
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/problems" className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Browse Problems
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need for competitive programming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Trophy className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Live Contests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Participate in real-time competitive programming contests with global rankings
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Problem Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access hundreds of carefully curated problems across all difficulty levels
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Multi-Language Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Submit solutions in C++, Java, Python, JavaScript, and more programming languages
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Problems</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Contests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <div className="text-muted-foreground">Submissions</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
