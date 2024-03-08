import { EventEmitter, Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Document } from "./document.model";

@Injectable({
  providedIn: 'root'
})

export class DocumentService{
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  private editMode: boolean = false;
  private addMode: boolean = false;
  maxDocumentId: number;
  documents: Document[] = [];

  // Inject the HttpClient object into the DocumentService class through dependency injection.
  // The HttpClient object will be used to send HTTP requests to the server.
  constructor(private http: HttpClient) {}

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    // this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  // Call the HTTP service’s get() method to make an HTTP Get request to
  // get the array of documents from your Firebase database server. It returns
  // an Observable object because all HTTP requests are asynchronous (i.e. the
  // response will not be returned immediately). This Observable object waits
  // and listens for a response to be returned from the server.
  getDocuments() {
    // From Database:
    this.http.get('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          // this.documents.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
          this.documents.sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  getDocument(id: string): Document{
    for(let document of this.documents){
      if(document.id === id){
        return document;
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

  updateDocument(originalDocument: Document, newDocument: Document){
    if(!originalDocument || !newDocument){
      console.error('Document not found - update unsuccessful!');
      alert('Document not found - update unsuccessfull!');
      return of(null); // return observable
    }
    const foundDocument = this.documents.find(doc => doc.id === originalDocument.id);

    if (!foundDocument) {
      console.error('Document not found - update unsuccessful!');
      alert('Document not found - update unsuccessfull!');
      return of(null);
    }

    Object.assign(foundDocument, newDocument);
    // this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
    return of(foundDocument);
  }

  deleteDocument(document: Document) {
    if (!document) {
      console.error('Document not found - update unsuccessful!');
      alert('Document not found - deletion unsuccessfull!');
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      console.error('Document not found - update unsuccessful!');
      alert('Document not found - deletion unsuccessfull!');
      return;
    }
    this.documents.splice(pos, 1);
    // this.documentChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  storeDocuments() {
    let documents = JSON.stringify(this.documents);
    let headers = new HttpHeaders({'Content-Type': 'application/json'
    });

    this.http.put('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/documents.json', documents, {headers: headers})
      .subscribe(response => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      let currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

}
