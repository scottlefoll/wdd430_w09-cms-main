import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../win-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  id: string;
  nativeWindow: any;

  constructor(private documentService: DocumentService,
              private router: Router,
              private route: ActivatedRoute,
              private windRefService: WindRefService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.document = this.documentService.getDocument(this.id);
        }
      );

    this.nativeWindow = this.windRefService.getNativeWindow();
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onCreate() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onUpdate() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete() {

    if (confirm('Are you sure you want to delete the ' + this.document.name + ' document?')) {
      this.documentService.deleteDocument(this.document);
      this.router.navigate(['/documents']);
    } else {;
      return;
    }
  }

}
