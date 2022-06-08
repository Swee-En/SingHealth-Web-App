import { db } from "../loginPage/Login";
import { ExportToCsv } from 'export-to-csv'

const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'F&B Checklist',
    useTextFile: false,
    useBom: true,
    //useKeysAsHeaders: true,
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

        'Section 5 Score', 
        'Total Section 5 Score',
        'Section 5 Score By Percentage',
        'Section 5 Percentage /100%',

        'Total Score',
        'Total Score By Percentage',

        'Final Comments',
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
    const part1 = this.state.part1
    const index = part1.findIndex(x => x.id === id);
    if (part1[index].checked == "0") {
        part1[index].checked = "1";
        this.setState({ crit1_score: this.state.crit1_score + 1 });
    }
    else if (part1[index].checked == 1) {
        part1[index].checked = "NA";
        this.setState({ crit1_score: this.state.crit1_score - 1 });
        this.setState({ total_crit1_score: this.state.total_crit1_score - 1 });
    }
    else {
        part1[index].checked = "0";
        this.setState({ total_crit1_score: this.state.total_crit1_score + 1 });
    }
    this.setState(part1)
}

function onChecked1_2(id) {
    const part1_2 = this.state.part1_2
    const index = part1_2.findIndex(x => x.id === id);
    if (part1_2[index].checked == "0") {
        part1_2[index].checked = "1";
        this.setState({ crit1_score: this.state.crit1_score + 1 });
    }
    else if (part1_2[index].checked == "1") {
        part1_2[index].checked = "NA";
        this.setState({ crit1_score: this.state.crit1_score - 1 });
        this.setState({ total_crit1_score: this.state.total_crit1_score - 1 });
    }
    else {
        part1_2[index].checked = "0";
        this.setState({ total_crit1_score: this.state.total_crit1_score + 1 });
    }
    this.setState(part1_2)
}

function onChecked2(id) {
    const part2 = this.state.part2
    const index = part2.findIndex(x => x.id === id);
    if (part2[index].checked == "0") {
        part2[index].checked = "1";
        this.setState({ crit2_score: this.state.crit2_score + 1 });
    }
    else if (part2[index].checked == "1") {
        part2[index].checked = "NA";
        this.setState({ crit2_score: this.state.crit2_score - 1 });
        this.setState({ total_crit2_score: this.state.total_crit2_score - 1 });
    }
    else {
        part2[index].checked = "0";
        this.setState({ total_crit2_score: this.state.total_crit2_score + 1 });
    }
    this.setState(part2)
}

function onChecked2_2(id) {
    const part2_2 = this.state.part2_2
    const index = part2_2.findIndex(x => x.id === id);
    if (part2_2[index].checked == "0") {
        part2_2[index].checked = "1";
        this.setState({ crit2_score: this.state.crit2_score + 1 });
    }
    else if (part2_2[index].checked == "1") {
        part2_2[index].checked = "NA";
        this.setState({ crit2_score: this.state.crit2_score - 1 });
        this.setState({ total_crit2_score: this.state.total_crit2_score - 1 });
    }
    else {
        part2_2[index].checked = "0";
        this.setState({ total_crit2_score: this.state.total_crit2_score + 1 });
    }
    this.setState(part2_2)
}

function onChecked3(id) {
    const part3 = this.state.part3
    const index = part3.findIndex(x => x.id === id);
    if (part3[index].checked == "0") {
        part3[index].checked = "1";
        this.setState({ crit3_score: this.state.crit3_score + 1 });
    }
    else if (part3[index].checked == "1") {
        part3[index].checked = "NA";
        this.setState({ crit3_score: this.state.crit3_score - 1 });
        this.setState({ total_crit3_score: this.state.total_crit3_score - 1 });
    }
    else {
        part3[index].checked = "0";
        this.setState({ total_crit3_score: this.state.total_crit3_score + 1 });
    }
    this.setState(part3)
}

