'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { InvitationStatus } from '@/types/invitation';

interface InvitationFiltersProps {
  status: InvitationStatus | 'all';
  search: string;
  onStatusChange: (status: InvitationStatus | 'all') => void;
  onSearchChange: (search: string) => void;
}

export function InvitationFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: InvitationFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">
          Search invitations
        </Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by email or name..."
            className="pl-8"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full sm:w-[200px]">
        <Label htmlFor="status" className="sr-only">
          Filter by status
        </Label>
        <Select value={status} onValueChange={(value) => onStatusChange(value as InvitationStatus | 'all')}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
