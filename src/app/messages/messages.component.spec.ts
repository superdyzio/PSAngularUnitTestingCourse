import { MessagesComponent } from './messages.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MessageService } from '../message.service';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgForOf } from '@angular/common';

fdescribe('MessagesComponent', () => {
  let fixture: ComponentFixture<MessagesComponent>;
  let component: MessagesComponent;
  let messageService: MessageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessagesComponent],
      providers: [MessageService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    messageService = TestBed.get(MessageService);
    messageService.messages = ['komunikat 1', 'komunikat 2'];
    fixture.detectChanges();
  });

  it('should not render anything when messages list is empty', () => {
    messageService.clear();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('h2'))).toBeFalsy();
  });

  it('should not render anything after press button clear', () => {
    fixture.debugElement
      .queryAll(By.css('button'))[0]
      .triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('h2'))).toBeFalsy();
  });

  it('should render title and 4 messages when messages list contains 4 messages', () => {
    const expectedArray: string[] = [1, 2, 3, 4].map(e => 'komunikat ' + e);
    messageService.add('komunikat 3');
    messageService.add('komunikat 4');
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('h2')).nativeElement.textContent
    ).toContain('Messages');
    expect(fixture.debugElement.queryAll(By.css('div.message')).length).toEqual(
      4
    );
    expect(
      fixture.debugElement
        .queryAll(By.css('div.message'))
        .map((e: DebugElement) => e.nativeElement.textContent.trim())
    ).toEqual(expectedArray);
  });
});