function onChecked3_2(id) {
    const part3_2 = this.state.part3_2
    const index = part3_2.findIndex(x => x.id === id);
    if (part3_2[index].checked == "0") {
        part3_2[index].checked = "1";
        this.setState({ crit3_score: this.state.crit3_score + 1 });
    }
    else if (part3_2[index].checked == "1") {
        part3_2[index].checked = "NA";
        this.setState({ crit3_score: this.state.crit3_score - 1 });
        this.setState({ total_crit3_score: this.state.total_crit3_score - 1 });
    }
    else {
        part3_2[index].checked = "0";
        this.setState({ total_crit3_score: this.state.total_crit3_score + 1 });
    }
    this.setState(part3_2)
}

function onChecked5(id) {
    const part5 = this.state.part5
    const index = part5.findIndex(x => x.id === id);
    if (part5[index].checked == "0") {
        part5[index].checked = "1";
        this.setState({ crit5_score: this.state.crit5_score + 1 });
    }
    else if (part5[index].checked == "1") {
        part5[index].checked = "NA";
        this.setState({ crit5_score: this.state.crit5_score - 1 });
        this.setState({ total_crit5_score: this.state.total_crit5_score - 1 });
    }
    else {
        part5[index].checked = "0";
        this.setState({ total_crit5_score: this.state.total_crit5_score + 1 });
    }
    this.setState(part5)
}

function onChecked5_2(id) {
    const part5_2 = this.state.part5_2
    const index = part5_2.findIndex(x => x.id === id);
    if (part5_2[index].checked == "0") {
        part5_2[index].checked = "1";
        this.setState({ crit5_score: this.state.crit5_score + 1 });
    }
    else if (part5_2[index].checked == "1") {
        part5_2[index].checked = "NA";
        this.setState({ crit5_score: this.state.crit5_score - 1 });
        this.setState({ total_crit5_score: this.state.total_crit5_score - 1 });
    }
    else {
        part5_2[index].checked = "0";
        this.setState({ total_crit5_score: this.state.total_crit5_score + 1 });
    }
    this.setState(part5_2)
}

function onChecked5_3(id) {
    const part5_3 = this.state.part5_3
    const index = part5_3.findIndex(x => x.id === id);
    if (part5_3[index].checked == "0") {
        part5_3[index].checked = "1";
        this.setState({ crit5_score: this.state.crit5_score + 1 });
    }
    else if (part5_3[index].checked == "1") {
        part5_3[index].checked = "NA";
        this.setState({ crit5_score: this.state.crit5_score - 1 });
        this.setState({ total_crit5_score: this.state.total_crit5_score - 1 });
    }
    else {
        part5_3[index].checked = "0";
        this.setState({ total_crit5_score: this.state.total_crit5_score + 1 });
    }
    this.setState(part5_3)
}

