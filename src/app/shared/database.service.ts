import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseServiceService {

  constructor() { }

  storeCollDocuments() {
    let documents = JSON.stringify(this.documents);
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put('https://wdd430-cms-5cd5d-default-rtdb.firebaseio.com/documents.json', documents, {headers: headers})
      .subscribe(response => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }
}
