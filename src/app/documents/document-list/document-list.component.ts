import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';

import { Document } from '../document.model';
import { DocumentItemComponent } from '../document-item/document-item.component';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit{
  documents: Document[] = [];
  documentId: string;
  subscription: Subscription;

  constructor(private documentService: DocumentService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.documentService.getDocuments();
    this.documentService.documentChangedEvent
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
        }
      );

    this.subscription = this.documentService.documentListChangedEvent
      .subscribe(
        (documentsList: Document[]) => {
          this.documents = documentsList;
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNewDocument(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  isEditMode(): boolean {
    return this.documentService.getEditMode();
  }

  isAddMode(): boolean {
    return this.documentService.getEditMode();
  }

}
