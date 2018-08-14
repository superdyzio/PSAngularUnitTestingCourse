import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let component : MessagesComponent;
  let mockMessageService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj('MessageService', []);

    component = new MessagesComponent(mockMessageService);
  });
});
