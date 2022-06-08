import { db } from "../loginPage/Login";
import { ExportToCsv } from 'export-to-csv'

const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Non-FB Checklist',
    useTextFile: false,
    useBom: true,
    headers: [
        'Date of Audit',
        'Auditor',
        'Auditee', 
        'Comments', 

        'Section 1 Score', 
        'Total Section 1 Score',
        'Section 1 Score By Percentage',
        'Section 1 Percentage /100%',

        'Section 2 Score', 
        'Total Section 2 Score',
        'Section 2 Score By Percentage',
        'Section 2 Percentage /100%',

        'Section 3 Score', 
        'Total Section 3 Score',
        'Section 3 Score By Percentage',
        'Section 3 Percentage /100%',

        'Total Score',
        'Total Score By Percentage',

        'Rectification Deadline'
    ]
};

const csvExporter = new ExportToCsv(options);

function handleChange(date) {
    this.setState({
        auditDate: date
    })
}

function handlechange2(date2) {
    this.setState({
        rectificationDate: date2
    })
}

function onChecked(id) {
    const nonFB1 = this.state.nonFB1
    const index = nonFB1.findIndex(x => x.id === id);
    if (nonFB1[index].checked == "0") {
        nonFB1[index].checked = "1";
        this.setState({ crit1_score: this.state.crit1_score + 1 });
    }
    else if (nonFB1[index].checked == 1) {
        nonFB1[index].checked = "NA";
        this.setState({ crit1_score: this.state.crit1_score - 1 });
        this.setState({ total_crit1_score: this.state.total_crit1_score - 1 });
    }
    else {
        nonFB1[index].checked = "0";
        this.setState({ total_crit1_score: this.state.total_crit1_score + 1 });
    }
    this.setState(nonFB1)
}

function onChecked1_2(id) {
    const nonFB1_2 = this.state.nonFB1_2
    const index = nonFB1_2.findIndex(x => x.id === id);
    if (nonFB1_2[index].checked == "0") {
        nonFB1_2[index].checked = "1";
        this.setState({ crit1_score: this.state.crit1_score + 1 });
    }
    else if (nonFB1_2[index].checked == "1") {
        nonFB1_2[index].checked = "NA";
        this.setState({ crit1_score: this.state.crit1_score - 1 });
        this.setState({ total_crit1_score: this.state.total_crit1_score - 1 });
    }
    else {
        nonFB1_2[index].checked = "0";
        this.setState({ total_crit1_score: this.state.total_crit1_score + 1 });
    }
    this.setState(nonFB1_2)
}

function onChecked2(id) {
    const nonFB2 = this.state.nonFB2
    const index = nonFB2.findIndex(x => x.id === id);
    if (nonFB2[index].checked == "0") {
        nonFB2[index].checked = "1";
        this.setState({ crit2_score: this.state.crit2_score + 1 });
    }
    else if (nonFB2[index].checked == "1") {
        nonFB2[index].checked = "NA";
        this.setState({ crit2_score: this.state.crit2_score - 1 });
        this.setState({ total_crit2_score: this.state.total_crit2_score - 1 });
    }
    else {
        nonFB2[index].checked = "0";
        this.setState({ total_crit2_score: this.state.total_crit2_score + 1 });
    }
    this.setState(nonFB2)
}

function onChecked3(id) {
    const nonFB3 = this.state.nonFB3
    const index = nonFB3.findIndex(x => x.id === id);
    if (nonFB3[index].checked == "0") {
        nonFB3[index].checked = "1";
        this.setState({ crit3_score: this.state.crit3_score + 1 });
    }
    else if (nonFB3[index].checked == "1") {
        nonFB3[index].checked = "NA";
        this.setState({ crit3_score: this.state.crit3_score - 1 });
        this.setState({ total_crit3_score: this.state.total_crit3_score - 1 });
    }
    else {
        nonFB3[index].checked = "0";
        this.setState({ total_crit3_score: this.state.total_crit3_score + 1 });
    }
    this.setState(nonFB3)
}

function onChecked3_2(id) {
    const nonFB3_2 = this.state.nonFB3_2
    const index = nonFB3_2.findIndex(x => x.id === id);
    if (nonFB3_2[index].checked == "0") {
        nonFB3_2[index].checked = "1";
        this.setState({ crit3_score: this.state.crit3_score + 1 });
    }
    else if (nonFB3_2[index].checked == "1") {
        nonFB3_2[index].checked = "NA";
        this.setState({ crit3_score: this.state.crit3_score - 1 });
        this.setState({ total_crit3_score: this.state.total_crit3_score - 1 });
    }
    else {
        nonFB3_2[index].checked = "0";
        this.setState({ total_crit3_score: this.state.total_crit3_score + 1 });
    }
    this.setState(nonFB3_2)
}

