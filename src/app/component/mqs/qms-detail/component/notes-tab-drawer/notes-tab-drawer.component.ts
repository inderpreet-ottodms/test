import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  CustomValidatorService
} from '../../../../../core/services/validator/custom-validator.service';
import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
import {
  QMSNotesTabViewModel
} from '../notes-tab/notesModel';
import {
  ActivatedRoute
} from '@angular/router';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  ToastrService
} from 'ngx-toastr';

@Component({
  selector: 'app-notes-tab-drawer',
  templateUrl: './notes-tab-drawer.component.html',
  styleUrls: ['./notes-tab-drawer.component.scss'],
  providers: [QMSNotesTabViewModel]
})
export class NotesTabDrawerComponent implements OnInit, OnDestroy {

  noteForm: FormGroup;
  labelFocus: any;
  qmsNotesTabViewModel = new QMSNotesTabViewModel();
  @Input() noteId: number;
  isButtonClicked: boolean = false;
  constructor(private _customValidatorsService: CustomValidatorService,
    private _fb: FormBuilder, private route: ActivatedRoute,
    private _qmsService: QmsService,
    private _rfqService: RfqService,
    private _toastr: ToastrService) {
    this.qmsNotesTabViewModel.qmsQuoteId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    if (this.noteId !== -1 && this.noteId !== null && this.noteId !== undefined) {
      this.getQmsQuoteNotesById(this.noteId);
    }
    this.noteForm = this._fb.group({
      noteTitle: [this.qmsNotesTabViewModel.qmsNotesTitle, Validators.required],
      noteBody: [this.qmsNotesTabViewModel.qmsNotes, Validators.required],
    });
  }
  getQmsQuoteNotesById(noteId) {
    this._qmsService.GetQmsQuoteNotesById(noteId).subscribe(
      result => {
        if (!result.isError) {
          this.qmsNotesTabViewModel = result.data;
          this.noteForm = this._fb.group({
            noteTitle: [this.qmsNotesTabViewModel.qmsNotesTitle, Validators.required],
            noteBody: [this.qmsNotesTabViewModel.qmsNotes, Validators.required],
          });
        } else {
          // this.termsConditionViewModel = [];
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.noteForm, field);
  }
  validateBtn() {
    const title = this.noteForm.value.noteTitle;
    const body = this.noteForm.value.noteBody;
    if (title === '' || body === '') {
      return true;
    } else {
      return false;
    }
  }
  checkBodyField(field: string) {
    return this.noteForm.value[field] === '';
  }
  setLabel(flag: string) {
    this.labelFocus = flag;
  }
  closeNoteDrawer() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isNoteDrawer');
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  onNoteSave() {
    if(!this.isButtonClicked){
      this.isButtonClicked = true;
    this.qmsNotesTabViewModel.isHidden = false;
    this.qmsNotesTabViewModel.qmsNotes = this.noteForm.value.noteBody;
    this.qmsNotesTabViewModel.qmsNotesTitle = this.noteForm.value.noteTitle;
    this.qmsNotesTabViewModel.supplierContactId = this.loggedId;
    this._qmsService.QMSQuoteAddNotes(this.qmsNotesTabViewModel).subscribe(
      result => {
        if (!result.isError) {
          this._toastr.success('Note is saved', 'Success!');
          this._rfqService.set(true, 'noteAdded');
          this.closeNoteDrawer();
        }
        this.isButtonClicked = false;
      }, error => {
        this.isButtonClicked = false;
      });
    }
  }
  ngOnChanges(changes) {
    if (this.noteId !== -1 && this.noteId !== null && this.noteId !== undefined) {
      this.getQmsQuoteNotesById(this.noteId);
    }
  }
  ngOnDestroy() {
    this.closeNoteDrawer();
  }
}
