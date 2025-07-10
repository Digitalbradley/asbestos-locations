import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import type { ContactSubmission } from "@shared/schema";

export default function AdminLeads() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<ContactSubmission | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['/api/admin/contacts', page, statusFilter, priorityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '50');
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      
      const response = await fetch(`/api/admin/contacts?${params}`);
      return response.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<ContactSubmission> }) => {
      return apiRequest(`/api/admin/contacts/${data.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data.updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      setSelectedLead(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  const handleUpdateLead = () => {
    if (!selectedLead) return;

    updateMutation.mutate({
      id: selectedLead.id,
      updates: {
        status: status || selectedLead.status,
        priority: priority || selectedLead.priority,
        notes: notes || selectedLead.notes,
        contacted: status === 'contacted',
        contactedAt: status === 'contacted' ? new Date() : selectedLead.contactedAt,
      },
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualificationScore = (notes: string): { score: number; level: string } | null => {
    const scoreMatch = notes?.match(/Quality Score: (\d+)\/100/);
    const levelMatch = notes?.match(/Level: (high|medium|low|rejected)/);
    
    if (scoreMatch && levelMatch) {
      return {
        score: parseInt(scoreMatch[1]),
        level: levelMatch[1]
      };
    }
    return null;
  };

  const getQualificationColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-orange-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-500';
      case 'contacted': return 'bg-blue-500';
      case 'qualified': return 'bg-purple-500';
      case 'converted': return 'bg-green-600';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading leads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {leadsData?.submissions?.map((lead: ContactSubmission) => (
          <Card key={lead.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getPriorityColor(lead.priority || 'normal')}>
                      {lead.priority || 'normal'}
                    </Badge>
                    <Badge className={getStatusColor(lead.status || 'new')}>
                      {lead.status || 'new'}
                    </Badge>
                    {(() => {
                      const qualification = getQualificationScore(lead.notes || '');
                      return qualification ? (
                        <Badge className={getQualificationColor(qualification.level)}>
                          {qualification.level} ({qualification.score}/100)
                        </Badge>
                      ) : null;
                    })()}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Email:</span> {lead.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {lead.phone || 'Not provided'}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Inquiry:</span> {lead.inquiryType}
                </div>
                <div>
                  <span className="font-medium">Subject:</span> {lead.subject}
                </div>
                <div>
                  <span className="font-medium">Message:</span> {lead.message.substring(0, 100)}...
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-500">
                    {lead.pageUrl && (
                      <span>From: {lead.pageUrl}</span>
                    )}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedLead(lead);
                          setNotes(lead.notes || '');
                          setStatus(lead.status || '');
                          setPriority(lead.priority || '');
                        }}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Lead Details - {lead.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Email</Label>
                            <Input value={lead.email} readOnly />
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <Input value={lead.phone || ''} readOnly />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Subject</Label>
                          <Input value={lead.subject} readOnly />
                        </div>
                        
                        <div>
                          <Label>Message</Label>
                          <Textarea value={lead.message} readOnly />
                        </div>
                        
                        {lead.exposure && (
                          <div>
                            <Label>Exposure Details</Label>
                            <Textarea value={lead.exposure} readOnly />
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="qualified">Qualified</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Add notes about this lead..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setSelectedLead(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateLead} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Updating...' : 'Update Lead'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leadsData?.total > 50 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4">
            Page {page} of {Math.ceil(leadsData.total / 50)}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(leadsData.total / 50)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}