function onChecked3_3(id) {
    const nonFB3_3 = this.state.nonFB3_3
    const index = nonFB3_3.findIndex(x => x.id === id);
    if (nonFB3_3[index].checked == "0") {
        nonFB3_3[index].checked = "1";
        this.setState({ crit3_score: this.state.crit3_score + 1 });
    }
    else if (nonFB3_3[index].checked == "1") {
        nonFB3_3[index].checked = "NA";
        this.setState({ crit3_score: this.state.crit3_score - 1 });
        this.setState({ total_crit3_score: this.state.total_crit3_score - 1 });
    }
    else {
        nonFB3_3[index].checked = "0";
        this.setState({ total_crit3_score: this.state.total_crit3_score + 1 });
    }
    this.setState(nonFB3_3)
}

function submitButtonHandle() {

    /*
    The var nonFBDataExport must be inside this function submitButtonHandle(),
    because this function is called from FBChecklist, where this.state is
    defined. If nonFBDataExport is outside of this function, this.state will
    not be defined.
    */

    var nonFBDataExport = [
        {
            auditDate: this.state.auditDate,
            auditAuditor: this.state.auditAuditor,
            auditAuditee: this.state.auditAuditee,
            auditComments: this.state.auditComments,

            crit1_score: this.state.crit1_score,
            total_crit1_score: this.state.total_crit1_score,
            crit1_scoreByPercentage: ((this.state.crit1_score / this.state.total_crit1_score) * 20).toFixed(2),
            crit1_percentage: ((this.state.crit1_score / this.state.total_crit1_score) * 100).toFixed(2),

            crit2_score: this.state.crit2_score,
            total_crit2_score: this.state.total_crit2_score,
            crit2_scoreByPercentage: ((this.state.crit2_score / this.state.total_crit2_score) * 40).toFixed(2),
            crit2_percentage: ((this.state.crit2_score / this.state.total_crit2_score) * 100).toFixed(2),

            crit3_score: this.state.crit3_score,
            total_crit3_score: this.state.total_crit3_score,
            crit3_scoreByPercentage: ((this.state.crit3_score / this.state.total_crit3_score) * 40).toFixed(2),
            crit3_percentage: ((this.state.crit3_score / this.state.total_crit3_score) * 100).toFixed(2),

            totalScore: this.state.crit1_score + this.state.crit2_score + this.state.crit3_score,
            total_scoreByPercentage: (((this.state.crit1_score / this.state.total_crit1_score) * 20) + ((this.state.crit2_score / this.state.total_crit2_score) * 40) + ((this.state.crit3_score / this.state.total_crit3_score) * 40)).toFixed(2),

            rectificationDate: this.state.rectificationDate
        }

    ];

    if (this.state.auditAuditee == "") {
        alert("Please fill in the name of auditee.")
    }

    else if (this.state.auditAuditor == "") {
        alert("Please fill in the name of auditor(s).")
    }

    else if (this.state.rectificationDate == "") {
        alert("Please select a deadline for rectification.")
    }

    else {
        db.ref('Audit Report').child('Non F&B').child(this.state.auditAuditee).child(this.state.auditDate.toString()).set({
            auditDate: this.state.auditDate.toString(),
            auditAuditor: this.state.auditAuditor,
            auditAuditee: this.state.auditAuditee,
            auditComments: this.state.auditComments,
            rectificationDate: this.state.rectificationDate.toString(),

            crit1_score: this.state.crit1_score,
            total_crit1_score: this.state.total_crit1_score,
            crit1_scoreByPercentage: ((this.state.crit1_score / this.state.total_crit1_score) * 20).toFixed(2),
            crit1_percentage: ((this.state.crit1_score / this.state.total_crit1_score) * 100).toFixed(2),

            crit2_score: this.state.crit2_score,
            total_crit2_score: this.state.total_crit2_score,
            crit2_scoreByPercentage: ((this.state.crit2_score / this.state.total_crit2_score) * 40).toFixed(2),
            crit2_percentage: ((this.state.crit2_score / this.state.total_crit2_score) * 100).toFixed(2),

            crit3_score: this.state.crit3_score,
            total_crit3_score: this.state.total_crit3_score,
            crit3_scoreByPercentage: ((this.state.crit3_score / this.state.total_crit3_score) * 40).toFixed(2),
            crit3_percentage: ((this.state.crit3_score / this.state.total_crit3_score) * 100).toFixed(2),

            totalScore: this.state.crit1_score + this.state.crit2_score + this.state.crit3_score,
            total_scoreByPercentage: (((this.state.crit1_score / this.state.total_crit1_score) * 20) + ((this.state.crit2_score / this.state.total_crit2_score) * 40) + ((this.state.crit3_score / this.state.total_crit3_score) * 40)).toFixed(2),

            nonFBimage: this.state.nonFBimage,

            tag1: this.state.tag1,
            tag2: this.state.tag2,
            tag3: this.state.tag3
        })
        csvExporter.generateCsv(nonFBDataExport);
        console.log(this.state);
        alert("Form submitted successfully. Returning to homepage.")
    }
}

export { handleChange, handlechange2, onChecked, onChecked1_2, onChecked2, onChecked3, onChecked3_2, onChecked3_3, submitButtonHandle }