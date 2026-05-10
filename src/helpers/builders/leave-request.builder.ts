export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity Leave';

export interface LeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  comment: string;
}

export class LeaveRequestBuilder {
  private request: LeaveRequest = {
    leaveType: 'Annual Leave',
    startDate: this.formatDate(new Date()),
    endDate: this.formatDate(new Date()),
    comment: '',
  };

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  withLeaveType(leaveType: LeaveType): this {
    this.request.leaveType = leaveType;
    return this;
  }

  withStartDate(date: string): this {
    this.request.startDate = date;
    return this;
  }

  withEndDate(date: string): this {
    this.request.endDate = date;
    return this;
  }

  withComment(comment: string): this {
    this.request.comment = comment;
    return this;
  }

  forDays(count: number): this {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + count - 1);
    this.request.startDate = this.formatDate(start);
    this.request.endDate = this.formatDate(end);
    return this;
  }

  build(): LeaveRequest {
    return { ...this.request };
  }
}
