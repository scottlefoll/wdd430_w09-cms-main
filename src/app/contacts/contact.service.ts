import { EventEmitter, Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs";

import { Contact } from "./contact.model";
import { MessageService } from "../messages/message.service";

@Injectable({
  providedIn: 'root'
})

export class ContactService{
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  private editMode: boolean = false;
  private addMode: boolean = false;
  maxContactId: number;
  contacts: Contact[] = [];

  // Inject the HttpClient object into the DocumentService class through dependency injection.
  // The HttpClient object will be used to send HTTP requests to the server.
  constructor(private http: HttpClient, private messageService: MessageService) {}

  addContact(newContact: Contact){
    if(!newContact){
      return;
    }

    this.maxContactId = this.getMaxId();
    newContact.id = String(this.maxContactId + 1);

    if (newContact.group) {
      newContact.group.forEach(contact => {
        if (!contact.group) {
          contact.group = [];
        }
        // check if the contact is already in the group
        if (!contact.group.some(existingContact => existingContact.id === newContact.id)) {
          contact.group.push(newContact);
        }
        contact.group.push( newContact );
      })

    }
    this.contacts.push(newContact);
    // this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  getContacts() {
    // From Database:
    this.http.get('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts.length = 0;
          this.contacts = contacts;
          // this.contacts = this.sortContacts(contacts);
          this.maxContactId = this.getMaxId();
          // this.contacts.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
          this.contacts.sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  getContact(id: string): Contact{
    for(let contact of this.contacts){
      if(contact.id === id){
        return contact;
      }
    }
    return null;
  }

  getEditMode(): boolean {
    return this.editMode;
  }

  setEditMode(value: boolean): void {
    this.editMode = value;
  }

  getAddMode(): boolean {
    return this.addMode;
  }

  setAddMode(value: boolean): void {
    this.addMode = value;
  }

  updateContact(originalContact: Contact, newContact: Contact){
    if(!originalContact || !newContact){
      console.error('Contact not found - update unsuccessful!');
      alert('Contact not found - update unsuccessfull!');
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if(pos < 0){
      alert('Contact not found - update unsuccessfull!');
      console.error('Contact not found - update unsuccessful!');
      return;
    }

    // Initialize originalContact.group as an empty array if it's null or undefined
    originalContact.group = originalContact.group || [];
    newContact.id = originalContact.id;
    // Assign values of the newContact to the originalContact
    this.contacts[pos] = newContact;

    // Update the contact list
    // this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
    return;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      alert('Contact not found - deletion unsuccessfull!');
      console.error('Contact not found - deletion unsuccessful!');
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      alert('Contact not found - deletion unsuccessfull!');
      console.error('Contact not found - deletion unsuccessful!');
      return;
    }
    this.messageService.deleteMessages(contact.id);
    this.contacts.splice(pos, 1);
    // this.contactChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  storeContacts() {
    let contacts = JSON.stringify(this.contacts);
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/contacts.json', contacts, {headers: headers})
      .subscribe(response => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      if (contact) {
        const parsedId = parseInt(contact.id, 10); // Explicitly use radix 10 for clarity
        if (!isNaN(parsedId)) { // Check for valid numeric ID
          if (parsedId > maxId) {
            maxId = parsedId;
          }
        }
      }
    }

    return maxId;
  }

}


