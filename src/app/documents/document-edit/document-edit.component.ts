import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { CanComponentDeactivate } from '../../shared/can-deactivate-guard.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  @ViewChild('documentEditForm') documentEditForm: NgForm;
  document: Document;
  newDocument: Document;
  // private editMode: boolean = false;
  id: string;
  subscription: Subscription;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe (
      (params: Params) => {
        this.id = params['id'];
        if (this.id === null || this.id === undefined) {
          this.newDocument = new Document("", "", "", "", []);
          this.id = "";
          this.document = new Document("", "", "", "", []);
          this.documentService.setEditMode(false);
          this.documentService.setAddMode(true);
          return;
        }
        this.document = this.documentService.getDocument(this.id);

        if (this.document === null || this.document === undefined) {
          return;
        }

        this.documentService.setEditMode(true);
        this.documentService.setAddMode(false);
        // clone the document object to a new object
        this.newDocument = JSON.parse(JSON.stringify(this.document));
      }
    );
  }

  onSubmit(form: NgForm) {
    this.newDocument = new Document(
      this.document.id,
      form.value.name,
      form.value.description,
      form.value.url,
      form.value.children,
    );

    if (this.documentService.getEditMode()) {
      this.documentService.updateDocument(this.document, this.newDocument);
    } else {
      this.documentService.addDocument(this.newDocument);
    }
    this.documentService.setEditMode(false);
    this.documentService.setAddMode(false);
    this.router.navigate(['/documents']);
  }

  onCancel() {
    if (this.canDeactivate()) {
      this.documentService.setEditMode(false);
      this.documentService.setAddMode(false);
      this.router.navigate(['/documents']);
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.documentEditForm.dirty) {
      return confirm('Do you want to discard the changes?');
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
