import { LightningElement, track } from 'lwc';
import uploadResumeAndSubscribe from '@salesforce/apex/JobAlertController.uploadResumeAndSubscribe';

export default class JobAlertSubscription extends LightningElement {
    @track email      = '';
    @track frequency  = 'Everyday';
    @track fileName   = '';
    @track isLoading  = false;
    @track isSuccess  = false;
    @track errorMessage = '';

    fileBase64   = '';
    fileType     = '';
    fileNameFull = '';

    get frequencyOptions() {
        return [
            { label: 'Everyday', value: 'Everyday' },
            { label: 'Weekly',   value: 'Weekly'   }
        ];
    }

    handleEmailChange(evt)     { this.email     = evt.detail.value; }
    handleFrequencyChange(evt) { this.frequency = evt.detail.value; }

    handleFileChange(evt) {
        const file = evt.target.files[0];
        if (!file) return;

        // Validate file type client-side
        const allowed = ['application/pdf',
                         'application/msword',
                         'application/vnd.openxmlformats-officedocument' +
                         '.wordprocessingml.document'];
        if (!allowed.includes(file.type)) {
            this.errorMessage = 'Only PDF and DOC/DOCX files are allowed.';
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.errorMessage = 'File size must be under 5MB.';
            return;
        }

        this.fileName     = file.name;
        this.fileNameFull = file.name;
        this.fileType     = file.type;

        // Convert to base64 for Apex upload
        const reader = new FileReader();
        reader.onload = () => {
            // Strip the data URL prefix (e.g. "data:application/pdf;base64,")
            this.fileBase64 = reader.result.split(',')[1];
        };
        reader.readAsDataURL(file);
    }

    handleSubmit() {
        if (!this.email || !this.frequency || !this.fileBase64) {
            this.errorMessage = 'Please fill all fields and upload your resume.';
            return;
        }
        this.isLoading    = true;
        this.errorMessage = '';

        uploadResumeAndSubscribe({
            email      : this.email,
            frequency  : this.frequency,
            base64Data : this.fileBase64,
            fileName   : this.fileNameFull,
            fileType   : this.fileType
        })
        .then(() => {
            this.isSuccess = true;
            this.isLoading = false;
        })
        .catch(err => {
            this.errorMessage = err.body ? err.body.message : err.message;
            this.isLoading    = false;
        });
    }
}