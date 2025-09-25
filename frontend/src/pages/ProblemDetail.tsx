import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Clock, Target, Send, Code } from "lucide-react";
import { useEffect } from "react";import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'react-router-dom';


const languages = [
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

const ProblemDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [problemId,setProblemId] = useState('');


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

  const handleSubmit = async () => {
   console.log(code,selectedLanguage,problemId);
    if (code.trim() && problemId) {
        try {
      const response = await fetch('http://localhost:3000/run', {
       method: 'POST',
        credentials: "include",
              headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, lang: selectedLanguage, problemid: problemId }),
      });
      if (response.ok) {
        const result = await response.json();
       console.log(result);
      } else {
        throw new Error('Failed to create contest');
      }
    } catch (error) {
     console.error('Error fetching problems:', error);
    }
  
    }
  
  };
    const location = useLocation();
    const data = (location.state ?? undefined);
    useEffect(() => {
    if (data?._id) {
      setProblemId(data._id); // ✅ safe: runs only once
    }
  }, [data]); //
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Problem Statement */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">{data.problemName}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {data.statement}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-base">Input</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {data.input}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-base">Output</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {data.output}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-base">Example</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <div className="text-xs font-medium mb-2 flex items-center justify-between">
                    <span>Input</span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">Copy</Button>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap">{data.exampleInput}</pre>
                </div>
              </div>
              <div>
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <div className="text-xs font-medium mb-2 flex items-center justify-between">
                    <span>Output</span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">Copy</Button>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap">{data.exampleOutput}</pre>
                </div>
              </div>
            </div>
          </div>

          {data.note && (
            <div>
              <h3 className="font-semibold mb-2 text-base">Note</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {data.note}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <CardTitle>Submit Solution</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSubmit} 
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Write your ${languages.find(l => l.value === selectedLanguage)?.label} solution here...`}
            className="min-h-[300px] bg-code-bg font-mono text-sm focus-visible:ring-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemDetail;