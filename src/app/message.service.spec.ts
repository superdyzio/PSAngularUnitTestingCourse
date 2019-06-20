import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    service = new MessageService();
  });

  it('should add message to array', () => {
    expect(service.messages.length).toEqual(0);
    service.add('Message 1');
    expect(service.messages.length).toBe(1);
  });

  it('should remove all messages', () => {
    service.messages = ['Message1', 'Message2'];
    expect(service.messages.length).toBe(2);
    service.clear();
    expect(service.messages.length).toBe(0);
  });
});
