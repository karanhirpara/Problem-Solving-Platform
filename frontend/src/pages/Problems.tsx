import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Target, Clock, CheckCircle } from "lucide-react";
import{ useState,useEffect } from 'react';
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
const Problems = () => {
  // this problemset share as data to child page /problems
     const [problemset, setProblemset] = useState<Problem[]>([]);
     useEffect(() => {
  const getProblemset = async () =>{
   try {
      const response = await fetch('http://localhost:3000/problemset', {
       method: 'GET',
       credentials: 'include',
        headers: { 'Content-Type': 'application/json' },

      });
      if (response.ok) {
        const result = await response.json();
        setProblemset(result.data);
    
       
      } else {
        throw new Error('Failed to create contest');
      }
    } catch (error) {
     console.error('Error fetching problems:', error);
    }
  
  }
 
    getProblemset(); // runs only once when component mounts
  }, []); //

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-easy border-easy';
      case 'medium':
        return 'text-medium border-medium';
      case 'hard':
        return 'text-hard border-hard';
      default:
        return 'text-muted-foreground border-muted';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Problem Set</h1>
          <p className="text-muted-foreground mt-2">
            Practice competitive programming problems
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input placeholder="Search problems..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Problems</SelectItem>
            <SelectItem value="solved">Solved</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Problems List */}
      <div className="grid gap-4">
        {problemset.map((problem) => (
         
          <Card key={problem._id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  
                  <Link 
                    to={`/problemDetail`}
                    state={problem}
          
                    className="hover:text-primary transition-colors"
                  >
                    <CardTitle className="text-xl">{problem.problemName}</CardTitle>
                  </Link>
                  
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Problems;