import { db } from "../Login";

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
    if (this.state.auditAuditee == "") {
        alert("Please fill in the name of auditee.")
    }

    else if (this.state.auditAuditor == "") {
        alert("Please fill in the name of auditor(s).")
    }

    else if (this.state.rectificationDate == ""){
        alert("Please select a deadline for rectification.")
    }

    else {
        db.ref('Audit Report').child('Non F&B').child(this.state.auditAuditee).set({
            auditDate: this.state.auditDate.toLocaleString(),
            auditAuditor: this.state.auditAuditor,
            auditComments: this.state.auditComments,
            rectificationDate: this.state.rectificationDate.toLocaleString(),

            crit1_score: this.state.crit1_score,
            total_crit1_score: this.state.total_crit1_score,

            crit2_score: this.state.crit2_score,
            total_crit2_score: this.state.total_crit2_score,

            crit3_score: this.state.crit3_score,
            total_crit3_score: this.state.total_crit3_score,

            crit1_percentage: ((this.state.crit1_score / this.state.total_crit1_score) * 10).toFixed(2),
            crit2_percentage: ((this.state.crit2_score / this.state.total_crit2_score) * 20).toFixed(2),
            crit3_percentage: ((this.state.crit3_score / this.state.total_crit3_score) * 35).toFixed(2),
            total_percentage: (((this.state.crit1_score + this.state.crit2_score + this.state.crit3_score) / (this.state.total_crit1_score + this.state.total_crit2_score + this.state.total_crit3_score)) * 100).toFixed(2),

            nonFBimage: this.state.nonFBimage,

            tag1: this.state.tag1,
            tag2: this.state.tag2,
            tag3: this.state.tag3
        })
        alert("Form submitted successfully. Returning to homepage.")
    }
}

export { handleChange, handlechange2, onChecked, onChecked1_2, onChecked2, onChecked3, onChecked3_2, onChecked3_3, submitButtonHandle }