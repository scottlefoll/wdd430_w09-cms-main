import { EventEmitter, Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Message } from "./message.model";

@Injectable({
  providedIn: 'root'
})

export class MessageService{
  messageSelectedEvent = new EventEmitter<Message>();
  messageChangedEvent = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();
  private editMode: boolean = false;
  private addMode: boolean = false;
  maxMessageId: number;
  messages: Message[] = [];

  constructor(private http: HttpClient) {}

  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }

    this.maxMessageId++;
    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);
    // this.messageListChangedEvent.next(this.messages.slice());
    this.storeMessages();
  }

  getMessages() {
    // From Database:
    this.http.get('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messages.sort((a, b) => a.id.localeCompare(b.id));
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  getMessage(id: string): Message{
    for(let message of this.messages){
      if(message.id === id){
        return message;
      }
    }
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

  updateMessage(originalMessage: Message, newMessage: Message){
    if(!originalMessage || !newMessage){
      console.error('Message not found - update unsuccessful!');
      alert('Message not found - update unsuccessfull!');
      return of(null); // return observable
    }
    const foundMessage = this.messages.find(doc => doc.id === originalMessage.id);

    if (!foundMessage) {
      console.error('Message not found - update unsuccessful!');
      alert('Message not found - update unsuccessfull!');
      return of(null);
    }

    Object.assign(foundMessage, newMessage);
    // this.messageListChangedEvent.next(this.messages.slice());
    this.storeMessages();
    return of(foundMessage);
  }

  deleteMessage(message: Message) {
    if (!message) {
      console.error('Message not found - update unsuccessful!');
      alert('Message not found - deletion unsuccessfull!');
      return;
    }
    const pos = this.messages.indexOf(message);
    if (pos < 0) {
      console.error('Message not found - update unsuccessful!');
      alert('Message not found - deletion unsuccessfull!');
      return;
    }
    this.messages.splice(pos, 1);
    // this.messageChangedEvent.next(this.messages.slice());
    this.storeMessages();
  }

  deleteMessages(senderId: string) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].sender === senderId) {
        this.messages.splice(i, 1);
      }
    }
    // this.messageChangedEvent.next(this.messages.slice());
    this.storeMessages();
  }

  storeMessages() {
    let messages = JSON.stringify(this.messages);
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/messages.json', messages, {headers: headers})
      .subscribe(response => {
        this.messageListChangedEvent.next(this.messages.slice());
      });
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }


}


