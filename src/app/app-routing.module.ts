import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactsComponent } from './contacts/contacts.component';
import { DocumentsComponent } from './documents/documents.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { DocumentListComponent } from './documents/document-list/document-list.component';
import { MessageListComponent } from './messages/message-list/message-list.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { ContactItemComponent } from './contacts/contact-item/contact-item.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';
import { DocumentItemComponent } from './documents/document-item/document-item.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';
import { MessageEditComponent } from './messages/message-edit/message-edit.component';
import { MessageItemComponent } from './messages/message-item/message-item.component';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full'},
  { path: 'contacts', component: ContactsComponent, children: [
    { path: 'new', component: ContactEditComponent},
    { path: ':id', component: ContactDetailComponent},
    { path: ':id/edit', component: ContactEditComponent}
  ]},
  { path: 'documents', component: DocumentsComponent, children: [
    { path: 'new', component: DocumentEditComponent},
    { path: ':id', component: DocumentDetailComponent},
    { path: ':id/edit', component: DocumentEditComponent}
  ]},
  { path: 'messages', component: MessageListComponent, children: [
    { path: ':id', component: MessageItemComponent},
    { path: ':id/edit', component: MessageEditComponent}
  ]},
  { path: 'contact-list', component: ContactListComponent},
  { path: 'message-list', component: MessageListComponent},
  { path: 'document-list', component: DocumentListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
