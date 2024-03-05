import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
// import { MessageService } from '../message.service';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent {
  @Input() message: Message;
  messageSender: string;
  constructor(private contactService: ContactService) { }

  ngOnInit() {
    const contact: Contact = this.contactService.getContact(this.message.sender);
    this.messageSender = contact.name;
  }

}
