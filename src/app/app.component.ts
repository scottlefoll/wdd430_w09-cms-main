import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WeLearn CMS';
  // implement selected feature with the switchview method
  // selectedFeature: string = "documents";

  // switchView(selectedFeature: string) {
  //   if (this.selectedFeature?.toUpperCase() !== selectedFeature.toUpperCase()) {
  //     this.selectedFeature = selectedFeature;
  //   }
  // }

}
