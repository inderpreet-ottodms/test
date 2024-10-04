import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-rfq-part-questions',
  templateUrl: './rfq-part-questions.component.html',
  styleUrls: ['./rfq-part-questions.component.scss']
})
export class RfqPartQuestionsComponent implements OnInit {

  @Input('partCategoryId') processCategoryId;
  @Input('selectedQuestion') selectedQuestion;
  @Input('setDisabled') setDisabled;
  @Output() emitOptionChange = new EventEmitter();
  questionList: any = [];
  // questionList = [{
  //   questionId: 1,
  //   question:'Do you have existing tooling for these parts?',
  //   // optionList:[{label:  'Yes', value : true }, {label:  'No', value : false }]
  // },
  // {
  //   questionId: 1,
  //   question:'Do you want a quote for parts only?',
  //   // optionList:[{label:  'Yes', value : true }, {label:  'No', value : false }]
  // }];

  constructor(private _rfqService: RfqService) {}

  ngOnInit() {
    this.getQuestionList();
    console.log(this.setDisabled);
  }

  getQuestionList() {
    this._rfqService.getQuestionList(this.processCategoryId).subscribe(
      response => {
        if (!response.isError) {
          this.questionList = response.data;
          this.questionList.forEach(element => {
            if (this.selectedQuestion !== null && this.selectedQuestion !== undefined && this.selectedQuestion !== '') {
              let index = this.selectedQuestion.findIndex(x => x.questionId == element.questionId);
              if (index != -1) {
                element.optionSelected = this.selectedQuestion[index].answer;
              } else {
                element.optionSelected = null;
              }
            } else {
              element.optionSelected = null;
            }
            element.optionList = [{
              label: 'Yes, I want the manufacturer to make the tooling. Quote for tooling and parts.',
              value: 'Yes, I want the manufacturer to make the tooling. Quote for tooling and parts.'
            }, {
              label: 'No, I want the manufacturer to use my tools. Quote for parts only.',
              value: 'No, I want the manufacturer to use my tools. Quote for parts only.'
            }];
          });
        }
      }
    );
  }
  checkAnswer(questionId, selectedVal) {
    this.emitOptionChange.emit({
      questionId: questionId,
      value: selectedVal
    });
    // console.log(quetionId, selectedVal);
  }
}
