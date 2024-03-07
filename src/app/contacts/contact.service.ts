import { EventEmitter, Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs";

import { Contact } from "./contact.model";

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
  constructor(private http: HttpClient) {}

  addContact(newContact: Contact){
    if(!newContact){
      return;
    }

    this.maxContactId = this.getMaxId()+1;
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
    // this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  getContacts() {
    // From Database:
    this.http.get('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          // this.contacts = this.sortContacts(this.contacts);
          // Sort the list of documents by name using the sort() JavaScript array
          // method. This method requires that you pass it a compare function. The compare
          // function is called for each element in the array. It receives two inputs, the
          // current element in the array and the next element in the array. If the current
          // element is less than the next element, return a minus one. If the first element
          // is greater than the next element, return a one; else, return zero.
          this.contacts.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
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
    console.log('updateContact in contact.service.ts');
    alert('updateContact in contact.service.ts');
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

    // Log the contents of the local array before updating
    console.log('Local Array Before Update:', this.contacts.slice());

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
    this.contacts.splice(pos, 1);
    // this.contactChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  storeContacts() {
    // let contacts = this.stringifyWithoutCircular(this.contacts);
    let contacts = JSON.stringify(this.contacts);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.put('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/contacts.json', contacts, {headers: headers})
      .subscribe(response => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
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

  // getMaxId(): number {
  //   let maxId = 0;
  //   for (let contact of this.contacts) {
  //     let currentId = parseInt(contact.id);
  //     if (currentId > maxId) {
  //       maxId = currentId;
  //     }
  //   }
  //   return maxId;
  // }

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


  stringifyWithoutCircular(obj: any): string {
    const cache = new Set();

    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          // Circular reference found, discard key
          return;
        }
        cache.add(value);
      }
      return value;
    });
  }

}


