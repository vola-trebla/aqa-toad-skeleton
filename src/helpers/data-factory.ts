interface Ticket {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  assignee?: string;
}

export class TicketBuilder {
  private ticket: Ticket = {
    title: `Auto-ticket-${Date.now()}`,
    description: 'Auto-generated ticket for testing',
    priority: 'Medium',
    category: 'Hardware',
  };

  withTitle(title: string): this {
    this.ticket.title = title;
    return this;
  }

  withPriority(priority: Ticket['priority']): this {
    this.ticket.priority = priority;
    return this;
  }

  withCategory(category: string): this {
    this.ticket.category = category;
    return this;
  }

  withAssignee(assignee: string): this {
    this.ticket.assignee = assignee;
    return this;
  }

  critical(): this {
    this.ticket.priority = 'Critical';
    return this;
  }

  build(): Ticket {
    return { ...this.ticket };
  }
}

interface Asset {
  name: string;
  type: 'Hardware' | 'Software' | 'License';
  serialNumber: string;
  status: 'Active' | 'Retired' | 'In Stock';
  assignedTo?: string;
}

export class AssetBuilder {
  private asset: Asset = {
    name: `Asset-${Date.now()}`,
    type: 'Hardware',
    serialNumber: `SN-${Math.random().toString(36).substring(7).toUpperCase()}`,
    status: 'Active',
  };

  ofType(type: Asset['type']): this {
    this.asset.type = type;
    return this;
  }

  assignedTo(user: string): this {
    this.asset.assignedTo = user;
    return this;
  }

  retired(): this {
    this.asset.status = 'Retired';
    return this;
  }

  build(): Asset {
    return { ...this.asset };
  }
}
