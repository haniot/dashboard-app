import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {

  languages = {
    'pt': 'Português Brasileiro',
    'en': 'Inglês'
  };

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