function submitButtonHandle() {
    
    /*
    The var fbDataExport must be inside this function submitButtonHandle(),
    because this function is called from FBChecklist, where this.state is
    defined. If fbDataExport is outside of this function, this.state will
    not be defined.
    */

    var fbDataExport = [
        {
            auditDate: this.state.auditDate,
            auditAuditor: this.state.auditAuditor,
            auditAuditee: this.state.auditAuditee,
            auditComments: this.state.auditComments,

            crit1_score: this.state.crit1_score,
            total_crit1_score: this.state.total_crit1_score,
            crit1_scoreByPercentage: ((this.state.crit1_score / this.state.total_crit1_score) * 10).toFixed(2),
            crit1_percentage: ((this.state.crit1_score / this.state.total_crit1_score) * 100).toFixed(2),

            crit2_score: this.state.crit2_score,
            total_crit2_score: this.state.total_crit2_score,
            crit2_scoreByPercentage: ((this.state.crit2_score / this.state.total_crit2_score) * 20).toFixed(2),
            crit2_percentage: ((this.state.crit2_score / this.state.total_crit2_score) * 100).toFixed(2),

            crit3_score: this.state.crit3_score,
            total_crit3_score: this.state.total_crit3_score,
            crit3_scoreByPercentage: ((this.state.crit3_score / this.state.total_crit3_score) * 35).toFixed(2),
            crit3_percentage: ((this.state.crit3_score / this.state.total_crit3_score) * 100).toFixed(2),

            crit5_score: this.state.crit5_score,
            total_crit5_score: this.state.total_crit5_score,
            crit5_scoreBypercentage: ((this.state.crit5_score / this.state.total_crit5_score) * 20).toFixed(2),
            crit5_percentage: ((this.state.crit5_score / this.state.total_crit5_score) * 100).toFixed(2),

            totalScore: this.state.crit1_score + this.state.crit2_score + this.state.crit3_score + this.state.crit5_score,
            total_scoreByPercentage: (((this.state.crit1_score / this.state.total_crit1_score) * 10) + ((this.state.crit2_score / this.state.total_crit2_score) * 20) + ((this.state.crit3_score / this.state.total_crit3_score) * 35) + ((this.state.crit5_score / this.state.total_crit5_score) * 20)).toFixed(2),

            findingText: this.state.findingText,
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
        db.ref('Audit Report').child('F&B').child(this.state.auditAuditee).child(this.state.auditDate.toString()).set({
            auditDate: this.state.auditDate.toString(),
            auditAuditor: this.state.auditAuditor,
            auditAuditee: this.state.auditAuditee,
            auditComments: this.state.auditComments,
            rectificationDate: this.state.rectificationDate.toString(),

            crit1_score: this.state.crit1_score,
            total_crit1_score: this.state.total_crit1_score,
            crit1_scoreByPercentage: ((this.state.crit1_score / this.state.total_crit1_score) * 10).toFixed(2),
            crit1_percentage: ((this.state.crit1_score / this.state.total_crit1_score) * 100).toFixed(2),

            crit2_score: this.state.crit2_score,
            total_crit2_score: this.state.total_crit2_score,
            crit2_scoreByPercentage: ((this.state.crit2_score / this.state.total_crit2_score) * 20).toFixed(2),
            crit2_percentage: ((this.state.crit2_score / this.state.total_crit2_score) * 100).toFixed(2),

            crit3_score: this.state.crit3_score,
            total_crit3_score: this.state.total_crit3_score,
            crit3_scoreByPercentage: ((this.state.crit3_score / this.state.total_crit3_score) * 35).toFixed(2),
            crit3_percentage: ((this.state.crit3_score / this.state.total_crit3_score) * 100).toFixed(2),

            crit5_score: this.state.crit5_score,
            total_crit5_score: this.state.total_crit5_score,
            crit5_scoreBypercentage: ((this.state.crit5_score / this.state.total_crit5_score) * 20).toFixed(2),
            crit5_percentage: ((this.state.crit5_score / this.state.total_crit5_score) * 100).toFixed(2),

            totalScore: this.state.crit1_score + this.state.crit2_score + this.state.crit3_score + this.state.crit5_score,
            total_scoreByPercentage: (((this.state.crit1_score / this.state.total_crit1_score) * 10) + ((this.state.crit2_score / this.state.total_crit2_score) * 20) + ((this.state.crit3_score / this.state.total_crit3_score) * 35) + ((this.state.crit5_score / this.state.total_crit5_score) * 20)).toFixed(2),

            findingText: this.state.findingText,

            FBimage: this.state.FBimage,

            tag1: this.state.tag1,
            tag2: this.state.tag2,
            tag3: this.state.tag3,
            tag5: this.state.tag5
        })
        csvExporter.generateCsv(fbDataExport);
        console.log(this.state);
        alert("Form submitted successfully. Returning to homepage.")
    }
}

export { handleChange, handlechange2, onChecked, onChecked1_2, onChecked2, onChecked2_2, onChecked3, onChecked3_2, onChecked5, onChecked5_2, onChecked5_3, submitButtonHandle }