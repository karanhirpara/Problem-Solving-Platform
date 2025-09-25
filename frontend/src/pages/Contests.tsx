import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Contest {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
}
interface Problem {
  _id: string;
  problemName: string;
  statement: string;
  input: string;
  output: string;
  exampleInput: string;
  exampleOutput: string;
  allInput: string;
  allOutput: string;
  note?: string;
  visible: boolean;
  contest: string;
}
const Contests = () => {

  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('http://localhost:3000/showcontest');
        const result = await response.json();
        
        if (result.success) {
          console.log(result.data);``
          setContests(result.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch contests",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to connect to server",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [toast]);
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-success text-success-foreground';
      case 'upcoming':
        return 'bg-info text-info-foreground';
      case 'finished':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return `${date} ${time}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contests</h1>
            <p className="text-muted-foreground mt-2">
              Loading contests...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contests</h1>
          <p className="text-muted-foreground mt-2">
            Participate in competitive programming contests
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {contests.map((contest) => (
          <Card key={contest._id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">{contest.title}</CardTitle>
                  <Badge className={getStatusColor(contest.status)}>
                    {contest.status.toUpperCase()}
                  </Badge>
                </div>
                {contest.status==="live" && (
                  <Button asChild>
                    <Link to={`/ContestDetail`}
                    state={contest._id} 
                    >Join Contest</Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-muted-foreground">{contest.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Start: {formatDateTime(contest.startDate, contest.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>End: {formatDateTime(contest.endDate, contest.endTime)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Contests;