'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvitationActions } from './InvitationActions';
import { InvitationFilters } from './InvitationFilters';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatDistanceToNow } from 'date-fns';
import type { Invitation, InvitationStatus } from '@/types/invitation';

interface InvitationListProps {
  invitations: Invitation[];
  onResend: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
}

const statusColors: Record<InvitationStatus, string> = {
  pending: 'bg-gray-500',
  sent: 'bg-blue-500',
  accepted: 'bg-green-500',
  expired: 'bg-red-500',
  cancelled: 'bg-gray-400',
};

const ITEMS_PER_PAGE = 10;

export function InvitationList({
  invitations,
  onResend,
  onCancel,
}: InvitationListProps) {
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInvitations = useMemo(() => {
    return invitations.filter((invitation) => {
      const matchesStatus = statusFilter === 'all' || invitation.status === statusFilter;
      const matchesSearch =
        searchQuery === '' ||
        invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (invitation.user?.name && invitation.user.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [invitations, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredInvitations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvitations = filteredInvitations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
        <div className="mt-4">
          <InvitationFilters
            status={statusFilter}
            search={searchQuery}
            onStatusChange={(status) => {
              setStatusFilter(status);
              setCurrentPage(1);
            }}
            onSearchChange={(search) => {
              setSearchQuery(search);
              setCurrentPage(1);
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Sent Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvitations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No invitations found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {invitation.user?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[invitation.status]}>
                        {invitation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(invitation.created_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invitation.expires_at) > new Date()
                        ? formatDistanceToNow(new Date(invitation.expires_at), {
                            addSuffix: true,
                          })
                        : 'Expired'}
                    </TableCell>
                    <TableCell>
                      {invitation.sent_at ? '1' : '0'}
                      {invitation.sent_at && (
                        <span className="text-xs text-muted-foreground block">
                          Last: {formatDistanceToNow(new Date(invitation.sent_at), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <InvitationActions
                        invitation={invitation}
                        onResend={onResend}
                        onCancel={onCancel}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
