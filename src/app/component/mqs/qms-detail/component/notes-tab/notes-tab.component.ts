import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {
  QmsService
} from '../../../../../core/services/qms/qms.service';
import {
  ConfirmationService
} from 'primeng/api';
import {
  ToastrService
} from 'ngx-toastr';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  QMSQuoteNotesFilterViewModel,
  QMSNotesTabViewModel
} from './notesModel';
import {
  ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.scss'],
  providers: [ConfirmationService, QMSQuoteNotesFilterViewModel, QMSNotesTabViewModel]
})
export class NotesTabComponent implements OnInit {
  isNotesAvailable: boolean;
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  totalRow: number;
  isLoader: boolean;
  pageStart = 1;
  pagesIndex: Array < number > ;
  items: QMSNotesTabViewModel[];
  qmsNotesTabViewModel: QMSNotesTabViewModel[];

  @Output() noteData = new EventEmitter < number > ();
  openNoteDrawer(noteId) {
    setTimeout(() => {
      this._qmsService.set(true, 'showSidePanel');
      this._qmsService.set(true, 'isNoteDrawer');
      this._qmsService.set(false, 'isMessageSendDrawer');
      this._qmsService.set(false, 'isMessageQmsDrawer');
    }, 1000);
    this.noteData.emit(noteId);
  }

  constructor(private _qmsService: QmsService,
    private confirmationService: ConfirmationService, private _rfqService: RfqService,
    private _toastr: ToastrService, private route: ActivatedRoute,
    private qmsQuoteNotesFilterViewModel: QMSQuoteNotesFilterViewModel) {
    this.isNotesAvailable = true;
    this.isLoader = false;
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isNoteDrawer');
    this._qmsService.set(false, 'isMessageDrawer');
  }

  ngOnInit() {
    this.getNotes();
  }

  /* This function is uded to get the note list. */
  getNotes() {
    this.items = [];
    this.isLoader = true;
    this.qmsQuoteNotesFilterViewModel.qmsQuoteId = Number(this.route.snapshot.params['id']);
    this._qmsService.GetQmsQuoteNotes(this.qmsQuoteNotesFilterViewModel).subscribe(
      result => {
        this.qmsNotesTabViewModel = result.data;
        if (this.qmsNotesTabViewModel.length !== 0) {
          this.totalRow = result.totalRecords;
          this.items = this.qmsNotesTabViewModel;
          this.isLoader = false;
          this.isNotesAvailable = true;
        } else {
          this.totalRow = 0;
          this.isLoader = false;
          this.items = [];
          this.isNotesAvailable = false;
        }
        this.init();
      },
      error => {
        this._rfqService.handleError(error);
        this.isLoader = false;
        this.isNotesAvailable = false;
        this.items = [];
        this.totalRow = 0;
      },
      () => {}
    );
  }

  /* Pagination function starts */
  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.qmsQuoteNotesFilterViewModel.pageNumber = this.currentIndex;
    this.getNotes();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.qmsQuoteNotesFilterViewModel.pageNumber = this.currentIndex;
    this.getNotes();
  }
  init() {
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.totalRow / this.pageSize));
    if (this.totalRow % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.qmsQuoteNotesFilterViewModel.pageNumber = this.currentIndex;
    this.getNotes();
  }

  refreshItems() {
    // this.items = this.iBuyerQuotesListColl.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
    this.pagesIndex = this.fillArray();
  }

  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  /* Pagination function ends. */

  /* This function is used to delete the note. */
  DeleteNote(noteId) {
    const noteToDelete = {
      qmsQuoteNoteIds: []
    }
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to delete this Note?.',
      header: 'Delete Note',
      icon: null,
      accept: () => {
        noteToDelete.qmsQuoteNoteIds.push(noteId);
          this._qmsService.deleteQmsQuoteNotes(noteToDelete).subscribe(
          result => {
            if (!result.isError) {
              this._toastr.success('Note is deleted', 'Success!');
              this.getNotes();
            } else {
              // this._toastr.error(result.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          }
        );
      },
      reject: () => {
      }
    });

  }

  /* This function is used to reload notes when note is added from the drawer. */
  reloadNotes() {
    if (this._rfqService.get('noteAdded')) {
      this._rfqService.set(false, 'noteAdded');
      this.getNotes();
    }
  }
}
