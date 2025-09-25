import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ProblemSetter = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    problemName: '',
    statement: '',
    input: '',
    output: '',
    exampleInput: '',
    exampleOutput: '',
    allInput: '',
    allOutput: '',
    note: '',
    contestId: '',
    point: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Problem created successfully!",
        });
        // Reset form
        setFormData({
          problemName: '',
          statement: '',
          input: '',
          output: '',
          exampleInput: '',
          exampleOutput: '',
          allInput: '',
          allOutput: '',
          note: '',
          contestId: '',
          point: 0
        });
      } else {
        throw new Error('Failed to create problem');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      problemName: '',
      statement: '',
      input: '',
      output: '',
      exampleInput: '',
      exampleOutput: '',
      allInput: '',
      allOutput: '',
      note: '',
      contestId: '',
      point: 0
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Problem Setter</h1>
        <p className="text-muted-foreground mt-2">
          Create competitive programming problems
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contestId">Contest ID</Label>
                  <Input
                    id="contestId"
                    value={formData.contestId}
                    onChange={(e) => handleInputChange('contestId', e.target.value)}
                    placeholder="Enter Contest ID (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemName">Problem Name *</Label>
                  <Input
                    id="problemName"
                    value={formData.problemName}
                    onChange={(e) => handleInputChange('problemName', e.target.value)}
                    placeholder="e.g., G. Wafu!"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statement">Problem Statement *</Label>
                  <Textarea
                    id="statement"
                    value={formData.statement}
                    onChange={(e) => handleInputChange('statement', e.target.value)}
                    rows={6}
                    placeholder="Describe the problem scenario, constraints, and what needs to be solved..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="input">Input Format *</Label>
                  <Textarea
                    id="input"
                    value={formData.input}
                    onChange={(e) => handleInputChange('input', e.target.value)}
                    rows={4}
                    placeholder="Describe the input format, constraints, and structure..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="output">Output Format *</Label>
                  <Textarea
                    id="output"
                    value={formData.output}
                    onChange={(e) => handleInputChange('output', e.target.value)}
                    rows={3}
                    placeholder="Describe what the output should contain..."
                    required
                  />
                  <div className="space-y-2">
                  <Label htmlFor="problemName">point *</Label>
                  <Input
                    id="point"
                    value={formData.point}
                    onChange={(e) => handleInputChange('point', e.target.value)}
                    placeholder="e.g., G. Wafu!"
                    required
                  />
                </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="exampleInput">Example Input *</Label>
                  <Textarea
                    id="exampleInput"
                    value={formData.exampleInput}
                    onChange={(e) => handleInputChange('exampleInput', e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="Paste the example input here..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exampleOutput">Example Output *</Label>
                  <Textarea
                    id="exampleOutput"
                    value={formData.exampleOutput}
                    onChange={(e) => handleInputChange('exampleOutput', e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="Paste the expected output here..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allInput">All Input</Label>
                  <Textarea
                    id="allInput"
                    value={formData.allInput}
                    onChange={(e) => handleInputChange('allInput', e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="Complete input data for all test cases..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allOutput">All Output</Label>
                  <Textarea
                    id="allOutput"
                    value={formData.allOutput}
                    onChange={(e) => handleInputChange('allOutput', e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="Expected output for all test cases..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    rows={4}
                    placeholder="Add explanation, hints, or additional notes..."
                  />
                  
                </div>
              </div>
            </div>
                
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6 border-t">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? 'Creating...' : 'Create Problem'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={clearForm}
                className="px-8"
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemSetter;