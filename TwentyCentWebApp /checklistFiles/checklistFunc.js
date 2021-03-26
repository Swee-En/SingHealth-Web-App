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
        db.ref('Audit Report').child('F&B').child(this.state.auditAuditee).set({
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

            crit5_score: this.state.crit5_score,
            total_crit5_score: this.state.total_crit5_score,

            findingText: this.state.findingText,

            crit1_percentage: ((this.state.crit1_score / this.state.total_crit1_score) * 10).toFixed(2),
            crit2_percentage: ((this.state.crit2_score / this.state.total_crit2_score) * 20).toFixed(2),
            crit3_percentage: ((this.state.crit3_score / this.state.total_crit3_score) * 35).toFixed(2),
            crit5_percentage: ((this.state.crit5_score / this.state.total_crit5_score) * 20).toFixed(2),
            total_percentage: (((this.state.crit1_score + this.state.crit2_score + this.state.crit3_score + this.state.crit5_score) / (this.state.total_crit1_score + this.state.total_crit2_score + this.state.total_crit3_score + this.state.total_crit5_score)) * 100).toFixed(2),

            FBimage: this.state.FBimage,

            tag1: this.state.tag1,
            tag2: this.state.tag2,
            tag3: this.state.tag3,
            tag5: this.state.tag5
        })
        alert("Form submitted successfully. Returning to homepage.")
    }
}

export { handleChange, handlechange2, onChecked, onChecked1_2, onChecked2, onChecked2_2, onChecked3, onChecked3_2, onChecked5, onChecked5_2, onChecked5_3, submitButtonHandle }