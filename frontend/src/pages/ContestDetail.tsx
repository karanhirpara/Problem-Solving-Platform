import { Link,useLocation} from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Contests from "./Contests";
import { useState } from "react";
const navItems = [
  { name: "PROBLEMS", active: true },
  { name: "SUBMIT CODE", active: false },
  { name: "MY SUBMISSIONS", active: false },
  { name: "STATUS",path: "/standings", active: false },
  { name: "HACKS", active: false },
  { name: "STANDINGS",path: "/standings", active: false },
  { name: "CUSTOM INVOCATION",active: false },
];
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
const ContestDetail = () => { 
     const location = useLocation();
    const data = (location.state ?? undefined);
 
      const [problemset, setProblemset] = useState<Problem[]>([]);
      const [count, setCount] = useState(0);
   const getProblemset = async () =>{
   try {
      const response = await fetch(`http://localhost:3000/contestproblems/${data}`, {
       method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const result = await response.json();
        setProblemset(result.data);
    
       (result.data);
      } else {
        throw new Error('Failed to create contest');
      }
    } catch (error) {
     console.error('Error fetching problems:', error);
    }
  
  }
getProblemset();

 
  return (
    
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-muted/30 p-1 rounded-lg">
        {navItems.map((item) => (
          <Link
          key={item.name}
          to={item.path}
           state={data}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            location.pathname.startsWith(item.path)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {item.name}
        </Link>
        ))}
      </div>

      {/* Problems Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Problems</h2>
          <Link to="/problemset" className="text-primary hover:underline text-sm">
            Complete problemset →
          </Link>
        </div>

        {/* Problems Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 text-center font-semibold">#</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="text-right w-32 font-semibold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             
              {problemset.map((problem) => (
                
                <TableRow key={problem._id} className="hover:bg-muted/50">
                  <TableCell className="text-center font-medium">
                    <Link 
                       to={`/problemDetail`}
                    state={problem}
                      className="text-primary hover:underline font-semibold"
                    >
                      *
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Link 
                         to={`/problemDetail`}
                    state={problem}
                        className="text-primary hover:underline font-medium"
                      >
                        {problem.problemName}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        standard input/output
                      </div>
                      <div className="text-xs text-muted-foreground">

                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-primary font-medium">
                        x{3001}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
  
};

export default ContestDetail;