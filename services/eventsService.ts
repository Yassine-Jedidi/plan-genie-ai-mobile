import { eventsAPI } from './eventsAPI';

export interface Event {
  id: string;
  title: string;
  date_time: string | null;
  date_time_text: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateEventData {
  title: string;
  date_time: string;
}

export interface UpdateEventData {
  title: string;
  date_time: string;
}

class EventsService {
  async getEvents(userId: string): Promise<Event[]> {
    try {
      const events = await eventsAPI.getEvents(userId);
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async createEvent(title: string, date_time: string): Promise<Event> {
    try {
      const event = await eventsAPI.saveManualEvent(title, date_time);
      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, title: string, date_time: string): Promise<Event> {
    try {
      const event = await eventsAPI.updateEvent(eventId, title, date_time);
      return event;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<{ message: string }> {
    try {
      const result = await eventsAPI.deleteEvent(eventId);
      return result;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Helper method to group events by date
  groupEventsByDate(events: Event[]): Record<string, Event[]> {
    const grouped: Record<string, Event[]> = {};
    
    events.forEach(event => {
      if (event.date_time) {
        const date = new Date(event.date_time);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      }
    });
    
    return grouped;
  }

  // Helper method to get events for a specific month
  getEventsForMonth(events: Event[], year: number, month: number): Event[] {
    return events.filter(event => {
      if (!event.date_time) return false;
      const eventDate = new Date(event.date_time);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  }

  // Helper method to format date for display
  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export const eventsService = new EventsService(); 