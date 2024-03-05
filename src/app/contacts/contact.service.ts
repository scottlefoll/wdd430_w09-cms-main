import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Contact } from "./contact.model";
import { MOCKCONTACTS } from "./MOCKCONTACTS";

@Injectable({
  providedIn: 'root'
})

export class ContactService{
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;
  private editMode = false;

  contacts: Contact[] = [];

  constructor() {
    this.contacts = this.sortContacts(MOCKCONTACTS);
    this.maxContactId = this.getMaxId();
  }

  addContact(newContact: Contact){
    if(!newContact){
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    if (newContact.group) {
      newContact.group.forEach(contact => {
        if (!contact.group) {
          contact.group = [];
        }
        contact.group.push( newContact );
      })

    }
    this.contacts.push(newContact);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts(){
    return this.contacts.slice();
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

  updateContact(originalContact: Contact, newContact: Contact){
    if(!originalContact || !newContact){
      alert('Contact not found - update unsuccessfull!');
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if(pos < 0){
      alert('Contact not found - update unsuccessfull!');
      return;
    }

    // Initialize originalContact.group as an empty array if it's null or undefined
    originalContact.group = originalContact.group || [];
    newContact.id = originalContact.id;
    // Assign values of the newContact to the originalContact
    this.contacts[pos] = newContact;
    // Update the contact list
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      alert('Contact not found - deletion unsuccessfull!');
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      alert('Contact not found - deletion unsuccessfull!');
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.next(this.contacts.slice());
  }

  private sortContacts(contacts: Contact[]): Contact[] {
    const groups = contacts.filter(contact => contact.group && contact.group.length > 0);
    const individuals = contacts.filter(contact => !contact.group);

    const sortedGroups = groups.sort((a, b) => a.name.localeCompare(b.name));
    let sortedContacts: Contact[] = [];

    const lastName = (name: string) => {
      const spaceIndex = name.indexOf(' ');
      return spaceIndex !== -1 ? name.substring(spaceIndex + 1) : name;
    };

    sortedGroups.forEach(group => {

      sortedContacts.push(group);
      const sortedMembers = group.group.sort((a, b) => lastName(a.name).localeCompare(lastName(b.name)));

      sortedMembers.forEach(member => {
        const memberDetail = contacts.find(contact => contact.id === member.id);
        if (memberDetail) {
          sortedContacts.push(memberDetail);
        }
      });
    });

    const sortedIndividuals = individuals.sort((a, b) => lastName(a.name).localeCompare(lastName(b.name)));
    sortedContacts = sortedContacts.concat(sortedIndividuals);
    return sortedContacts;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      let currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}


