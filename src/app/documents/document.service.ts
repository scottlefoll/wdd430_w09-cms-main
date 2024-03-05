import { EventEmitter, Injectable } from "@angular/core";
import { Subject, of } from "rxjs";

import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";

@Injectable({
  providedIn: 'root'
})

export class DocumentService{
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;
  private editMode = false;

  documents: Document[] = [];

  constructor() {
    this.documents = this.sortDocuments(MOCKDOCUMENTS);
    this.maxDocumentId = this.getMaxId();
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments(){
    return this.documents.slice();
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

  updateDocument(originalDocument: Document, newDocument: Document){
    if(!originalDocument || !newDocument){
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
    alert('Document updated unsuccessfully!');
    this.documentListChangedEvent.next(this.documents.slice());

    return of(foundDocument);
  }

  deleteDocument(document: Document) {
    if (!document) {
      alert('Document not found - deletion unsuccessfull!');
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      alert('Document not found - deletion unsuccessfull!');
      return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.next(this.documents.slice());
    alert('deleteDocument using this.documentChangedEvent.next in document.service.');
    console.log('deleteDocument using this.documentChangedEvent.next in document.service.');
  }

  sortDocuments(documents: Document[]): Document[] {
    let sortedDocuments: Document[] = [];

    documents.forEach(doc => {
      if (doc.children && doc.children.length > 0) {
        this.sortDocuments(doc.children);
      }
    });

    sortedDocuments = documents.sort((a, b) => a.name.localeCompare(b.name));
    return sortedDocuments;
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


