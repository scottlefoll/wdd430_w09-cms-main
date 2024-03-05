import { Subscription } from 'rxjs';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts: Contact[] = [];
  contactId: string;
  subscription: Subscription;
  term: string;

  constructor(private contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute) {
    this.contacts = this.contactService.getContacts();
  }

  ngOnInit() {
    this.contactService.contactChangedEvent
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
        }
      );

    this.subscription = this.contactService.contactListChangedEvent
      .subscribe(
        (contactsList: Contact[]) => {
          this.contacts = contactsList;
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNewContact(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  isEditMode(): boolean {
    return this.contactService.getEditMode();
  }

  isAddMode(): boolean {
    return this.contactService.getAddMode();
  }

  search(value: string) {
    this.term = value
  }
}
