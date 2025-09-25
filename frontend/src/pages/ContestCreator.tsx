import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, ClockIcon } from "lucide-react";

const ContestCreator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    status: 'upcoming'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contestId, setContestId] = useState('');

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
      const response = await fetch('http://localhost:3000/contest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setContestId(result.id || result.id || 'Generated successfully');
        
        toast({
          title: "Success",
          description: "Contest created successfully!",
        });
      } else {
        throw new Error('Failed to create contest');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create contest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      status: 'upcoming'
    });
    setContestId('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contest Creator</h1>
        <p className="text-muted-foreground mt-2">
          Create competitive programming contests
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contest Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contest Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Contest Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Codeforces Round #123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Describe the contest, rules, and format..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    End Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    Start Time *
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    End Time *
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-3 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Active</option>
                  <option value="finished">Finished</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating...' : 'Create Contest'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearForm}
                  className="flex-1"
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contest ID Display */}
        <Card>
          <CardHeader>
            <CardTitle>Contest Information</CardTitle>
          </CardHeader>
          <CardContent>
            {contestId ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Contest Created Successfully!</h3>
                  <div className="space-y-2">
                    <Label>Contest ID:</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={contestId} 
                        readOnly 
                        className="font-mono"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(contestId);
                          toast({
                            title: "Copied!",
                            description: "Contest ID copied to clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>• Use this Contest ID when creating problems for this contest</p>
                  <p>• Share this ID with participants</p>
                  <p>• Keep this ID safe for contest management</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Create a contest to see the generated Contest ID</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContestCreator;